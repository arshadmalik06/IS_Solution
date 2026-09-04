import { lazy, Suspense, useState, useEffect } from 'react'
import { API_BASE_URL } from '../../api/connection'
import type { FindStatus } from './PdfViewer'

// PDF.js + its worker are ~1 MB — only pull them in when a PDF is actually opened.
const PdfViewer = lazy(() => import('./PdfViewer'))

interface SplitScreenProps {
  filename: string
  page: number
  /** Clause phrase the assistant cited — highlighted in the PDF. */
  search?: string
  onClose: () => void
}

function StatusBanner({ status }: { status: FindStatus | null }) {
  if (!status || status.kind === 'no-phrase') return null

  const cfg: Record<string, { text: string; cls: string }> = {
    searching: { text: 'Locating the cited text…', cls: 'bg-amber-50 text-amber-800 border-amber-200' },
    matched: {
      text:
        status.kind === 'matched' && status.exact
          ? 'Exact text found and highlighted below'
          : 'Text found and highlighted below (closest match)',
      cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    'not-found': {
      text: 'Could not locate the exact sentence — showing the cited page only, nothing highlighted',
      cls: 'bg-red-50 text-red-800 border-red-200',
    },
  }
  const c = cfg[status.kind]
  if (!c) return null

  return (
    <div className={`px-4 py-1.5 text-xs font-medium border-b flex items-center gap-1.5 ${c.cls}`}>
      {status.kind === 'searching' && (
        <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {status.kind === 'matched' && <span>✓</span>}
      {status.kind === 'not-found' && <span>⚠</span>}
      {c.text}
    </div>
  )
}

export default function SplitScreen({ filename, page, search, onClose }: SplitScreenProps) {
  const pdfUrl = `${API_BASE_URL}/static/pdfs/${encodeURIComponent(filename)}`
  const [status, setStatus] = useState<FindStatus | null>(null)

  // Reset the banner whenever we're pointed at a new target, so a stale
  // "found" from the previous clause never lingers while the next one loads.
  useEffect(() => {
    setStatus(search ? { kind: 'searching' } : null)
  }, [pdfUrl, page, search])

  return (
    <div className="w-1/2 h-full flex flex-col bg-gray-50 z-10 shadow-inner border-l border-gray-300">
      {/* PDF Toolbar */}
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center shadow-md">
        <div className="text-sm font-medium flex items-center gap-2 min-w-0">
          <span className="bg-blue-600 px-2 py-0.5 rounded text-xs font-bold tracking-wide shrink-0">
            VERIFICATION MODE
          </span>
          <span className="truncate">
            {filename} — Page {page}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white px-2 py-1 text-sm font-bold transition-colors shrink-0"
        >
          ✕ Close
        </button>
      </div>

      {/* Honest status: tells you whether the highlight below is real, not assumed */}
      <StatusBanner status={status} />

      {/* Real PDF.js viewer: jumps to the page and highlights the cited clause */}
      <div className="relative flex-1 bg-white">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              Loading document viewer…
            </div>
          }
        >
          <PdfViewer key={pdfUrl} url={pdfUrl} page={page} search={search} onStatusChange={setStatus} />
        </Suspense>
      </div>
    </div>
  )
}
