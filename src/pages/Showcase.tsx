import { useEffect, useRef, useState } from 'react'
import pb from '@/lib/pocketbase/client'

type Catalogue = { unidades: Record<string, unknown>[]; config: Record<string, unknown> }

export default function Showcase() {
  const frame = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState('')
  const [doc, setDoc] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      fetch(pb.baseUrl + '/backend/v1/solaris/showcase/index.html').then((r) => {
        if (!r.ok) throw new Error('http ' + r.status)
        return r.text()
      }),
      pb.send<Catalogue>('/backend/v1/solaris/catalogo', { method: 'GET' }),
    ])
      .then(([html, catalogue]) => {
        if (!active) return
        if (!html || html.length < 10000) throw new Error('Showcase não encontrado no backend')
        if (!catalogue.unidades || catalogue.unidades.length !== 160)
          throw new Error('Catálogo incompleto')
        const inject =
          '<script>window.__SOLARIS_DATA__ = ' +
          JSON.stringify(catalogue).replace(/</g, '\\u003c') +
          ';</script>'
        const marker = '<script>\n// GENERATED from dc-runtime'
        const idx = html.indexOf(marker)
        const full = idx >= 0 ? html.slice(0, idx) + inject + '\n' + html.slice(idx) : html
        setDoc(full)
      })
      .catch(() => {
        if (active)
          setError(
            'Não foi possível carregar as residências. Verifique sua conexão e tente novamente.',
          )
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#0d0f12', overflow: 'hidden' }}>
      {doc && (
        <iframe
          ref={frame}
          title="Solaris Residence — experiência interativa"
          srcDoc={doc}
          sandbox="allow-scripts allow-same-origin"
          style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
        />
      )}
      {error && (
        <div
          role="alert"
          style={{
            position: 'absolute',
            inset: 0,
            background: '#0d0f12',
            color: '#f4efe6',
            display: 'grid',
            placeItems: 'center',
            textAlign: 'center',
            padding: 24,
            zIndex: 10,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontWeight: 300,
                fontSize: 44,
                margin: 0,
              }}
            >
              Solaris Residence
            </h1>
            <p>{error}</p>
            <button
              onClick={() => location.reload()}
              style={{
                background: '#d4b67a',
                color: '#17140f',
                border: 0,
                borderRadius: 24,
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
