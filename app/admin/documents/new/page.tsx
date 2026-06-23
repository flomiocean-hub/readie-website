'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '../../AdminShell'

type DocType = 'nda' | 'quote'

export default function NewDocumentPage() {
  const [type, setType] = useState<DocType | null>(null)

  if (!type) {
    return (
      <AdminShell>
        <div style={s.head}>
          <h1 style={s.title}>建立新文件</h1>
          <p style={s.sub}>選擇文件類型開始</p>
        </div>
        <div style={s.typeGrid}>
          <TypeCard icon="🔒" title="保密合約 NDA" desc="洽談前簽署，保護雙方討論內容不外洩" onClick={() => setType('nda')} />
          <TypeCard icon="💰" title="報價單" desc="選擇服務項目、設定折扣，讓客戶線上確認" onClick={() => setType('quote')} />
        </div>
      </AdminShell>
    )
  }

  if (type === 'nda') return <NdaForm onBack={() => setType(null)} />
  return <QuoteForm onBack={() => setType(null)} />
}

// ─── NDA 表單 ────────────────────────────────────────────────

function NdaForm({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const [form, setForm] = useState({ client_name: '', client_company: '', client_email: '', client_phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'nda', ...form }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error ?? '建立失敗'); setLoading(false); return }
    const { id } = await res.json()
    router.push(`/admin/documents/${id}`)
  }

  return (
    <AdminShell>
      <button onClick={onBack} style={s.back}>← 返回</button>
      <div style={s.head}>
        <h1 style={s.title}>建立保密合約 NDA</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={s.card}>
          <h2 style={s.cardTitle}>客戶資料</h2>
          <div style={s.row}>
            <Field label="客戶姓名 *" value={form.client_name} onChange={v => set('client_name', v)} placeholder="王小明" required />
            <Field label="公司名稱" value={form.client_company} onChange={v => set('client_company', v)} placeholder="某某科技有限公司" />
          </div>
          <div style={s.row}>
            <Field label="電子郵件 *" type="email" value={form.client_email} onChange={v => set('client_email', v)} placeholder="client@example.com" required />
            <Field label="聯絡電話" value={form.client_phone} onChange={v => set('client_phone', v)} placeholder="0912-345-678" />
          </div>
        </div>
        {error && <p style={s.error}>{error}</p>}
        <div style={s.actions}>
          <button type="button" onClick={onBack} style={s.cancelBtn}>取消</button>
          <button type="submit" disabled={loading} style={s.submitBtn}>{loading ? '建立中…' : '建立合約並產生連結'}</button>
        </div>
      </form>
    </AdminShell>
  )
}

// ─── 報價單表單 ───────────────────────────────────────────────

const PRESET_ITEMS = [
  { name: 'AI 導入健檢',      description: '到府兩小時訪談，產出現況評估報告與 AI 導入建議路線圖', default_price: 12000 },
  { name: 'AI 工作流程建置',  description: '從 LINE 開始建置 AI 工作流程，含系統設定、教育訓練、上線驗收', default_price: 45000 },
  { name: '陪伴顧問（月費）', description: '每月確認使用狀況、優化流程、即時回覆問題', default_price: 15000 },
]

type LineItem = { name: string; description: string; unit_price: number; qty: number }

