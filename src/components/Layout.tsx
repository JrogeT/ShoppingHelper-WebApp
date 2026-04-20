import { useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  ShoppingCart, LayoutDashboard, Store, Package,
  LogOut, Menu, X, ChevronRight,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, exact: true },
  { to: '/markets', label: 'Supermercados', icon: Store },
  { to: '/products', label: 'Productos', icon: Package },
]

function Sidebar({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <aside className={`flex flex-col bg-crema border-r border-grafito/10 h-full transition-all duration-200 ${collapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-grafito/10">
        <div className="w-9 h-9 bg-verde rounded-xl flex items-center justify-center shrink-0">
          <ShoppingCart className="text-white" size={18} />
        </div>
        <div>
          <p className="font-bold text-grafito text-sm leading-tight">Canasta</p>
          <p className="text-xs text-grafito/50">Admin Panel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-grafito/50 hover:text-grafito/70 lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-verde/10 text-verde'
                  : 'text-grafito/70 hover:bg-crema/50 hover:text-grafito'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-verde' : 'text-grafito/50'} />
                {label}
                {isActive && <ChevronRight size={14} className="ml-auto text-verde" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-grafito/10 px-3 py-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-verde/10 flex items-center justify-center text-verde text-xs font-bold shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-grafito truncate">{user?.email ?? 'Usuario'}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-grafito/70 hover:bg-error/10 hover:text-error transition-colors"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-crema/50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar collapsed={false} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar collapsed={false} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-crema border-b border-grafito/10">
          <button onClick={() => setMobileOpen(true)} className="text-grafito/70">
            <Menu size={22} />
          </button>
          <div className="w-7 h-7 bg-verde rounded-lg flex items-center justify-center">
            <ShoppingCart className="text-white" size={14} />
          </div>
          <span className="font-semibold text-grafito text-sm">Canasta</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
