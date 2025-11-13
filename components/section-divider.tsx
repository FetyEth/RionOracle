export function SectionDivider({ variant = "default" }: { variant?: "default" | "glow" | "dots" }) {
  if (variant === "glow") {
    return (
      <div className="relative w-full h-px my-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_20px_var(--neon-glow)]" />
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className="flex items-center justify-center gap-2 my-20">
        <div className="w-1 h-1 rounded-full bg-primary/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--neon-glow)]" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
        <div className="w-1 h-1 rounded-full bg-primary/30" />
      </div>
    )
  }

  return (
    <div className="relative w-full h-px my-20">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}
