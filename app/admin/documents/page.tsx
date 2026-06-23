import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AdminShell from '../AdminShell'

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  draft:   { label: '草稿',   color: '#9ca3af',  bg: '#f3f4f6' },
  sent:    { label: '已寄出', color: '#3b82f6',  bg: '#eff6ff' },
  viewed:  { label: '已查看', color: '#d97706',  bg: '#fffbeb' },
  signed:  { label: '已簽署', color: '#059669',  bg: '#ecfdf5' },
  expired: { label: '已過期', color: '#dc2626',  bg: '#fef2f2' },
}

const TYPE: Record<string, string> = {
  nda: '保密合約 NDA', quote: '報價單', service: '服務合約', custom: '自訂文件',
}

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: docs } = await supabase
    .from('documents')
    .select('id, type, contract_number, status, client_name, client_company, created_at')
    .order('created_at', { ascending: false })

  const counts = {
    sent:   docs?.filter(d => d.status === 'sent').length ?? 0,
    signed: docs?.filter(d => d.status === 'signed').length ?? 0,
    total:  docs?.length ?? 0,
  }

  return (
    <AdminShell>
      <h1 style={s.title}>文件管理</h1>

      {/* Stats */}
      <div style={s.stats}>
        {[
          { label: '已寄出', val: counts.sent,   color: '#3b82f6' },
          { label: '已簽署', val: counts.signed, color: '#059669' },
          { label: '全部',   val: counts.total,  color: '#1C2B2B' },
        ].map(({ label, val, color }) => (
          <div key={label} style={s.statCard}>
            <div style={{ ...s.statNum, color }}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={s.table}>
        {!docs?.length ? (
          <div style={s.empty}>
            <p style={{ color: '#9ca3af', marginBottom: 12 }}>還沒有任何文件</p>
            <Link href="/admin/documents/new" style={s.emptyLink}>建立第一份文件 →</Link>
          </div>
        ) : (
          <table style={s.tableEl}>
            <thead>
              <tr>
                {['合約編號', '類型', '客戶', '狀態', '日期', ''].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => {
                const st = STATUS[doc.status]
                return (
                  <tr key={doc.id} style={s.tr}>
                    <td style={s.td}><span style={s.mono}>{doc.contract_number}</span></td>
                    <td style={s.td}>{TYPE[doc.type] ?? doc.type}</td>
                    <td style={s.td}>
                      <span style={s.clientName}>{doc.client_name}</span>
                      {doc.client_company && <span style={s.clientCo}>{doc.client_company}</span>}
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, color: st.color, background: st.bg }}>{st.label}</span>
                    </td>
                    <td style={s.td}>{new Date(doc.created_at).toLocaleDateString('zh-TW')}</td>
                    <td style={s.td}>
                      <Link href={`/admin/documents/${doc.id}`} style={s.viewLink}>查看 →</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}

const s: Record<string, React.CSSProperties> = {
  title:      { fontFamily: 'var(--font-serif), serif', fontWeight: 900, fontSize: '1.8rem', color: '#1C2B2B', marginBottom: 28 },
  stats:      { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 },
  statCard:   { background: '#fff', border: '1px solid rgba(28,43,43,.1)', borderRadius: 12, padding: '18px 22px', boxShadow: '0 1px 3px rgba(28,43,43,.05)' },
  statNum:    { fontFamily: 'var(--font-serif), serif', fontWeight: 900, fontSize: '2rem', lineHeight: 1 },
  statLabel:  { fontSize: 11, color: '#9ca3af', marginTop: 5, letterSpacing: '.08em', textTransform: 'uppercase' },
  table:      { background: '#fff', border: '1px solid rgba(28,43,43,.1)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(28,43,43,.05)' },
  tableEl:    { width: '100%', borderCollapse: 'collapse' },
  th:         { padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9ca3af', borderBottom: '1px solid rgba(28,43,43,.06)', background: '#FAF8F4' },
  tr:         { borderBottom: '1px solid rgba(28,43,43,.05)' },
  td:         { padding: '15px 20px', fontSize: 14, color: '#1C2B2B', verticalAlign: 'middle' },
  mono:       { fontFamily: 'monospace', fontSize: 12, color: '#9ca3af' },
  clientName: { display: 'block', fontWeight: 500 },
  clientCo:   { display: 'block', fontSize: 12, color: '#9ca3af', marginTop: 2 },
  badge:      { padding: '3px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500 },
  viewLink:   { color: '#D46B2F', textDecoration: 'none', fontSize: 13, fontWeight: 600 },
  empty:      { padding: '60px', textAlign: 'center' },
  emptyLink:  { color: '#D46B2F', textDecoration: 'none', fontSize: 14 },
}
