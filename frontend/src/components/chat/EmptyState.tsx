export default function EmptyState() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-5 px-4 pb-36 pt-10 text-center sm:gap-6 sm:pb-40 md:pt-14">
      {/* Logo */}
      <div className="w-28 h-20 flex items-center justify-center">
        <img
          src="/qubis-logo.png"
          alt="QuBIS Logo"
          className="w-full h-full object-contain drop-shadow-md brightness-105"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold leading-tight text-text-primary transition-colors sm:text-[28px]">QuBIS Intelligence Assistant</h2>
        <p className="mx-auto max-w-[460px] text-sm text-text-muted transition-colors sm:text-[15px]">
          Ask anything about Indian Standards, BIS certification schemes, hallmarking, HUID verification, or testing laboratories.
        </p>
      </div>

    </div>
  )
}
