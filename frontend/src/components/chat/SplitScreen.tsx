import React from 'react'

interface SplitScreenProps {
  filename: string
  page: number
  onClose: () => void
}

export default function SplitScreen({ filename, page, onClose }: SplitScreenProps) {
  return (
    <div className="w-1/2 h-full flex flex-col bg-gray-50 z-10 shadow-inner border-l border-gray-300">
      {/* PDF Toolbar */}
      <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center shadow-md">
        <div className="text-sm font-medium flex items-center gap-2">
          <span className="bg-blue-600 px-2 py-0.5 rounded text-xs font-bold tracking-wide">
            VERIFICATION MODE
          </span>
          {filename} — Page {page}
        </div>
        <button 
          onClick={onClose}
          className="text-gray-300 hover:text-white px-2 py-1 text-sm font-bold transition-colors"
        >
          ✕ Close
        </button>
      </div>
      
      {/* PDF Iframe */}
      <iframe
        src={`http://127.0.0.1:8000/static/pdfs/${filename}#page=${page}`}
        className="w-full flex-1 border-none bg-white"
        title="BIS Document Viewer"
      />
    </div>
  )
}