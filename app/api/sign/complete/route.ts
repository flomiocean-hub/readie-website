import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { generateSignedPdf } from '@/lib/pdf/generateSignedPdf'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { token, signature_name, signature_image } = await request.json()
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown'

    if (!token || !signature_name?.trim()) {
      return NextResponse.json({ error: '缺少必要參數' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const { data: doc } = await supabase
      .from('documents')
      .select('*')
      .eq('sign_token', token)
      .single()

    if (!doc) return NextResponse.json({ error: '無效的簽約連結' }, { status: 404 })
    if (doc.status === 'signed') return NextResponse.json({ error: '此文件已完成簽署' }, { status: 400 })

    // 確認 OTP 已驗證
    const { data: event } = await supabase
      .from('sign_events')
      .select('id, otp_verified_at')
      .eq('document_id', doc.id)
      .not('otp_verified_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!event) return NextResponse.json({ error: '請先完成 Email 驗證' }, { status: 400 })

    const now = new Date().toISOString()
    const signedAt = new Date(now).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    const docTypeLabel = doc.type === 'nda' ? '保密合約書' : '報價確認單'
    const fileName = `${doc.contract_number}-signed.pdf`

    // 先產 PDF——若失敗就不改 DB 狀態，讓使用者可重試
    let pdfBuffer: Buffer
    try {
      pdfBuffer = await generateSignedPdf({
        contract_number: doc.contract_number,
        type: doc.type,
        client_name: doc.client_name,
        client_company: doc.client_company,
        client_email: doc.client_email,
        line_items: doc.line_items ?? [],
        discount_type: doc.discount_type,
        discount_value: doc.discount_value,
        payment_terms: doc.payment_terms,
        payment_note: doc.payment_note,
        note: doc.note,
        signature_name,
        signature_image: signature_image ?? null,
        signed_at: now,
        signer_ip: ip,
      })
    } catch (pdfErr) {
      const msg = pdfErr instanceof Error ? pdfErr.message : String(pdfErr)
      console.error('[PDF generation failed]', pdfErr)
      return NextResponse.json({ error: `PDF 生成失敗：${msg}` }, { status: 500 })
    }

    const pdfBase64 = pdfBuffer.toString('base64')
    const attachments = [{ filename: fileName, content: pdfBase64 }]

    // PDF 產好後才寫入 DB 狀態，確保失敗不會卡住
    await supabase.from('documents').update({
      status: 'signed',
      signed_at: now,
      signer_ip: ip,
      signature_image: signature_image ?? null,
    }).eq('id', doc.id)

    await supabase.from('sign_events').update({
      signature_text: signature_name,
      signed_at: now,
      ip_address: ip,
    }).eq('id', event.id)

    // 寄通知給客戶（含 PDF 附件）
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'sign@readie.ai',
      to: doc.client_email,
      subject: `【Readie Sign】${docTypeLabel}簽署完成 — ${doc.contract_number}`,
      attachments,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9ca3af; margin-bottom: 24px;">Readie Sign</div>
          <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px;">簽署完成確認</h1>
          <p style="font-size: 14px; color: #374151; margin: 0 0 24px; line-height: 1.6;">
            ${doc.client_name} 您好，<br/>
            以下文件已完成電子簽署。<strong>已簽署合約 PDF 附於此信件，請妥善留存。</strong>
          </p>
          <div style="background: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 24px; font-size: 14px; color: #374151; line-height: 2;">
            <div><strong>文件類型：</strong>${docTypeLabel}</div>
            <div><strong>合約編號：</strong>${doc.contract_number}</div>
            <div><strong>簽署人：</strong>${signature_name}</div>
            <div><strong>簽署時間：</strong>${signedAt}（台北時間）</div>
            <div><strong>IP 位址：</strong>${ip}</div>
          </div>
          <div style="background: #fff8f4; border: 1.5px solid #fbd5b5; border-radius: 8px; padding: 14px 16px; font-size: 13px; color: #92400e; margin-bottom: 24px;">
            📎 附件：${fileName}
          </div>
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            如有任何問題，請聯絡 ${process.env.READIE_SIGNER_EMAIL ?? 'marco@readie.ai'}
          </p>
        </div>
      `,
    })

    // 寄通知給 Marco（含 PDF 附件）
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'sign@readie.ai',
      to: process.env.READIE_SIGNER_EMAIL ?? 'paleblue.ml@gmail.com',
      subject: `✅ ${doc.client_name} 已簽署 ${docTypeLabel} — ${doc.contract_number}`,
      attachments,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 16px;">簽署通知</h1>
          <p style="font-size: 14px; color: #374151; margin: 0 0 24px;">
            <strong>${doc.client_name}</strong>${doc.client_company ? `（${doc.client_company}）` : ''} 已完成簽署。
          </p>
          <div style="background: #f9fafb; border-radius: 10px; padding: 20px; font-size: 14px; color: #374151; line-height: 2;">
            <div><strong>合約編號：</strong>${doc.contract_number}</div>
            <div><strong>文件類型：</strong>${docTypeLabel}</div>
            <div><strong>客戶 Email：</strong>${doc.client_email}</div>
            <div><strong>簽署人姓名：</strong>${signature_name}</div>
            <div><strong>簽署時間：</strong>${signedAt}</div>
            <div><strong>IP 位址：</strong>${ip}</div>
          </div>
          <div style="margin-top: 16px; background: #fff8f4; border: 1.5px solid #fbd5b5; border-radius: 8px; padding: 14px 16px; font-size: 13px; color: #92400e;">
            📎 附件：${fileName}
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[sign/complete]', e)
    return NextResponse.json({ error: `伺服器錯誤：${msg}` }, { status: 500 })
  }
}
