import Link from 'next/link'

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF8F4' }}>
      {/* 深色頂部導覽 */}
      <div style={nav.bar}>
        <Link href="/admin/documents" style={nav.logo}>
          Readie<span style={nav.dot}>.</span>
          <span style={nav.sub}>Sign</span>
        </Link>
        <Link href="/admin/documents/new" style={nav.btn}>＋ 建立新文件</Link>
      </div>
      {/* 內容區 */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px' }}>
        {children}
      </div>
    </div>
  )
}

const nav: Record<string, React.CSSProperties> = {
  bar:  { background: '#1C2B2B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid rgba(250,248,244,.08)' },
  logo: { fontFamily: 'var(--font-serif), serif', fontWeight: 900, fontSize: '1.2rem', color: '#FAF8F4', textDecoration: 'none' },
  dot:  { color: '#D46B2F' },
  sub:  { fontFamily: 'var(--font-sans), sans-serif', fontWeight: 300, fontSize: '.85rem', color: 'rgba(250,248,244,.45)', marginLeft: 6 },
  btn:  { padding: '8px 20px', background: '#D46B2F', color: '#fff', borderRadius: 100, textDecoration: 'none', fontSize: 13, fontWeight: 600 },
}