function QuoteForm({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const [form, setForm] = useState({
    client_name: '', client_company: '', client_email: '', client_phone: '',
    payment_terms: 'full', payment_note: '', valid_days: 30, note: '',
    currency: 'NTD', discount_type: 'percent' as 'percent' | 'fixed', discount_value: 0,
  })
  const [items, setItems] = useState<LineItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function setF(k: string, v: string | number) { setForm(f => ({ ...f, [k]: v })) }
  function addPreset(p: typeof PRESET_ITEMS[0]) {
    if (items.find(i => i.name === p.name)) return
    setItems(prev => [...prev, { name: p.name, description: p.description, unit_price: p.default_price, qty: 1 }])
  }
  function addCustom() { setItems(prev => [...prev, { name: '', description: '', unit_price: 0, qty: 1 }]) }
  function updateItem(idx: number, k: keyof LineItem, v: string | number) {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [k]: v } : item))
  }
  function removeItem(idx: number) { setItems(prev => prev.filter((_, i) => i !== idx)) }

  const subtotal = items.reduce((s, i) => s + i.unit_price * i.qty, 0)
  const discountAmt = form.discount_type === 'percent'
    ? Math.round(subtotal * (form.discount_value / 100))
    : form.discount_value
  const total = subtotal - discountAmt

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!items.length) { setError('請至少新增一個服務項目'); return }
    setLoading(true); setError('')
    const line_items = items.map(i => ({ ...i, subtotal: i.unit_price * i.qty }))
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'quote', ...form, line_items }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error ?? '建立失敗'); setLoading(false); return }
    const { id } = await res.json()
    router.push(`/admin/documents/${id}`)
  }

  return (
    <AdminShell>
      <button onClick={onBack} style={s.back}>← 返回</button>
      <div style={s.head}><h1 style={s.title}>建立報價單</h1></div>
      <form onSubmit={handleSubmit}>

        {/* 客戶資料 */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>客戶資料</h2>
          <div style={s.row}>
            <Field label="客戶姓名 *" value={form.client_name} onChange={v => setF('client_name', v)} placeholder="王小明" required />
            <Field label="公司名稱" value={form.client_company} onChange={v => setF('client_company', v)} placeholder="某某科技有限公司" />
          </div>
          <div style={s.row}>
            <Field label="電子郵件 *" type="email" value={form.client_email} onChange={v => setF('client_email', v)} placeholder="client@example.com" required />
            <Field label="聯絡電話" value={form.client_phone} onChange={v => setF('client_phone', v)} placeholder="0912-345-678" />
          </div>
        </div>

        {/* 服務品項 */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>服務品項</h2>
          <div style={s.presetRow}>
            {PRESET_ITEMS.map(p => (
              <button key={p.name} type="button" onClick={() => addPreset(p)}
                disabled={!!items.find(i => i.name === p.name)}
                style={{ ...s.presetBtn, opacity: items.find(i => i.name === p.name) ? 0.4 : 1 }}>
                ＋ {p.name}
              </button>
            ))}
            <button type="button" onClick={addCustom} style={s.presetBtnDash}>＋ 自訂品項</button>
          </div>

          {items.length > 0 && (
            <div style={s.itemTable}>
              <div style={s.itemHead}>
                <span style={{ flex: 3 }}>品項名稱</span>
                <span style={{ flex: 2 }}>說明</span>
                <span style={{ flex: 1, textAlign: 'right' }}>單價</span>
                <span style={{ flex: 0.5, textAlign: 'center' }}>數量</span>
                <span style={{ flex: 1, textAlign: 'right' }}>小計</span>
                <span style={{ flex: 0.3 }}></span>
              </div>
              {items.map((item, idx) => (
                <div key={idx} style={s.itemRow}>
                  <input style={{ ...s.itemInput, flex: 3 }} value={item.name}
                    onChange={e => updateItem(idx, 'name', e.target.value)} placeholder="品項名稱" />
                  <input style={{ ...s.itemInput, flex: 2 }} value={item.description}
                    onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="說明（選填）" />
                  <input style={{ ...s.itemInput, flex: 1, textAlign: 'right' }} type="number"
                    value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', Number(e.target.value))} />
                  <input style={{ ...s.itemInput, flex: 0.5, textAlign: 'center' }} type="number"
                    min={1} value={item.qty} onChange={e => updateItem(idx, 'qty', Number(e.target.value))} />
                  <span style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 600, alignSelf: 'center', color: '#1C2B2B' }}>
                    {(item.unit_price * item.qty).toLocaleString()}
                  </span>
                  <button type="button" onClick={() => removeItem(idx)} style={s.removeBtn}>✕</button>
                </div>
              ))}

              <div style={s.totalArea}>
                <div style={s.totalRow}><span>小計</span><span>NT$ {subtotal.toLocaleString()}</span></div>
                <div style={s.totalRow}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    折扣
                    <select value={form.discount_type} onChange={e => setF('discount_type', e.target.value)} style={s.miniSelect}>
                      <option value="percent">%</option>
                      <option value="fixed">固定金額</option>
                    </select>
                    <input type="number" min={0} value={form.discount_value}
                      onChange={e => setF('discount_value', Number(e.target.value))} style={s.miniInput} />
                    <span style={{ fontSize: 13, color: '#3a4a4a' }}>{form.discount_type === 'percent' ? '%' : 'NT$'}</span>
                  </span>
                  <span style={{ color: '#D46B2F' }}>{discountAmt > 0 ? `- NT$ ${discountAmt.toLocaleString()}` : '—'}</span>
                </div>
                <div style={{ ...s.totalRow, fontWeight: 700, fontSize: 18, borderTop: '2px solid #1C2B2B', paddingTop: 12 }}>
                  <span>總計</span><span>NT$ {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 付款條件 */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>付款條件</h2>
          <div style={s.row}>
            <div style={s.fieldWrap}>
              <label style={s.label}>付款方式</label>
              <select value={form.payment_terms} onChange={e => setF('payment_terms', e.target.value)} style={s.select}>
                <option value="full">簽約後全額付清</option>
                <option value="split">50% 訂金 + 50% 完成</option>
                <option value="custom">自訂</option>
              </select>
            </div>
            <Field label="有效天數" type="number" value={String(form.valid_days)}
              onChange={v => setF('valid_days', Number(v))} placeholder="30" />
          </div>
          {form.payment_terms === 'custom' && (
            <Field label="自訂付款說明" value={form.payment_note}
              onChange={v => setF('payment_note', v)} placeholder="例：分三期，每期交付後付款" />
          )}
          <div style={{ marginTop: 16 }}>
            <Field label="備註（顯示於文件底部）" value={form.note}
              onChange={v => setF('note', v)} placeholder="其他說明事項…" />
          </div>
        </div>

        {error && <p style={s.error}>{error}</p>}
        <div style={s.actions}>
          <button type="button" onClick={onBack} style={s.cancelBtn}>取消</button>
          <button type="submit" disabled={loading} style={s.submitBtn}>{loading ? '建立中…' : '建立報價單並產生連結'}</button>
        </div>
      </form>
    </AdminShell>
  )
}

// ─── 共用元件 ─────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div style={s.fieldWrap}>
      <label style={s.label}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required} style={s.input} />
    </div>
  )
}

