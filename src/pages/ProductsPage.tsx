import { useState, useEffect, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import type { Product, Supermarket } from '../types'
import { Plus, Pencil, Trash2, Package, X, AlertCircle, Search, ChevronDown, TrendingUp, Layers, CheckCircle2 } from 'lucide-react'
import Combobox from '../components/Combobox'

const CURRENCIES = ['BOB', 'USD']

const SIZE_SUGGESTIONS = [
  // Volume
  '100ml', '200ml', '250ml', '330ml', '350ml', '500ml', '750ml', '1L', '1.5L', '2L', '3L', '5L',
  // Weight
  '50g', '100g', '200g', '250g', '400g', '500g', '1kg', '2kg', '5kg', '10kg', '25kg',
  // Units
  '1 unidad', '2 unidades', '3 unidades', '4 unidades', '6 unidades', '12 unidades', '24 unidades',
  // Packs
  '1 paquete', '1 bolsa', '1 caja', '1 docena',
].map(v => ({ value: v }))

interface CatalogItem {
  id: string
  name: string
  brand: string
  size: string
}

function ProductModal({
  product,
  markets,
  defaultMarket,
  onClose,
  onSaved,
}: {
  product: Product | null
  markets: Supermarket[]
  defaultMarket: string
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    size: product?.size ?? '',
    supermarket: product?.supermarket ?? defaultMarket,
    price: product?.price?.toString() ?? '',
    currency: product?.currency ?? 'BOB',
    notes: product?.notes ?? '',
    image_url: product?.image_url ?? '',
    product_id: product?.product_id ?? null as string | null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [catalogOptions, setCatalogOptions] = useState<CatalogItem[]>([])

  useEffect(() => {
    supabase.from('product_catalog').select('id, name, brand, size').order('name')
      .then(({ data }) => setCatalogOptions(data ?? []))
  }, [])

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleCatalogSelect = (option: { value: string }) => {
    const item = catalogOptions.find(c => c.name === option.value)
    if (!item) return
    setForm(f => ({
      ...f,
      name: item.name,
      brand: item.brand ?? f.brand,
      size: item.size ?? f.size,
      product_id: item.id,
    }))
  }

  const handleNameChange = (v: string) => {
    setForm(f => ({ ...f, name: v, product_id: null }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      size: form.size.trim(),
      supermarket: form.supermarket,
      price: parseFloat(form.price) || 0,
      currency: form.currency,
      notes: form.notes.trim(),
      image_url: form.image_url.trim() || null,
      product_id: form.product_id,
    }

    let err
    if (product) {
      const { error } = await supabase.from('products').update(payload).eq('id', product.id)
      err = error
    } else {
      const { error } = await supabase.from('products').insert(payload)
      err = error
    }

    if (err) { setError(err.message); setLoading(false); return }
    setLoading(false)
    onSaved()
    onClose()
  }

  const nameOptions = catalogOptions.map(c => ({
    value: c.name,
    sublabel: [c.brand, c.size].filter(Boolean).join(' · '),
  }))

  const supermarketOptions = markets.map(m => ({ value: m.name }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="font-semibold text-slate-900">{product ? 'Editar producto' : 'Nuevo producto'}</h3>
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

          {form.product_id && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-3 py-2 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              Vinculado al catálogo de productos
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Nombre *</label>
              <Combobox
                value={form.name}
                onChange={handleNameChange}
                onSelect={handleCatalogSelect}
                options={nameOptions}
                placeholder="Ej: Leche entera"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Marca</label>
              <input
                value={form.brand}
                onChange={e => set('brand', e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: PIL Andina"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Tamaño / Cantidad</label>
              <Combobox
                value={form.size}
                onChange={v => set('size', v)}
                options={SIZE_SUGGESTIONS}
                placeholder="Ej: 1L, 500g"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Supermercado *</label>
              <Combobox
                value={form.supermarket}
                onChange={v => set('supermarket', v)}
                options={supermarketOptions}
                placeholder="Seleccionar..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Precio *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  required
                  className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                <div className="relative">
                  <select
                    value={form.currency}
                    onChange={e => set('currency', e.target.value)}
                    className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-7"
                  >
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Notas</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Notas adicionales..."
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">URL de imagen</label>
              <input
                value={form.image_url}
                onChange={e => set('image_url', e.target.value)}
                type="url"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
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
              {loading ? 'Guardando...' : product ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface PriceRecord {
  price: number
  created_at: string
  supermarket: string
}

const LINE_COLORS = ['#2563EB', '#059669', '#DC2626', '#7C3AED', '#EA580C', '#0EA5E9']

function PriceTimelineModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [records, setRecords] = useState<PriceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null)

  useEffect(() => {
    async function load() {
      let query = supabase
        .from('products')
        .select('price, created_at, supermarket')
        .order('created_at', { ascending: true })

      if (product.product_id) {
        query = query.eq('product_id', product.product_id)
      } else {
        query = query.eq('name', product.name).eq('supermarket', product.supermarket)
      }

      const { data } = await query
      setRecords((data ?? []) as PriceRecord[])
      setLoading(false)
    }
    load()
  }, [product])

  const supermarkets = [...new Set(records.map(r => r.supermarket))]

  const W = 520
  const H = 220
  const PAD = { top: 16, right: 16, bottom: 40, left: 52 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const allDates = records.map(r => new Date(r.created_at).getTime())
  const allPrices = records.map(r => r.price)
  const minDate = Math.min(...allDates)
  const maxDate = Math.max(...allDates)
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const dateRange = maxDate - minDate || 1
  const priceRange = maxPrice - minPrice || 1

  const toX = (ts: number) => PAD.left + ((ts - minDate) / dateRange) * chartW
  const toY = (price: number) => PAD.top + chartH - ((price - minPrice) / priceRange) * chartH

  const yTicks = 4
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) =>
    minPrice + (priceRange / yTicks) * i
  )

  const xDates = [...new Set(allDates)].sort()
  const xTickStep = Math.max(1, Math.floor(xDates.length / 5))
  const xTicks = xDates.filter((_, i) => i % xTickStep === 0)

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h3 className="font-semibold text-slate-900">{product.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Historial de precios</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Cargando...</div>
          ) : records.length < 2 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
              <TrendingUp size={32} className="opacity-30" />
              <p className="text-sm">No hay suficiente historial aún</p>
            </div>
          ) : (
            <>
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-4">
                {supermarkets.map((sm, i) => (
                  <span key={sm} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-3 h-0.5 rounded-full inline-block" style={{ backgroundColor: LINE_COLORS[i % LINE_COLORS.length] }} />
                    {sm}
                  </span>
                ))}
              </div>

              {/* SVG Chart */}
              <div className="relative overflow-x-auto">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }}
                  onMouseLeave={() => setTooltip(null)}>
                  {/* Grid lines */}
                  {yTickVals.map((v, i) => (
                    <g key={i}>
                      <line
                        x1={PAD.left} y1={toY(v)} x2={W - PAD.right} y2={toY(v)}
                        stroke="#F1F5F9" strokeWidth={1}
                      />
                      <text x={PAD.left - 6} y={toY(v) + 4} textAnchor="end"
                        fontSize={9} fill="#94A3B8">
                        {v.toFixed(2)}
                      </text>
                    </g>
                  ))}

                  {/* X-axis labels */}
                  {xTicks.map((ts, i) => (
                    <text key={i} x={toX(ts)} y={H - 6} textAnchor="middle"
                      fontSize={9} fill="#94A3B8">
                      {formatDate(ts)}
                    </text>
                  ))}

                  {/* Lines + dots per supermarket */}
                  {supermarkets.map((sm, si) => {
                    const smRecords = records.filter(r => r.supermarket === sm)
                    const color = LINE_COLORS[si % LINE_COLORS.length]
                    const points = smRecords.map(r =>
                      `${toX(new Date(r.created_at).getTime())},${toY(r.price)}`
                    ).join(' ')
                    return (
                      <g key={sm}>
                        <polyline
                          points={points}
                          fill="none"
                          stroke={color}
                          strokeWidth={2}
                          strokeLinejoin="round"
                        />
                        {smRecords.map((r, ri) => {
                          const cx = toX(new Date(r.created_at).getTime())
                          const cy = toY(r.price)
                          return (
                            <circle
                              key={ri}
                              cx={cx} cy={cy} r={4}
                              fill={color} stroke="#fff" strokeWidth={2}
                              className="cursor-pointer"
                              onMouseEnter={e => {
                                const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect()
                                setTooltip({
                                  x: e.clientX - rect.left,
                                  y: e.clientY - rect.top - 36,
                                  label: `${sm} · ${formatDate(new Date(r.created_at).getTime())} · Bs ${r.price.toFixed(2)}`,
                                })
                              }}
                              onMouseLeave={() => setTooltip(null)}
                            />
                          )
                        })}
                      </g>
                    )
                  })}
                </svg>
                {tooltip && (
                  <div
                    className="absolute bg-slate-900 text-white text-xs px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap"
                    style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
                  >
                    {tooltip.label}
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="mt-5 border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-3 py-2 text-left text-slate-500 font-medium">Fecha</th>
                      <th className="px-3 py-2 text-left text-slate-500 font-medium">Supermercado</th>
                      <th className="px-3 py-2 text-right text-slate-500 font-medium">Precio (BOB)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[...records].reverse().map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-600">
                          {new Date(r.created_at).toLocaleDateString('es-BO')}
                        </td>
                        <td className="px-3 py-2 text-slate-700 font-medium">{r.supermarket}</td>
                        <td className="px-3 py-2 text-right font-semibold text-slate-900">
                          {r.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DeleteProductConfirm({
  product,
  onClose,
  onDeleted,
}: {
  product: Product
  onClose: () => void
  onDeleted: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    await supabase.from('products').delete().eq('id', product.id)
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
        <h3 className="font-semibold text-slate-900 mb-2">Eliminar producto</h3>
        <p className="text-sm text-slate-500">
          ¿Seguro que quieres eliminar <span className="font-medium text-slate-800">{product.name}</span>{product.brand ? ` (${product.brand})` : ''}?
        </p>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
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

function normalizeName(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

interface CatalogEntry {
  id: string
  name: string
  brand: string
  size: string
  productCount: number
}

interface DuplicateGroup {
  key: string
  entries: CatalogEntry[]
  canonicalId: string
}

function PurgeModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<DuplicateGroup[]>([])
  const [merging, setMerging] = useState(false)
  const [mergedCount, setMergedCount] = useState<number | null>(null)

  useEffect(() => { loadDuplicates() }, [])

  async function loadDuplicates() {
    setLoading(true)
    const [{ data: catalog }, { data: products }] = await Promise.all([
      supabase.from('product_catalog').select('id, name, brand, size').order('name'),
      supabase.from('products').select('product_id').not('product_id', 'is', null),
    ])
    if (!catalog) { setLoading(false); return }

    const countMap: Record<string, number> = {}
    for (const p of (products ?? [])) {
      if (p.product_id) countMap[p.product_id] = (countMap[p.product_id] ?? 0) + 1
    }

    const entries: CatalogEntry[] = catalog.map(c => ({ ...c, productCount: countMap[c.id] ?? 0 }))
    const groupMap: Record<string, CatalogEntry[]> = {}
    for (const entry of entries) {
      const key = normalizeName(entry.name)
      if (!groupMap[key]) groupMap[key] = []
      groupMap[key].push(entry)
    }

    const duplicateGroups: DuplicateGroup[] = Object.entries(groupMap)
      .filter(([, es]) => es.length >= 2)
      .map(([key, es]) => {
        const sorted = [...es].sort((a, b) => b.productCount - a.productCount)
        return { key, entries: sorted, canonicalId: sorted[0].id }
      })

    setGroups(duplicateGroups)
    setLoading(false)
  }

  function setCanonical(groupKey: string, id: string) {
    setGroups(gs => gs.map(g => g.key === groupKey ? { ...g, canonicalId: id } : g))
  }

  async function handlePurge() {
    setMerging(true)
    let count = 0
    for (const group of groups) {
      const canonical = group.entries.find(e => e.id === group.canonicalId)!
      const duplicates = group.entries.filter(e => e.id !== group.canonicalId)
      for (const dup of duplicates) {
        await supabase.from('products').update({
          product_id: canonical.id,
          name: canonical.name,
          brand: canonical.brand,
          size: canonical.size,
        }).eq('product_id', dup.id)
        await supabase.from('product_catalog').delete().eq('id', dup.id)
        count++
      }
    }
    setMergedCount(count)
    setMerging(false)
  }

  const totalDuplicates = groups.reduce((acc, g) => acc + g.entries.length - 1, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-violet-600" />
            <h3 className="font-semibold text-slate-900">Purgar duplicados</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-slate-400 text-sm">Buscando duplicados...</div>
          ) : mergedCount !== null ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <CheckCircle2 size={36} className="text-green-500" />
              <p className="text-slate-700 font-medium text-sm">
                {mergedCount} entrada{mergedCount !== 1 ? 's' : ''} duplicada{mergedCount !== 1 ? 's' : ''} eliminada{mergedCount !== 1 ? 's' : ''}
              </p>
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <CheckCircle2 size={36} className="text-green-500" />
              <p className="text-slate-500 text-sm">No se encontraron duplicados</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Se encontraron <span className="font-semibold text-slate-700">{groups.length} grupo{groups.length !== 1 ? 's' : ''}</span> con {totalDuplicates} entrada{totalDuplicates !== 1 ? 's' : ''} duplicada{totalDuplicates !== 1 ? 's' : ''}.
                Selecciona cuál entrada conservar en cada grupo.
              </p>
              {groups.map(group => (
                <div key={group.key} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">"{group.key}"</p>
                  </div>
                  {group.entries.map(entry => (
                    <label
                      key={entry.id}
                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors ${group.canonicalId === entry.id ? 'bg-violet-50' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`group-${group.key}`}
                        checked={group.canonicalId === entry.id}
                        onChange={() => setCanonical(group.key, entry.id)}
                        className="accent-violet-600 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{entry.name}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {[entry.brand, entry.size].filter(Boolean).join(' · ') || '—'}
                        </p>
                      </div>
                      <span className={`text-xs font-medium shrink-0 px-2 py-0.5 rounded-full ${entry.productCount > 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        {entry.productCount} precio{entry.productCount !== 1 ? 's' : ''}
                      </span>
                      {group.canonicalId === entry.id && (
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold shrink-0">conservar</span>
                      )}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {mergedCount !== null ? (
          <div className="px-6 py-4 border-t border-slate-100 shrink-0">
            <button onClick={() => { onDone(); onClose(); }} className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-semibold text-white">
              Cerrar
            </button>
          </div>
        ) : groups.length > 0 && !loading && (
          <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
              Cancelar
            </button>
            <button
              onClick={handlePurge}
              disabled={merging}
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-xl text-sm font-semibold text-white"
            >
              {merging ? 'Purgando...' : `Purgar ${totalDuplicates} duplicado${totalDuplicates !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const PAGE_SIZE = 50

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [markets, setMarkets] = useState<Supermarket[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterMarket, setFilterMarket] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [timeline, setTimeline] = useState<Product | null>(null)
  const [purgeOpen, setPurgeOpen] = useState(false)

  const loadProducts = async (currentPage: number, currentSearch: string, currentMarket: string) => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1)

    if (currentMarket) query = query.eq('supermarket', currentMarket)
    if (currentSearch) query = query.or(`name.ilike.%${currentSearch}%,brand.ilike.%${currentSearch}%`)

    const { data, count } = await query
    setProducts(data ?? [])
    setTotal(count ?? 0)
    setLoading(false)
  }

  const loadMarkets = async () => {
    const { data } = await supabase.from('supermarkets').select('*').order('name')
    setMarkets(data ?? [])
  }

  useEffect(() => { loadMarkets() }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0)
      loadProducts(0, search, filterMarket)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, filterMarket])

  useEffect(() => {
    loadProducts(page, search, filterMarket)
  }, [page])

  const reload = () => loadProducts(page, search, filterMarket)

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const filtered = products

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500 mt-0.5">{total} producto{total !== 1 ? 's' : ''} en total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPurgeOpen(true)}
            className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Layers size={16} />
            Purgar duplicados
          </button>
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={16} />
            Nuevo producto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-64"
          />
        </div>
        <div className="relative">
          <select
            value={filterMarket}
            onChange={e => setFilterMarket(e.target.value)}
            className="pl-3 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">Todos los mercados</option>
            {markets.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-2/5" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
              <div className="h-5 bg-slate-100 rounded w-16" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Package size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No se encontraron productos</p>
          {(search || filterMarket) && <p className="text-xs mt-1">Prueba con otros filtros</p>}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Producto</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Mercado</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Tamaño</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Precio</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 bg-slate-100"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                          <Package size={16} className="text-slate-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900 leading-tight">{product.name}</p>
                        {product.brand && <p className="text-xs text-slate-400 mt-0.5">{product.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {product.supermarket}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs hidden sm:table-cell">{product.size || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-900">
                      {product.price.toFixed(2)} <span className="text-xs text-slate-400 font-normal">{product.currency}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setTimeline(product)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Ver historial de precios"
                      >
                        <TrendingUp size={14} />
                      </button>
                      <button
                        onClick={() => { setEditing(product); setModalOpen(true) }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleting(product)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-500">
            Página {page + 1} de {totalPages} · {total} resultados
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <ProductModal
          product={editing}
          markets={markets}
          defaultMarket={filterMarket}
          onClose={() => setModalOpen(false)}
          onSaved={reload}
        />
      )}

      {deleting && (
        <DeleteProductConfirm
          product={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={reload}
        />
      )}

      {timeline && (
        <PriceTimelineModal
          product={timeline}
          onClose={() => setTimeline(null)}
        />
      )}

      {purgeOpen && (
        <PurgeModal
          onClose={() => setPurgeOpen(false)}
          onDone={reload}
        />
      )}
    </div>
  )
}
