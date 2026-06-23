import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { token, otp } = await request.json()
    if (!token || !otp) {
      return NextResponse.json({ error: '缺少必要參數' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const { data: doc } = await supabase
      .from('documents')
      .select('id')
      .eq('sign_token', token)
      .single()

    if (!doc) return NextResponse.json({ error: '無效的簽約連結' }, { status: 404 })

    // 查最新的未驗證 OTP
    const { data: event } = await supabase
      .from('sign_events')
      .select('id, otp_code, otp_sent_at, otp_verified_at')
      .eq('document_id', doc.id)
      .is('otp_verified_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!event) return NextResponse.json({ error: '請先申請驗證碼' }, { status: 400 })

    // 檢查是否過期（10 分鐘）
    const sentAt = new Date(event.otp_sent_at)
    if (Date.now() - sentAt.getTime() > 10 * 60 * 1000) {
      return NextResponse.json({ error: '驗證碼已過期，請重新申請' }, { status: 400 })
    }

    if (event.otp_code !== otp) {
      return NextResponse.json({ error: '驗證碼不正確' }, { status: 400 })
    }

    // 標記已驗證
    await supabase
      .from('sign_events')
      .update({ otp_verified_at: new Date().toISOString() })
      .eq('id', event.id)

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}
