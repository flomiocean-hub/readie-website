import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdminShell from '../../AdminShell'
import CopyLink from './CopyLink'

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  draft:   { label: '草稿',   color: '#9ca3af', bg: '#f3f4f6' },
  sent:    { label: '已寄出', color: '#3b82f6', bg: '#eff6ff' },
  viewed:  { label: '已查看', color: '#d97706', bg: '#fffbeb' },
  signed:  { label: '已簽署', color: '#059669', bg: '#ecfdf5' },
  expired: { label: '已過期', color: '#dc2626', bg: '#fef2f2' },
}

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServiceClient()
  const { data: doc } = await supabase.from('documents').select('*').eq('id', id).single()
  if (!doc) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://readie.ai'
  const signUrl = `${appUrl}/sign/${doc.sign_token}`
  const st = STATUS[doc.status]
  const isExpired = new Date(doc.token_expires_at) < new Date()

  const lineItems: Array<{ name: string; description: string; unit_price: number; qty: number; subtotal: number }> = doc.line_items ?? []
  const subtotal = lineItems.reduce((s: number, i: { subtotal: number }) => s + i.subtotal, 0)
  const discountAmt = doc.discount_type === 'percent'
    ? Math.round(subtotal * ((doc.discount_value ?? 0) / 100))
    : (doc.discount_value ?? 0)
  const total = subtotal - discountAmt

  return (
    <AdminShell>
      <Link href="/admin/documents" style={s.back}>← 文件列表</Link>

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.mono}>{doc.contract_number}</div>
          <h1 style={s.title}>{doc.client_name}</h1>
          {doc.client_company && <div style={s.company}>{doc.client_company}</div>}
        </div>
        <span style={{ ...s.badge, color: st.color, background: st.bg }}>{st.label}</span>
      </div>

      <div style={s.grid}>
        {/* 簽約連結 */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>簽約連結</h2>
          {doc.status === 'signed' ? (
            <div style={s.signedBox}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
              <div style={s.signedText}>已於 {new Date(doc.signed_at).toLocaleString('zh-TW')} 完成簽署</div>
              {doc.pdf_url && <a href={doc.pdf_url} target="_blank" rel="noreferrer" style={s.pdfLink}>下載已簽署 PDF →</a>}
            </div>
          ) : (
            <>
              <div style={s.urlBox}><span style={s.urlText}>{signUrl}</span></div>
              <CopyLink url={signUrl} />
              <p style={{ fontSize: 12, color: isExpired ? '#dc2626' : '#9ca3af', marginTop: 8 }}>
                {isExpired ? '⚠️ 連結已過期' : `有效至 ${new Date(doc.token_expires_at).toLocaleDateString('zh-TW')}`}
              </p>
            </>
          )}
        </div>

        {/* 客戶資訊 */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>客戶資訊</h2>
          <dl style={s.dl}>
            <dt style={s.dt}>姓名</dt><dd style={s.dd}>{doc.client_name}</dd>
            {doc.client_company && <><dt style={s.dt}>公司</dt><dd style={s.dd}>{doc.client_company}</dd></>}
            <dt style={s.dt}>Email</dt><dd style={s.dd}>{doc.client_email}</dd>
            {doc.client_phone && <><dt style={s.dt}>電話</dt><dd style={s.dd}>{doc.client_phone}</dd></>}
          </dl>
        </div>
      </div>

      {/* 報價明細 */}
      {doc.type === 'quote' && lineItems.length > 0 && (
        <div style={s.card}>
          <h2 style={s.cardTitle}>報價明細</h2>
          <table style={s.itemTable}>
            <thead>
              <tr>
                {['品項', '說明', '單價', '數量', '小計'].map(h => (
                  <th key={h} style={s.ith}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(28,43,43,.05)' }}>
                  <td style={s.itd}>{item.name}</td>
                  <td style={{ ...s.itd, color: '#9ca3af', fontSize: 13 }}>{item.description}</td>
                  <td style={{ ...s.itd, textAlign: 'right' }}>NT$ {item.unit_price.toLocaleString()}</td>
                  <td style={{ ...s.itd, textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ ...s.itd, textAlign: 'right', fontWeight: 600 }}>NT$ {item.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={s.totalArea}>
            <div style={s.totalRow}><span>小計</span><span>NT$ {subtotal.toLocaleString()}</span></div>
            {discountAmt > 0 && (
              <div style={{ ...s.totalRow, color: '#D46B2F' }}><span>折扣</span><span>- NT$ {discountAmt.toLocaleString()}</span></div>
            )}
            <div style={{ ...s.totalRow, fontWeight: 700, fontSize: 18, borderTop: '2px solid #1C2B2B', paddingTop: 12 }}>
              <span>總計</span><span>NT$ {total.toLocaleString()}</span>
            </div>
          </div>
          {doc.payment_terms && (
            <div style={s.payNote}>
              付款方式：{doc.payment_terms === 'full' ? '簽約後全額付清' : doc.payment_terms === 'split' ? '50% 訂金 + 50% 完成' : doc.payment_note}
            </div>
          )}
        </div>
      )}
    </AdminShell>
  )
}

const s: Record<string, React.CSSProperties> = {
  back:       { color: '#9ca3af', textDecoration: 'none', fontSize: 14, display: 'block', marginBottom: 24 },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  mono:       { fontFamily: 'monospace', fontSize: 11, color: '#9ca3af', marginBottom: 4 },
  title:      { fontFamily: 'var(--font-serif), serif', fontWeight: 900, fontSize: '1.8rem', color: '#1C2B2B', margin: '0 0 4px' },
  company:    { fontSize: 14, color: '#3a4a4a' },
  badge:      { padding: '5px 14px', borderRadius: 100, fontSize: 13, fontWeight: 600 },
  grid:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  card:       { background: '#fff', border: '1px solid rgba(28,43,43,.1)', borderRadius: 14, padding: 24, marginBottom: 16, boxShadow: '0 1px 3px rgba(28,43,43,.05)' },
  cardTitle:  { fontFamily: 'var(--font-serif), serif', fontWeight: 700, fontSize: '1rem', color: '#1C2B2B', margin: '0 0 16px' },
  urlBox:     { background: '#FAF8F4', borderRadius: 8, padding: '11px 14px', marginBottom: 10, wordBreak: 'break-all' },
  urlText:    { fontSize: 12, color: '#3a4a4a', fontFamily: 'monospace' },
  signedBox:  { textAlign: 'center', padding: '12px 0' },
  signedText: { fontSize: 13, color: '#3a4a4a', marginBottom: 10 },
  pdfLink:    { color: '#D46B2F', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  dl:         { display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 10, columnGap: 16 },
  dt:         { fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '.06em', textTransform: 'uppercase', paddingTop: 1 },
  dd:         { fontSize: 14, color: '#1C2B2B', margin: 0 },
  itemTable:  { width: '100%', borderCollapse: 'collapse' },
  ith:        { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(28,43,43,.08)', background: '#FAF8F4' },
  itd:        { padding: '12px 12px', fontSize: 14, color: '#1C2B2B', verticalAlign: 'top' },
  totalArea:  { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, padding: '16px 12px 4px' },
  totalRow:   { display: 'flex', gap: 48, fontSize: 14, color: '#1C2B2B' },
  payNote:    { fontSize: 13, color: '#9ca3af', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(28,43,43,.06)' },
}
