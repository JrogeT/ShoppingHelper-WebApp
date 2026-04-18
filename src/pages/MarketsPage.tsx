import { useState, useEffect, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Supermarket } from '../types'
import { Plus, Pencil, Trash2, Store, X, AlertCircle, Search, ArrowRightLeft } from 'lucide-react'

function SupermarketModal({
  supermarket,
  onClose,
  onSaved,
}: {
  supermarket: Supermarket | null
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(supermarket?.name ?? '')
  const [aliases, setAliases] = useState((supermarket?.aliases ?? []).join(', '))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setError(null)
    setLoading(true)

    const aliasArray = aliases
      .split(',')
      .map(a => a.trim())
      .filter(Boolean)

    if (supermarket) {
      const oldName = supermarket.name
      const newName = name.trim()

      const { error: mErr } = await supabase
        .from('supermarkets')
        .update({ name: newName, aliases: aliasArray })
        .eq('id', supermarket.id)

      if (mErr) { setError(mErr.message); setLoading(false); return }

      if (oldName !== newName) {
        await supabase
          .from('products')
          .update({ supermarket: newName })
          .eq('supermarket', oldName)
      }
    } else {
      const { error: mErr } = await supabase
        .from('supermarkets')
        .insert({ name: name.trim(), aliases: aliasArray })

      if (mErr) { setError(mErr.message); setLoading(false); return }
    }

    setLoading(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            {supermarket ? 'Editar supermercado' : 'Nuevo supermercado'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nombre del supermercado
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Hipermaxi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Alias / Pseudónimos
            </label>
            <p className="text-xs text-slate-400 mb-1.5">
              Nombres alternativos separados por coma. La app los usará para evitar duplicados.
            </p>
            <input
              type="text"
              value={aliases}
              onChange={e => setAliases(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Hiper, Hipermaxi SRL, hipermaxi norte"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-sm font-semibold text-white"
            >
              {loading ? 'Guardando...' : supermarket ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MergeModal({
  source,
  allSupermarkets,
  onClose,
  onMerged,
}: {
  source: Supermarket
  allSupermarkets: Supermarket[]
  onClose: () => void
  onMerged: () => void
}) {
  const targets = allSupermarkets.filter(s => s.id !== source.id)
  const [targetId, setTargetId] = useState(targets[0]?.id ?? '')
  const [loading, setLoading] = useState(false)
  const [productCount, setProductCount] = useState<number | null>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('supermarket', source.name)
      .then(({ count }) => setProductCount(count ?? 0))
  }, [source.name])

  const target = targets.find(t => t.id === targetId)

  const handleMerge = async () => {
    if (!target) return
    setLoading(true)
    await supabase
      .from('products')
      .update({ supermarket: target.name })
      .eq('supermarket', source.name)
    await supabase.from('supermarkets').delete().eq('id', source.id)
    setLoading(false)
    onMerged()
    onClose()
  }

  if (targets.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Sin destino disponible</h3>
          <p className="text-sm text-slate-500 mb-4">
            No hay otros supermercados a los que migrar los datos. Crea otro supermercado primero.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
          <ArrowRightLeft size={22} className="text-orange-600" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">Migrar supermercado</h3>
        <p className="text-sm text-slate-500 mb-1">
          Todos los productos de <span className="font-medium text-slate-800">{source.name}</span> se
          moverán al supermercado destino, y <span className="font-medium text-slate-800">{source.name}</span> será eliminado.
        </p>
        {productCount !== null && (
          <p className="text-sm font-medium text-orange-600 mb-4">
            {productCount} producto{productCount !== 1 ? 's' : ''} serán migrado{productCount !== 1 ? 's' : ''}.
          </p>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Mover hacia
          </label>
          <select
            value={targetId}
            onChange={e => setTargetId(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {targets.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleMerge}
            disabled={loading || !target}
            className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-xl text-sm font-semibold text-white"
          >
            {loading ? 'Migrando...' : 'Migrar y eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirm({
  supermarket,
  onClose,
  onDeleted,
}: {
  supermarket: Supermarket
  onClose: () => void
  onDeleted: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [productCount, setProductCount] = useState<number | null>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('supermarket', supermarket.name)
      .then(({ count }) => setProductCount(count ?? 0))
  }, [supermarket.name])

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from('products').delete().eq('supermarket', supermarket.name)
    await supabase.from('supermarkets').delete().eq('id', supermarket.id)
    setLoading(false)
    onDeleted()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
          <Trash2 size={22} className="text-red-600" />
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">Eliminar supermercado</h3>
        <p className="text-sm text-slate-500 mb-1">
          ¿Seguro que quieres eliminar <span className="font-medium text-slate-800">{supermarket.name}</span>?
        </p>
        {productCount !== null && productCount > 0 && (
          <p className="text-sm text-red-600 font-medium mb-4">
            Esto también eliminará {productCount} producto{productCount !== 1 ? 's' : ''} asociado{productCount !== 1 ? 's' : ''}. Considera usar "Migrar" para conservarlos.
          </p>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl text-sm font-semibold text-white"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MarketsPage() {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Supermarket | null>(null)
  const [deleting, setDeleting] = useState<Supermarket | null>(null)
  const [merging, setMerging] = useState<Supermarket | null>(null)
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})

  const loadSupermarkets = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('supermarkets')
      .select('*')
      .order('name')
    setSupermarkets(data ?? [])
    setLoading(false)

    const { data: counts } = await supabase
      .from('supermarket_product_counts')
      .select('supermarket, count')
    if (counts) {
      const map: Record<string, number> = {}
      counts.forEach(r => { map[r.supermarket] = Number(r.count) })
      setProductCounts(map)
    }
  }

  useEffect(() => { loadSupermarkets() }, [])

  const filtered = supermarkets.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.aliases ?? []).some(a => a.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Supermercados</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {supermarkets.length} supermercado{supermarkets.length !== 1 ? 's' : ''} registrado{supermarkets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true) }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Nuevo supermercado
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o alias..."
          className="w-full max-w-sm pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
              <div className="w-10 h-10 bg-slate-100 rounded-xl mb-3" />
              <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Store size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No se encontraron supermercados</p>
          {search && <p className="text-xs mt-1">Intenta con otro término</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(supermarket => (
            <div
              key={supermarket.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Store size={20} className="text-blue-600" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditing(supermarket); setModalOpen(true) }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setMerging(supermarket)}
                    className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Migrar a otro supermercado"
                  >
                    <ArrowRightLeft size={15} />
                  </button>
                  <button
                    onClick={() => setDeleting(supermarket)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{supermarket.name}</h3>
              {supermarket.aliases && supermarket.aliases.length > 0 && (
                <p className="text-xs text-slate-400 mt-0.5 truncate" title={supermarket.aliases.join(', ')}>
                  {supermarket.aliases.join(', ')}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                {productCounts[supermarket.name] ?? 0} producto{(productCounts[supermarket.name] ?? 0) !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <SupermarketModal
          supermarket={editing}
          onClose={() => setModalOpen(false)}
          onSaved={loadSupermarkets}
        />
      )}

      {merging && (
        <MergeModal
          source={merging}
          allSupermarkets={supermarkets}
          onClose={() => setMerging(null)}
          onMerged={loadSupermarkets}
        />
      )}

      {deleting && (
        <DeleteConfirm
          supermarket={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={loadSupermarkets}
        />
      )}
    </div>
  )
}
