import { lazy, Suspense } from 'react'
import { API_BASE_URL } from '../../api/connection'

// PDF.js + its worker are ~1 MB — only pull them in when a PDF is actually opened.
const PdfViewer = lazy(() => import('./PdfViewer'))

interface SplitScreenProps {
  filename: string
  page: number
  /** Clause phrase the assistant cited — highlighted in the PDF. */
  search?: string
  onClose: () => void
}

export default function SplitScreen({ filename, page, search, onClose }: SplitScreenProps) {
  const pdfUrl = `${API_BASE_URL}/static/pdfs/${encodeURIComponent(filename)}`

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

      {/* Real PDF.js viewer: jumps to the page and highlights the cited clause */}
      <div className="relative flex-1 bg-white">
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              Loading document viewer…
            </div>
          }
        >
          <PdfViewer key={pdfUrl} url={pdfUrl} page={page} search={search} />
        </Suspense>
      </div>
    </div>
  )
}
