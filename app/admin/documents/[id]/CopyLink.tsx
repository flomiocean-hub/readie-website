'use client'

import { useState } from 'react'

export default function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={copy} style={{
      width: '100%', padding: '11px',
      background: copied ? 'rgba(52,211,153,.15)' : '#D46B2F',
      color: copied ? '#34d399' : '#fff',
      border: copied ? '1px solid rgba(52,211,153,.3)' : 'none',
      borderRadius: 100, fontSize: 14, fontWeight: 600,
      cursor: 'pointer', transition: '.2s',
    }}>
      {copied ? '✓ 已複製' : '複製簽約連結'}
    </button>
  )
}
