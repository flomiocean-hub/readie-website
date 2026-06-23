import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json()
    if (!token || !email) {
      return NextResponse.json({ error: '缺少必要參數' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    // 驗證 token 有效
    const { data: doc } = await supabase
      .from('documents')
      .select('id, client_email, status, token_expires_at')
      .eq('sign_token', token)
      .single()

    if (!doc) return NextResponse.json({ error: '無效的簽約連結' }, { status: 404 })
    if (doc.status === 'signed') return NextResponse.json({ error: '此文件已完成簽署' }, { status: 400 })
    if (new Date(doc.token_expires_at) < new Date()) return NextResponse.json({ error: '連結已過期' }, { status: 400 })

    const otp = generateOtp()
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    // 儲存 OTP（先刪舊的）
    await supabase.from('sign_events').delete().eq('document_id', doc.id).is('signed_at', null)

    await supabase.from('sign_events').insert({
      document_id: doc.id,
      otp_code: otp,
      otp_sent_at: new Date().toISOString(),
    })

    // 寄送 OTP Email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'sign@readie.ai',
      to: email,
      subject: `【Readie Sign】您的驗證碼：${otp}`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 24px;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #9ca3af; margin-bottom: 24px;">Readie Sign</div>
          <h1 style="font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 12px;">您的驗證碼</h1>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 28px;">請在簽約頁面輸入以下驗證碼，10 分鐘內有效。</p>
          <div style="background: #f9fafb; border-radius: 10px; padding: 24px; text-align: center; letter-spacing: 10px; font-size: 36px; font-weight: 700; color: #111827; margin-bottom: 28px;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">若您並未申請此驗證碼，請忽略此信件。</p>
        </div>
      `,
    })

    // 更新文件狀態為 viewed
    await supabase.from('documents').update({ status: 'viewed' }).eq('id', doc.id).eq('status', 'sent')

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}
