'use client'

import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react'

export type SignaturePadRef = {
  isEmpty: () => boolean
  toDataURL: () => string
  clear: () => void
}

const SignaturePad = forwardRef<SignaturePadRef, { width?: number; height?: number }>(
  function SignaturePad({ width = 560, height = 160 }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const drawing = useRef(false)
    const [empty, setEmpty] = useState(true)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#1C2B2B'
      ctx.lineWidth = 2.2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }, [])

    useImperativeHandle(ref, () => ({
      isEmpty: () => empty,
      toDataURL: () => canvasRef.current?.toDataURL('image/png') ?? '',
      clear: () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        setEmpty(true)
      },
    }))

    function getPos(e: React.MouseEvent | React.TouchEvent) {
      const canvas = canvasRef.current!
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      if ('touches' in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scaleX,
          y: (e.touches[0].clientY - rect.top) * scaleY,
        }
      }
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      }
    }

    function startDraw(e: React.MouseEvent | React.TouchEvent) {
      e.preventDefault()
      drawing.current = true
      const ctx = canvasRef.current!.getContext('2d')!
      const { x, y } = getPos(e)
      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    function draw(e: React.MouseEvent | React.TouchEvent) {
      e.preventDefault()
      if (!drawing.current) return
      const ctx = canvasRef.current!.getContext('2d')!
      const { x, y } = getPos(e)
      ctx.lineTo(x, y)
      ctx.stroke()
      setEmpty(false)
    }

    function endDraw() { drawing.current = false }

    return (
      <div style={s.wrap}>
        <canvas
          ref={canvasRef}
          width={width * 2}
          height={height * 2}
          style={{ ...s.canvas, width, height }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        {empty && <div style={s.placeholder}>請在此處簽名</div>}
        <button
          type="button"
          onClick={() => {
            const canvas = canvasRef.current!
            const ctx = canvas.getContext('2d')!
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            setEmpty(true)
          }}
          style={s.clearBtn}
        >
          清除重簽
        </button>
      </div>
    )
  }
)

export default SignaturePad

const s: Record<string, React.CSSProperties> = {
  wrap:        { position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 },
  canvas:      { border: '1.5px solid rgba(28,43,43,.2)', borderRadius: 10, cursor: 'crosshair', touchAction: 'none', background: '#fff', display: 'block' },
  placeholder: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'rgba(28,43,43,.18)', fontSize: 16, pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' },
  clearBtn:    { alignSelf: 'flex-end', background: 'none', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', padding: '2px 0' },
}
