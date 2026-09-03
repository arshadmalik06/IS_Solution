export default function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex gap-1.5 items-center">
        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-dot" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-dot" style={{ animationDelay: '200ms' }} />
        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse-dot" style={{ animationDelay: '400ms' }} />
      </div>
      <span className="text-[13px] text-text-muted transition-colors">QuBIS is analyzing BIS documents...</span>
    </div>
  )
}
