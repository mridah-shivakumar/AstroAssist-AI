import { useState } from 'react'
import { NavLink } from 'react-router-dom'

interface NavItem {
  label: string
  path: string
  icon: JSX.Element
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Asteroid Monitor',
    path: '/asteroids',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
        <path d="M12 6v2M12 16v2M6 12H4M20 12h-2" />
      </svg>
    ),
  },
  {
    label: 'Mars Explorer',
    path: '/mars',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8M3.6 15h16.8" />
        <path d="M12 3a9 9 0 0 1 4 16M12 3a9 9 0 0 0-4 16" />
      </svg>
    ),
  },
  {
    label: 'Mission Control',
    path: '/missions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L8.5 8.5 2 9.27l4.5 4.5L5.32 20.5 12 17.02l6.68 3.48L17.5 13.97 22 9.27l-6.5-.77L12 2z" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Mission Insights',
    path: '/insights',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
]

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L8.5 8.5L2 9.27L6.5 13.97L5.32 20.5L12 17.02L18.68 20.5L17.5 13.97L22 9.27L15.5 8.5L12 2Z" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {collapsed ? (
      <path d="M9 18l6-6-6-6" />
    ) : (
      <path d="M15 18l-6-6 6-6" />
    )}
  </svg>
)

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`
        relative flex flex-col h-screen bg-space-surface border-r border-space-border
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo / Wordmark */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-space-border ${collapsed ? 'justify-center' : ''}`}>
        <span className="text-space-blue-400 flex-shrink-0">
          <LogoIcon />
        </span>
        {!collapsed && (
          <div>
            <span className="text-sm font-bold text-white tracking-wide">AstroAssist</span>
            <span className="text-sm font-bold text-space-blue-400"> AI</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-150 group
                  ${isActive
                    ? 'bg-space-blue-800 text-space-blue-400 shadow-lg'
                    : 'text-slate-400 hover:bg-space-card hover:text-slate-200'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-space-border">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500
            hover:bg-space-card hover:text-slate-300 transition-all duration-150
            ${collapsed ? 'justify-center' : ''}
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <CollapseIcon collapsed={collapsed} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
