import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface ComboboxOption {
  value: string
  label?: string
  sublabel?: string
}

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (option: ComboboxOption) => void
  options: ComboboxOption[]
  placeholder?: string
  required?: boolean
  className?: string
}

export default function Combobox({
  value,
  onChange,
  onSelect,
  options,
  placeholder,
  required,
  className = '',
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setInputValue(value) }, [value])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = inputValue
    ? options.filter(o =>
        o.label
          ? o.label.toLowerCase().includes(inputValue.toLowerCase())
          : o.value.toLowerCase().includes(inputValue.toLowerCase())
      )
    : options

  const handleInput = (v: string) => {
    setInputValue(v)
    onChange(v)
    setOpen(true)
  }

  const handleSelect = (option: ComboboxOption) => {
    setInputValue(option.label ?? option.value)
    onChange(option.label ?? option.value)
    onSelect?.(option)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={e => handleInput(e.target.value)}
          onFocus={() => setOpen(true)}
          required={required}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 pr-8 border border-grafito/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-verde"
        />
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          tabIndex={-1}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-grafito/50 hover:text-grafito/70"
        >
          <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-crema border border-grafito/10 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {filtered.map((option, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); handleSelect(option) }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-verde/10 text-left"
              >
                <div>
                  <span className="text-grafito font-medium">{option.label ?? option.value}</span>
                  {option.sublabel && (
                    <span className="text-grafito/50 ml-2 text-xs">{option.sublabel}</span>
                  )}
                </div>
                {(option.label ?? option.value) === value && (
                  <Check size={14} className="text-verde shrink-0" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
