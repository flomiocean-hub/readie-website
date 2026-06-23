import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

function generateContractNumber(type: string): string {
  const prefix = type === 'nda' ? 'NDA' : type === 'quote' ? 'QT' : 'DOC'
  const year = new Date().getFullYear()
  const rand = nanoid(6).toUpperCase()
  return `READIE-${prefix}-${year}-${rand}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      client_name,
      client_company,
      client_email,
      client_phone,
      // NDA 專用
      variables,
      // 報價單專用
      line_items,
      discount_type,
      discount_value,
      currency,
      payment_terms,
      payment_note,
      valid_days,
      note,
    } = body

    if (!type || !client_name || !client_email) {
      return NextResponse.json({ error: '缺少必要欄位' }, { status: 400 })
    }

    const supabase = await createServiceClient()

    const sign_token = nanoid(32)
    const contract_number = generateContractNumber(type)
    const token_expires_at = new Date(
      Date.now() + (valid_days ?? 30) * 24 * 60 * 60 * 1000
    ).toISOString()

    const { data, error } = await supabase
      .from('documents')
      .insert({
        type,
        contract_number,
        status: 'draft',
        client_name,
        client_company: client_company || null,
        client_email,
        client_phone: client_phone || null,
        variables: variables ?? {},
        line_items: line_items ?? [],
        discount_type: discount_type || null,
        discount_value: discount_value || null,
        currency: currency ?? 'NTD',
        payment_terms: payment_terms || null,
        payment_note: payment_note || null,
        valid_days: valid_days ?? 30,
        note: note || null,
        sign_token,
        token_expires_at,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Document create error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ id: data.id, contract_number })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
