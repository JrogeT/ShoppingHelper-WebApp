import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Store, Package, TrendingUp, ArrowRight, Clock } from 'lucide-react'

interface Stats {
  totalMarkets: number
  totalProducts: number
  avgPrice: number
  recentProducts: {
    id: string
    name: string
    brand: string
    supermarket: string
    price: number
    currency: string
    created_at: string
  }[]
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  sub?: string
}) {
  return (
    <div className="bg-crema rounded-2xl border border-grafito/10 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-bold text-grafito mb-0.5">{value}</p>
      <p className="text-sm text-grafito/70">{label}</p>
      {sub && <p className="text-xs text-grafito/50 mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [
        { count: totalMarkets },
        { count: totalProducts },
        { data: avgData },
        { data: recentProducts },
      ] = await Promise.all([
        supabase.from('supermarkets').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.rpc('get_products_avg_price'),
        supabase
          .from('products')
          .select('id, name, brand, supermarket, price, currency, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setStats({
        totalMarkets: totalMarkets ?? 0,
        totalProducts: totalProducts ?? 0,
        avgPrice: Number(avgData ?? 0),
        recentProducts: recentProducts ?? [],
      })
      setLoading(false)
    }
    load()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-BO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-grafito">
          {greeting()}{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h1>
        <p className="text-sm text-grafito/70 mt-0.5">Panel de administración — Canasta</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-crema rounded-2xl border border-grafito/10 p-5 animate-pulse">
              <div className="w-10 h-10 bg-crema/80 rounded-xl mb-4" />
              <div className="h-7 bg-crema/80 rounded w-1/2 mb-1" />
              <div className="h-4 bg-crema/80 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Supermercados registrados"
            value={stats?.totalMarkets ?? 0}
            icon={Store}
            color="bg-verde/10 text-verde"
          />
          <StatCard
            label="Productos en total"
            value={stats?.totalProducts ?? 0}
            icon={Package}
            color="bg-verde/10 text-verde"
          />
          <StatCard
            label="Precio promedio"
            value={stats?.avgPrice ? `${stats.avgPrice.toFixed(2)} BOB` : '—'}
            icon={TrendingUp}
            color="bg-ambar/10 text-ambar"
            sub="promedio de todos los productos"
          />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Link
          to="/markets"
          className="bg-crema rounded-2xl border border-grafito/10 p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-verde/10 rounded-2xl flex items-center justify-center shrink-0">
            <Store size={22} className="text-verde" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-grafito text-sm">Gestionar Supermercados</p>
            <p className="text-xs text-grafito/50 mt-0.5">Crear, editar o eliminar supermercados</p>
          </div>
          <ArrowRight size={18} className="text-grafito/30 group-hover:text-verde transition-colors" />
        </Link>

        <Link
          to="/products"
          className="bg-crema rounded-2xl border border-grafito/10 p-5 flex items-center gap-4 hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 bg-verde/10 rounded-2xl flex items-center justify-center shrink-0">
            <Package size={22} className="text-verde" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-grafito text-sm">Gestionar Productos</p>
            <p className="text-xs text-grafito/50 mt-0.5">Agregar precios y editar productos</p>
          </div>
          <ArrowRight size={18} className="text-grafito/30 group-hover:text-verde transition-colors" />
        </Link>
      </div>

      {/* Recent products */}
      <div className="bg-crema rounded-2xl border border-grafito/10">
        <div className="flex items-center justify-between px-5 py-4 border-b border-grafito/10">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-grafito/50" />
            <h2 className="font-semibold text-grafito text-sm">Productos recientes</h2>
          </div>
          <Link to="/products" className="text-xs text-verde hover:underline font-medium">
            Ver todos
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-grafito/5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-crema/80 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-crema/80 rounded w-1/3" />
                  <div className="h-3 bg-crema/80 rounded w-1/4" />
                </div>
                <div className="h-4 bg-crema/80 rounded w-14" />
              </div>
            ))}
          </div>
        ) : (stats?.recentProducts.length ?? 0) === 0 ? (
          <p className="text-center py-10 text-sm text-grafito/50">No hay productos aún</p>
        ) : (
          <div className="divide-y divide-grafito/5">
            {stats!.recentProducts.map(p => (
              <div key={p.id} className="px-5 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 bg-crema/80 rounded-xl flex items-center justify-center shrink-0">
                  <Package size={14} className="text-grafito/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-grafito truncate">{p.name}</p>
                  <p className="text-xs text-grafito/50">{p.supermarket} · {formatDate(p.created_at)}</p>
                </div>
                <span className="text-sm font-semibold text-grafito shrink-0">
                  {p.price.toFixed(2)} <span className="text-xs text-grafito/50 font-normal">{p.currency}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
