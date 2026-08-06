interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      )}
      <div className="mt-3 h-px w-full bg-gradient-to-r from-space-blue-700 via-space-purple-700 to-transparent" />
    </div>
  )
}
