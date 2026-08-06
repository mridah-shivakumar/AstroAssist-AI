import { ReactNode } from 'react'

interface CardProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export default function Card({ title, icon, children, className = '' }: CardProps) {
  return (
    <div
      className={`
        rounded-xl bg-space-card border border-space-border
        p-5 flex flex-col gap-3
        hover:border-space-blue-800 transition-colors duration-200
        ${className}
      `}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className="text-space-blue-400 flex-shrink-0">{icon}</span>
        )}
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide uppercase">
          {title}
        </h2>
      </div>
      <div className="text-sm text-slate-400 leading-relaxed">{children}</div>
    </div>
  )
}