function TypeCard({ title, desc, icon, onClick }: { title: string; desc: string; icon: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={s.typeCard}>
      <div style={s.typeIcon}>{icon}</div>
      <div style={s.typeTitle}>{title}</div>
      <div style={s.typeDesc}>{desc}</div>
    </button>
  )
}

// ─── Styles（米白主題）────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  head:        { marginBottom: 28 },
  title:       { fontFamily: 'var(--font-serif), serif', fontWeight: 900, fontSize: '1.8rem', color: '#1C2B2B', margin: '0 0 6px' },
  sub:         { fontSize: 14, color: '#3a4a4a', margin: 0 },
  back:        { background: 'none', border: 'none', cursor: 'pointer', color: '#3a4a4a', fontSize: 14, padding: '0 0 20px', display: 'block' },
  typeGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 640 },
  typeCard:    { background: '#fff', border: '2px solid rgba(28,43,43,.1)', borderRadius: 14, padding: '28px 24px', textAlign: 'left', cursor: 'pointer', transition: 'border-color .15s' },
  typeIcon:    { fontSize: 28, marginBottom: 12 },
  typeTitle:   { fontFamily: 'var(--font-serif), serif', fontWeight: 700, fontSize: '1.1rem', color: '#1C2B2B', marginBottom: 6 },
  typeDesc:    { fontSize: 13, color: '#3a4a4a', lineHeight: 1.6 },
  card:        { background: '#fff', border: '1px solid rgba(28,43,43,.1)', borderRadius: 14, padding: 28, marginBottom: 16, boxShadow: '0 1px 4px rgba(28,43,43,.05)' },
  cardTitle:   { fontFamily: 'var(--font-serif), serif', fontWeight: 700, fontSize: '1rem', color: '#1C2B2B', margin: '0 0 20px' },
  row:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  fieldWrap:   { display: 'flex', flexDirection: 'column', gap: 6 },
  label:       { fontSize: 12, fontWeight: 600, color: '#3a4a4a', letterSpacing: '.04em' },
  input:       { padding: '10px 13px', border: '1.5px solid rgba(28,43,43,.15)', borderRadius: 8, fontSize: 14, color: '#1C2B2B', background: '#fff', outline: 'none' },
  select:      { padding: '10px 13px', border: '1.5px solid rgba(28,43,43,.15)', borderRadius: 8, fontSize: 14, color: '#1C2B2B', background: '#fff', outline: 'none' },
  presetRow:   { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  presetBtn:   { padding: '6px 14px', border: '1.5px solid rgba(28,43,43,.2)', borderRadius: 100, fontSize: 13, cursor: 'pointer', background: '#fff', color: '#1C2B2B' },
  presetBtnDash: { padding: '6px 14px', border: '1.5px dashed rgba(28,43,43,.2)', borderRadius: 100, fontSize: 13, cursor: 'pointer', background: '#fff', color: '#3a4a4a' },
  itemTable:   { border: '1px solid rgba(28,43,43,.1)', borderRadius: 10, overflow: 'hidden' },
  itemHead:    { display: 'flex', gap: 8, padding: '8px 14px', background: '#FAF8F4', fontSize: 11, fontWeight: 600, color: '#3a4a4a', textTransform: 'uppercase', letterSpacing: '.06em' },
  itemRow:     { display: 'flex', gap: 8, padding: '8px 14px', borderTop: '1px solid rgba(28,43,43,.06)', alignItems: 'center' },
  itemInput:   { padding: '7px 10px', border: '1px solid rgba(28,43,43,.12)', borderRadius: 7, fontSize: 13, color: '#1C2B2B', background: '#fff', outline: 'none' },
  removeBtn:   { background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 13, flex: '0 0 auto' },
  totalArea:   { padding: '16px 14px', borderTop: '1px solid rgba(28,43,43,.08)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' },
  totalRow:    { display: 'flex', gap: 48, fontSize: 14, color: '#1C2B2B', alignItems: 'center' },
  miniSelect:  { padding: '4px 8px', border: '1px solid rgba(28,43,43,.15)', borderRadius: 6, fontSize: 13, color: '#1C2B2B', background: '#fff' },
  miniInput:   { width: 64, padding: '4px 8px', border: '1px solid rgba(28,43,43,.15)', borderRadius: 6, fontSize: 13, textAlign: 'right', color: '#1C2B2B', background: '#fff' },
  actions:     { display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 },
  cancelBtn:   { padding: '10px 22px', background: '#fff', border: '1.5px solid rgba(28,43,43,.2)', borderRadius: 100, fontSize: 14, cursor: 'pointer', color: '#1C2B2B' },
  submitBtn:   { padding: '10px 28px', background: '#D46B2F', color: '#fff', border: 'none', borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  error:       { color: '#D46B2F', fontSize: 13, padding: '8px 0' },
}
