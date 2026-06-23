'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) { setError('Email 或密碼錯誤'); setLoading(false); return }
    router.push('/admin/documents')
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>Readie<span style={s.dot}>.</span></div>
        <h1 style={s.title}>後台登入</h1>
        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>電子郵件</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="marco@readie.ai"
            required style={s.input}
            autoComplete="email"
          />
          <label style={s.label}>密碼</label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required style={s.input}
            autoComplete="current-password"
          />
          {error && <p style={s.error}>{error}</p>}
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? '登入中…' : '登入'}
          </button>
        </form>
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
    color: '#FAF8F4', margin: '0 0 24px',
  },
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
}
