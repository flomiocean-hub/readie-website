type LineItem = { name: string; description: string; unit_price: number; qty: number; subtotal: number }

type Doc = {
  client_name: string
  client_company: string | null
  contract_number: string
  line_items: LineItem[]
  discount_type: string | null
  discount_value: number | null
  currency: string
  payment_terms: string | null
  payment_note: string | null
  valid_days: number
  note: string | null
}

export default function QuoteContent({ doc }: { doc: Doc }) {
  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
  const validUntil = new Date(Date.now() + doc.valid_days * 24 * 60 * 60 * 1000)
    .toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })

  const subtotal = doc.line_items.reduce((s, i) => s + i.subtotal, 0)
  const discountAmt = doc.discount_type === 'percent'
    ? Math.round(subtotal * ((doc.discount_value ?? 0) / 100))
    : (doc.discount_value ?? 0)
  const total = subtotal - discountAmt

  const paymentLabel = doc.payment_terms === 'full'
    ? '簽約後全額付清'
    : doc.payment_terms === 'split'
    ? '50% 訂金（簽約時）+ 50%（完成交付時）'
    : doc.payment_note ?? ''

  return (
    <div>
      <div style={styles.meta}>
        <div><span style={styles.metaLabel}>報價單編號</span>{doc.contract_number}</div>
        <div><span style={styles.metaLabel}>報價日期</span>{today}</div>
        <div><span style={styles.metaLabel}>有效期限</span>{validUntil}</div>
        <div><span style={styles.metaLabel}>報價對象</span>{doc.client_name}{doc.client_company ? `（${doc.client_company}）` : ''}</div>
        <div><span style={styles.metaLabel}>報價方</span>劉志傑 / Readie AI</div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>服務項目</th>
            <th style={styles.th}>說明</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>單價</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>數量</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>小計</th>
          </tr>
        </thead>
        <tbody>
          {doc.line_items.map((item, idx) => (
            <tr key={idx} style={styles.tr}>
              <td style={styles.td}><strong>{item.name}</strong></td>
              <td style={{ ...styles.td, color: '#6b7280', fontSize: 13 }}>{item.description}</td>
              <td style={{ ...styles.td, textAlign: 'right' }}>NT$ {item.unit_price.toLocaleString()}</td>
              <td style={{ ...styles.td, textAlign: 'center' }}>{item.qty}</td>
              <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>NT$ {item.subtotal.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.totals}>
        <div style={styles.totalRow}><span>小計</span><span>NT$ {subtotal.toLocaleString()}</span></div>
        {discountAmt > 0 && (
          <div style={{ ...styles.totalRow, color: '#ef4444' }}>
            <span>折扣（{doc.discount_type === 'percent' ? `${doc.discount_value}%` : '固定折扣'}）</span>
            <span>- NT$ {discountAmt.toLocaleString()}</span>
          </div>
        )}
        <div style={{ ...styles.totalRow, fontWeight: 700, fontSize: 18, borderTop: '2px solid #111827', paddingTop: 12 }}>
          <span>總計</span><span>NT$ {total.toLocaleString()}</span>
        </div>
      </div>

      <div style={styles.terms}>
        <p><strong>付款條件：</strong>{paymentLabel}</p>
        {doc.note && <p><strong>備註：</strong>{doc.note}</p>}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  meta:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', marginBottom: 24, padding: '16px', background: '#f9fafb', borderRadius: 8, fontSize: 14 },
  metaLabel: { fontWeight: 600, color: '#9ca3af', marginRight: 8, fontSize: 12 },
  table:     { width: '100%', borderCollapse: 'collapse', marginBottom: 0 },
  thead:     { background: '#f9fafb' },
  th:        { padding: '8px 12px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' },
  tr:        { borderBottom: '1px solid #f3f4f6' },
  td:        { padding: '10px 12px', fontSize: 14, color: '#374151', verticalAlign: 'top' },
  totals:    { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, padding: '16px 12px', borderTop: '1px solid #e5e7eb' },
  totalRow:  { display: 'flex', gap: 48, fontSize: 14, color: '#374151' },
  terms:     { padding: '16px 0 0', fontSize: 13, color: '#6b7280', borderTop: '1px solid #f3f4f6', lineHeight: 1.8 },
}
