export default function EmptyState() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-6 px-4 pb-36 pt-10 text-center sm:gap-8 sm:pb-40 md:pt-14">
      {/* Logo */}
      <div className="w-28 h-20 flex items-center justify-center">
        <img
          src="/qubis-logo.png"
          alt="QuBIS Logo"
          className="w-full h-full object-contain drop-shadow-md brightness-105"
        />
      </div>

      <div className="space-y-3">
        <h2 className="type-h1 text-text-primary transition-colors">QuBIS Intelligence Assistant</h2>
        <p className="mx-auto max-w-[480px] text-[16px] leading-relaxed text-text-muted transition-colors">
          Ask anything about Indian Standards, BIS certification schemes, hallmarking, HUID verification, or testing laboratories.
        </p>
      </div>

    </div>
  )
}
