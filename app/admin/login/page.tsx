'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/auth/callback` },
    })

    if (error) { setError(error.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>Readie<span style={s.dot}>.</span></div>

        {sent ? (
          <div style={s.sentBox}>
            <div style={s.sentIcon}>✉️</div>
            <p style={s.sentTitle}>連結已寄出</p>
            <p style={s.sentEmail}>{email}</p>
            <p style={s.sentHint}>點擊信中的連結即可登入，10 分鐘內有效。</p>
          </div>
        ) : (
          <>
            <h1 style={s.title}>後台登入</h1>
            <p style={s.sub}>輸入你的 Email，系統會寄送登入連結。</p>
            <form onSubmit={handleSubmit} style={s.form}>
              <label style={s.label}>電子郵件</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="marco@readie.ai"
                required style={s.input}
              />
              {error && <p style={s.error}>{error}</p>}
              <button type="submit" disabled={loading} style={s.btn}>
                {loading ? '寄送中…' : '發送登入連結'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#1C2B2B',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  card: {
    background: 'rgba(250,248,244,.04)',
    border: '1px solid rgba(250,248,244,.1)',
    borderRadius: 18,
    padding: '48px 44px',
    width: '100%', maxWidth: 420,
    backdropFilter: 'blur(12px)',
  },
  logo: {
    fontFamily: 'var(--font-serif), serif',
    fontWeight: 900, fontSize: '1.5rem',
    color: '#FAF8F4', marginBottom: 32,
  },
  dot: { color: '#D46B2F' },
  title: {
    fontFamily: 'var(--font-serif), serif',
    fontWeight: 900, fontSize: '1.7rem',
    color: '#FAF8F4', margin: '0 0 10px',
  },
  sub: { fontSize: 14, color: 'rgba(250,248,244,.6)', margin: '0 0 28px', lineHeight: 1.6 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { fontSize: 12, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(250,248,244,.5)' },
  input: {
    padding: '11px 14px',
    background: 'rgba(250,248,244,.06)',
    border: '1px solid rgba(250,248,244,.15)',
    borderRadius: 9, fontSize: 15, color: '#FAF8F4',
    outline: 'none',
  },
  btn: {
    marginTop: 8, padding: '12px',
    background: '#D46B2F', color: '#fff',
    border: 'none', borderRadius: 100,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    transition: '.2s',
  },
  error: { color: '#f87171', fontSize: 13, margin: 0 },
  sentBox: { textAlign: 'center', padding: '8px 0' },
  sentIcon: { fontSize: 42, marginBottom: 16 },
  sentTitle: { fontFamily: 'var(--font-serif), serif', fontWeight: 700, fontSize: '1.2rem', color: '#FAF8F4', margin: '0 0 6px' },
  sentEmail: { fontSize: 14, fontWeight: 500, color: '#D46B2F', margin: '0 0 16px' },
  sentHint: { fontSize: 13, color: 'rgba(250,248,244,.5)', margin: 0, lineHeight: 1.6 },
}
