import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SignFlow from './SignFlow'

export default async function SignPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createServiceClient()

  const { data: doc } = await supabase
    .from('documents')
    .select('id, type, contract_number, status, client_name, client_company, client_email, token_expires_at, line_items, discount_type, discount_value, currency, payment_terms, payment_note, valid_days, note, variables')
    .eq('sign_token', token)
    .single()

  if (!doc) notFound()

  const isExpired = new Date(doc.token_expires_at) < new Date()

  if (isExpired && doc.status !== 'signed') {
    return <ErrorPage title="連結已過期" message="此簽約連結已失效，請聯絡 Readie AI 重新取得連結。" />
  }

  if (doc.status === 'signed') {
    return <ErrorPage title="已完成簽署" message="此文件已完成簽署，感謝您的確認。如需副本請查收 Email。" success />
  }

  return <SignFlow doc={doc} token={token} />
}

function ErrorPage({ title, message, success }: { title: string; message: string; success?: boolean }) {
  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>{success ? '✅' : '⚠️'}</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>{title}</h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{message}</p>
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb', padding: 24 }
const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 12, padding: '48px 40px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
