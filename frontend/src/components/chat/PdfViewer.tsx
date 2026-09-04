import { useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import {
  EventBus,
  PDFViewer,
  PDFLinkService,
  PDFFindController,
  FindState,
} from 'pdfjs-dist/web/pdf_viewer.mjs'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import 'pdfjs-dist/web/pdf_viewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

type PdfViewerProps = {
  /** Absolute URL of the PDF to render. */
  url: string
  /** 1-based page to scroll to. */
  page: number
  /** Distinctive clause phrase to find + highlight on that page. */
  search?: string
}

const FIND_BASE = {
  source: null,
  type: '',
  caseSensitive: false,
  entireWord: false,
  highlightAll: true,
  findPrevious: false,
  matchDiacritics: false,
}

/** Progressively shorter word-prefixes of the phrase, for fallback matching. */
function phraseLadder(phrase: string): string[] {
  const words = phrase.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 4) return [words.join(' ')].filter(Boolean)
  const steps = [words.length, 8, 6, 4]
  const seen = new Set<string>()
  const out: string[] = []
  for (const n of steps) {
    const s = words.slice(0, Math.min(n, words.length)).join(' ')
    if (s && !seen.has(s)) {
      seen.add(s)
      out.push(s)
    }
  }
  return out
}

/**
 * Real PDF.js viewer (not an <iframe>): loads the document, jumps to the exact
 * page, then runs the find-controller for the clause phrase so the specific
 * line / table the assistant cited is scrolled into view and highlighted.
 * If the full phrase can't be matched (whitespace/hyphenation drift vs the raw
 * PDF text), it retries with shorter prefixes, and finally just holds the page.
 */
export default function PdfViewer({ url, page, search }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<InstanceType<typeof PDFViewer> | null>(null)
  const eventBusRef = useRef<InstanceType<typeof EventBus> | null>(null)
  const targetRef = useRef({ page, search })
  targetRef.current = { page, search }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let destroyed = false
    let ladder: string[] = []
    let ladderIdx = 0

    const eventBus = new EventBus()
    const linkService = new PDFLinkService({ eventBus })
    const findController = new PDFFindController({ eventBus, linkService })
    const pdfViewer = new PDFViewer({
      container,
      eventBus,
      linkService,
      findController,
      textLayerMode: 2, // text layer required for find + highlight
    })
    linkService.setViewer(pdfViewer)
    viewerRef.current = pdfViewer
    eventBusRef.current = eventBus

    const jumpToPage = () => {
      const { page: p } = targetRef.current
      if (p && p > 0) {
        pdfViewer.currentPageNumber = Math.min(p, pdfViewer.pagesCount || p)
      }
    }

    const dispatchFind = (query: string) =>
      eventBus.dispatch('find', { ...FIND_BASE, query })

    const startFind = () => {
      const { search: q } = targetRef.current
      ladder = q ? phraseLadder(q) : []
      ladderIdx = 0
      if (ladder.length === 0) return
      window.setTimeout(() => {
        if (!destroyed) dispatchFind(ladder[0])
      }, 350)
    }

    // Retry with a shorter phrase when a match isn't found; otherwise hold page.
    const onFindState = (evt: { state: number; matchesCount?: { total: number } }) => {
      if (destroyed) return
      const notFound =
        evt.state === FindState.NOT_FOUND ||
        (evt.state === FindState.FOUND && evt.matchesCount?.total === 0)
      if (!notFound) return
      ladderIdx += 1
      if (ladderIdx < ladder.length) {
        dispatchFind(ladder[ladderIdx])
      } else {
        jumpToPage() // give up on highlight, at least land on the right page
      }
    }
    eventBus.on('updatefindcontrolstate', onFindState)

    const goToTarget = () => {
      if (destroyed) return
      pdfViewer.currentScaleValue = 'page-width'
      jumpToPage()
      startFind()
    }
    eventBus.on('pagesinit', goToTarget)

    const loadingTask = pdfjsLib.getDocument({
      url,
      // cmaps + fonts vendored into /public/pdfjs (needed for Devanagari / CID glyphs)
      cMapUrl: '/pdfjs/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/pdfjs/standard_fonts/',
    })
    loadingTask.promise
      .then((pdf) => {
        if (destroyed) return
        pdfViewer.setDocument(pdf)
        linkService.setDocument(pdf, null)
      })
      .catch((err) => {
        if (!destroyed) console.error('[PdfViewer] failed to load PDF:', err)
      })

    return () => {
      destroyed = true
      eventBus.off('pagesinit', goToTarget)
      eventBus.off('updatefindcontrolstate', onFindState)
      loadingTask.destroy().catch(() => {})
      try {
        pdfViewer.setDocument(null as never)
      } catch {
        /* noop */
      }
      viewerRef.current = null
      eventBusRef.current = null
    }
  }, [url])

  // React to page / search changes without reloading the document.
  useEffect(() => {
    const pdfViewer = viewerRef.current
    const eventBus = eventBusRef.current
    if (!pdfViewer || !eventBus || !pdfViewer.pdfDocument) return
    if (page && page > 0) {
      pdfViewer.currentPageNumber = Math.min(page, pdfViewer.pagesCount || page)
    }
    const ladder = search ? phraseLadder(search) : []
    if (ladder.length) {
      window.setTimeout(() => eventBus.dispatch('find', { ...FIND_BASE, query: ladder[0] }), 250)
    }
  }, [page, search])

  // PDFViewer needs an absolutely-positioned container holding a .pdfViewer div.
  return (
    <div className="absolute inset-0 overflow-auto bg-neutral-300/60">
      <div ref={containerRef} className="absolute inset-0 overflow-auto">
        <div className="pdfViewer" />
      </div>
    </div>
  )
}
