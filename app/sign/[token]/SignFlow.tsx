'use client'

import { useState, useRef } from 'react'
import NdaContent from './NdaContent'
import QuoteContent from './QuoteContent'
import SignaturePad, { type SignaturePadRef } from './SignaturePad'

type Step = 'otp_request' | 'otp_verify' | 'read' | 'sign' | 'done'

type Doc = {
  id: string; type: string; contract_number: string
  client_name: string; client_company: string | null; client_email: string
  line_items: Array<{ name: string; description: string; unit_price: number; qty: number; subtotal: number }>
  discount_type: string | null; discount_value: number | null; currency: string
  payment_terms: string | null; payment_note: string | null; valid_days: number
  note: string | null; variables: Record<string, string>
}

export default function SignFlow({ doc, token }: { doc: Doc; token: string }) {
  const [step, setStep] = useState<Step>('otp_request')
  const [email, setEmail] = useState(doc.client_email)
  const [otp, setOtp] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const sigPadRef = useRef<SignaturePadRef>(null)

  async function requestOtp() {
    setLoading(true); setError('')
    const res = await fetch('/api/sign/otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, email }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setStep('otp_verify'); setLoading(false)
  }

  async function verifyOtp() {
    setLoading(true); setError('')
    const res = await fetch('/api/sign/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, otp }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setStep('read'); setLoading(false)
  }

  async function submitSign() {
    if (!agreed) { setError('請勾選同意後再提交'); return }
    if (!signatureName.trim()) { setError('請輸入您的姓名作為電子簽名'); return }
    if (sigPadRef.current?.isEmpty()) { setError('請在簽名欄上簽名'); return }
    setLoading(true); setError('')
    const signature_image = sigPadRef.current?.toDataURL() ?? ''
    const res = await fetch('/api/sign/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, signature_name: signatureName, signature_image }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setStep('done'); setLoading(false)
  }

  const typeLabel = doc.type === 'nda' ? '保密合約書' : '報價確認單'

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.logo}>Readie<span style={s.dot}>.</span></span>
        <span style={s.contractTag}>{doc.contract_number}</span>
      </div>

      <div style={s.center}>

        {/* Step 1 */}
        {step === 'otp_request' && (
          <div style={s.card}>
            <div style={s.eyebrow}>身份驗證</div>
            <h1 style={s.cardTitle}>確認您的 Email</h1>
            <p style={s.cardSub}>我們將寄送驗證碼至您的信箱，以確認您的身份後繼續簽署。</p>
            <label style={s.label}>電子郵件</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={s.input} placeholder="your@email.com" />
            {error && <p style={s.error}>{error}</p>}
            <button onClick={requestOtp} disabled={loading} style={s.primaryBtn}>{loading ? '寄送中…' : '發送驗證碼'}</button>
          </div>
        )}

        {/* Step 2 */}
        {step === 'otp_verify' && (
          <div style={s.card}>
            <div style={s.eyebrow}>身份驗證</div>
            <h1 style={s.cardTitle}>輸入驗證碼</h1>
            <p style={s.cardSub}>已寄至 <strong style={{ color: '#D46B2F' }}>{email}</strong>，10 分鐘內有效。</p>
            <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              style={{ ...s.input, letterSpacing: 12, fontSize: 28, textAlign: 'center', fontFamily: 'monospace' }}
              placeholder="000000" maxLength={6} />
            {error && <p style={s.error}>{error}</p>}
            <button onClick={verifyOtp} disabled={loading || otp.length < 6} style={s.primaryBtn}>{loading ? '驗證中…' : '確認'}</button>
            <button onClick={() => setStep('otp_request')} style={s.ghostBtn}>重新寄送</button>
          </div>
        )}

        {/* Step 3：閱讀文件 */}
        {step === 'read' && (
          <div style={s.wideCard}>
            <div style={s.docHeader}>
              <div style={s.eyebrow}>{typeLabel}</div>
              <h1 style={s.docTitle}>{doc.client_name}{doc.client_company ? ` · ${doc.client_company}` : ''}</h1>
            </div>
            <div style={s.docBody}>
              {doc.type === 'nda' ? <NdaContent doc={doc} /> : <QuoteContent doc={doc} />}
            </div>
            <div style={s.agreeBox}>
              <input type="checkbox" id="agree" checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#D46B2F', cursor: 'pointer', flexShrink: 0 }} />
              <label htmlFor="agree" style={s.agreeLabel}>
                我已閱讀並理解本文件之全部內容，同意受其約束
              </label>
            </div>
            {error && <p style={s.error}>{error}</p>}
            <button onClick={() => { if (agreed) { setError(''); setStep('sign') } else setError('請先勾選同意') }} style={s.primaryBtn}>
              繼續簽署 →
            </button>
          </div>
        )}

        {/* Step 4：簽名 */}
        {step === 'sign' && (
          <div style={{ ...s.card, maxWidth: 620 }}>
            <div style={s.eyebrow}>電子簽名</div>
            <h1 style={s.cardTitle}>請簽名確認</h1>
            <p style={s.cardSub}>請在下方簽名欄手寫簽名，並輸入姓名。兩者將與簽署時間、IP 位址一同記錄作為法律憑據。</p>

            <label style={s.label}>手寫簽名 *</label>
            <SignaturePad ref={sigPadRef} width={548} height={160} />

            <label style={{ ...s.label, marginTop: 8 }}>姓名（文字備份）*</label>
            <input value={signatureName} onChange={e => setSignatureName(e.target.value)}
              style={{ ...s.input, fontFamily: 'var(--font-serif), serif', fontSize: 18 }}
              placeholder="請輸入您的全名" />

            <p style={s.metaNote}>簽署時間：{new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}</p>
            {error && <p style={s.error}>{error}</p>}
            <button onClick={submitSign} disabled={loading} style={s.primaryBtn}>{loading ? '提交中…' : '確認簽署'}</button>
            <button onClick={() => setStep('read')} style={s.ghostBtn}>返回重新閱讀</button>
          </div>
        )}

        {/* Step 5：完成 */}
        {step === 'done' && (
          <div style={{ ...s.card, textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <h1 style={s.cardTitle}>簽署完成</h1>
            <p style={s.cardSub}>感謝您完成簽署。確認副本已寄至 <strong style={{ color: '#D46B2F' }}>{email}</strong>，請留存備查。</p>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 20 }}>
              如有疑問，請聯絡 marco@readie.ai
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page:       { minHeight: '100vh', background: '#FAF8F4' },
  header:     { background: '#1C2B2B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid rgba(250,248,244,.08)' },
  logo:       { fontFamily: 'var(--font-serif), serif', fontWeight: 900, fontSize: '1.2rem', color: '#FAF8F4' },
  dot:        { color: '#D46B2F' },
  contractTag:{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(250,248,244,.35)', padding: '3px 12px', border: '1px solid rgba(250,248,244,.1)', borderRadius: 100 },
  center:     { display: 'flex', justifyContent: 'center', padding: '48px 24px' },
  card:       { background: '#fff', border: '1px solid rgba(28,43,43,.1)', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 2px 12px rgba(28,43,43,.06)' },
  wideCard:   { background: '#fff', border: '1px solid rgba(28,43,43,.1)', borderRadius: 16, padding: '40px 48px', width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0 2px 12px rgba(28,43,43,.06)' },
  eyebrow:    { fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: '#D46B2F' },
  cardTitle:  { fontFamily: 'var(--font-serif), serif', fontWeight: 900, fontSize: '1.6rem', color: '#1C2B2B', margin: 0 },
  cardSub:    { fontSize: 14, color: '#3a4a4a', margin: 0, lineHeight: 1.7 },
  label:      { fontSize: 12, fontWeight: 600, color: '#3a4a4a', letterSpacing: '.04em' },
  input:      { padding: '11px 14px', border: '1.5px solid rgba(28,43,43,.15)', borderRadius: 9, fontSize: 15, color: '#1C2B2B', background: '#fff', outline: 'none' },
  primaryBtn: { padding: '13px', background: '#D46B2F', color: '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  ghostBtn:   { padding: '10px', background: 'none', border: 'none', color: '#9ca3af', fontSize: 13, cursor: 'pointer' },
  error:      { color: '#D46B2F', fontSize: 13, margin: 0 },
  docHeader:  { borderBottom: '2px solid #1C2B2B', paddingBottom: 16 },
  docTitle:   { fontFamily: 'var(--font-serif), serif', fontWeight: 900, fontSize: '1.3rem', color: '#1C2B2B', margin: '6px 0 0' },
  docBody:    { maxHeight: '50vh', overflowY: 'auto', color: '#3a4a4a', fontSize: 14, lineHeight: 1.85, paddingRight: 4 },
  agreeBox:   { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: '#fff8f4', border: '1.5px solid rgba(212,107,47,.2)', borderRadius: 10 },
  agreeLabel: { fontSize: 14, color: '#1C2B2B', cursor: 'pointer', lineHeight: 1.5 },
  metaNote:   { fontSize: 12, color: '#9ca3af', margin: 0 },
}
