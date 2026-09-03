export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center pt-16 md:pt-24 gap-6 text-center px-4 w-full">
      {/* Logo */}
      <div className="w-28 h-20 flex items-center justify-center">
        <img
          src="/qubis-logo.png"
          alt="QuBIS Logo"
          className="w-full h-full object-contain drop-shadow-md brightness-105"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-[28px] font-bold text-text-primary transition-colors">QuBIS Intelligence Assistant</h2>
        <p className="text-[15px] text-text-muted max-w-[460px] transition-colors">
          Ask anything about Indian Standards, BIS certification schemes, hallmarking, HUID verification, or testing laboratories.
        </p>
      </div>

    </div>
  )
}
