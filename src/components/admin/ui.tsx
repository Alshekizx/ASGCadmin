import { useState } from 'react';

// Shared UI primitives for the admin interface

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{title}</h2>
        {subtitle && <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = '', style = {}, onClick }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div
      className={`bg-white rounded-xl border ${className}`}
      style={{ borderColor: '#e2e4e9', ...style }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? e => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, color = '#c9a84c', trend }: { label: string; value: string | number; icon: React.ReactNode; color?: string; trend?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm" style={{ color: '#6b7280' }}>{label}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: '#0a1628', fontFamily: 'var(--font-display)' }}>{value}</p>
          {trend && <p className="text-xs mt-1" style={{ color: '#16a34a' }}>{trend}</p>}
        </div>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}18`, color }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function Btn({ children, variant = 'primary', onClick, type = 'button', size = 'md', disabled, icon, className = '' }: {
  children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'; onClick?: () => void;
  type?: 'button' | 'submit'; size?: 'sm' | 'md'; disabled?: boolean; icon?: React.ReactNode; className?: string;
}) {
  const base = 'inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
  const variants = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'border bg-transparent',
    ghost: 'bg-transparent',
    danger: 'text-white',
  };
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg, #0a1628, #132040)', color: '#fff' },
    secondary: { background: 'linear-gradient(135deg, #c9a84c, #b8962f)', color: '#fff' },
    outline: { borderColor: '#0a1628', color: '#0a1628' },
    ghost: { color: '#6b7280' },
    danger: { background: '#dc2626', color: '#fff' },
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} style={styles[variant]}>
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
}

export function Badge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'muted' }) {
  const styles: Record<string, React.CSSProperties> = {
    default: { background: '#f0f2f5', color: '#374151' },
    success: { background: '#f0fdf4', color: '#16a34a' },
    warning: { background: '#fffbeb', color: '#d97706' },
    danger: { background: '#fef2f2', color: '#dc2626' },
    gold: { background: '#fffbeb', color: '#b8962f', border: '1px solid #c9a84c44' },
    muted: { background: '#f0f2f5', color: '#9ca3af' },
  };
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium" style={styles[variant]}>
      {label}
    </span>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9ca3af' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="pl-9 pr-4 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none', background: '#f9fafb', minWidth: 220 }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} />
    </div>
  );
}

export function Table({ columns, rows, emptyMessage = 'No records found.' }: {
  columns: { key: string; label: string; width?: string }[];
  rows: Record<string, React.ReactNode>[];
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e2e4e9' }}>
            {columns.map(col => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold" style={{ color: '#374151', width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-sm" style={{ color: '#9ca3af' }}>{emptyMessage}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: '#f0f2f5' }}>
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3" style={{ color: '#374151' }}>{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#e2e4e9' }}>
          <h3 className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{ color: '#6b7280' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-6 py-4 border-t" style={{ borderColor: '#e2e4e9' }}>{footer}</div>}
      </div>
    </div>
  );
}

export function FormField({ label, required, hint, children, error }: { label: string; required?: boolean; hint?: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium" style={{ color: '#374151' }}>
        {label}{required && <span className="ml-0.5" style={{ color: '#dc2626' }}>*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs" style={{ color: '#9ca3af' }}>{hint}</p>}
      {error && <p className="text-xs" style={{ color: '#dc2626' }}>{error}</p>}
    </div>
  );
}

export function Input({ placeholder, value, defaultValue, onChange, type = 'text', disabled }: { placeholder?: string; value?: string; defaultValue?: string; onChange?: (v: string) => void; type?: string; disabled?: boolean }) {
  return (
    <input
      type={type}
      defaultValue={defaultValue}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 text-sm rounded-lg border"
      style={{ borderColor: '#e2e4e9', outline: 'none', background: disabled ? '#f9fafb' : '#fff', color: '#374151' }}
      onFocus={e => { if (!disabled) e.target.style.borderColor = '#c9a84c'; }}
      onBlur={e => (e.target.style.borderColor = '#e2e4e9')}
    />
  );
}

export function Textarea({ placeholder, value, defaultValue, onChange, rows = 3 }: { placeholder?: string; value?: string; defaultValue?: string; onChange?: (v: string) => void; rows?: number }) {
  return (
    <textarea
      defaultValue={defaultValue}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 text-sm rounded-lg border resize-none"
      style={{ borderColor: '#e2e4e9', outline: 'none', color: '#374151' }}
      onFocus={e => (e.target.style.borderColor = '#c9a84c')}
      onBlur={e => (e.target.style.borderColor = '#e2e4e9')}
    />
  );
}

export function Select({ value, onChange, options, placeholder }: { value?: string; onChange?: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select
      value={value}
      onChange={e => onChange?.(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border"
      style={{ borderColor: '#e2e4e9', outline: 'none', color: '#374151', background: '#fff' }}
      onFocus={e => (e.target.style.borderColor = '#c9a84c')}
      onBlur={e => (e.target.style.borderColor = '#e2e4e9')}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function UploadBox({ label = 'Click to upload or drag and drop', accept = '*', hint }: { label?: string; accept?: string; hint?: string }) {
  const [dragging, setDragging] = useState(false);
  return (
    <div
      className="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"
      style={{ borderColor: dragging ? '#c9a84c' : '#e2e4e9', background: dragging ? '#fffbeb' : '#f9fafb' }}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={() => setDragging(false)}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#f0f2f5' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      </div>
      <p className="text-sm font-medium" style={{ color: '#374151' }}>{label}</p>
      {hint && <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{hint}</p>}
      <input type="file" accept={accept} className="hidden" />
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#f0f2f5' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} className="flex-1 px-4 py-2 text-sm rounded-md font-medium transition-all duration-150"
          style={{ background: active === t ? '#fff' : 'transparent', color: active === t ? '#0a1628' : '#6b7280', boxShadow: active === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
          {t}
        </button>
      ))}
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose?: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: type === 'success' ? '#0a1628' : '#dc2626', color: '#fff', minWidth: 280 }}>
      {type === 'success'
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      }
      <span className="text-sm flex-1">{message}</span>
      {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>}
    </div>
  );
}

export function Pagination({ page, total, perPage = 10, onChange }: { page: number; total: number; perPage?: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-xs" style={{ color: '#6b7280' }}>Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}</p>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="w-8 h-8 rounded-lg border flex items-center justify-center text-xs disabled:opacity-40" style={{ borderColor: '#e2e4e9', color: '#374151' }}>‹</button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium" style={{ background: p === page ? '#0a1628' : 'transparent', color: p === page ? '#fff' : '#374151', border: p === page ? 'none' : '1px solid #e2e4e9' }}>{p}</button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === pages} className="w-8 h-8 rounded-lg border flex items-center justify-center text-xs disabled:opacity-40" style={{ borderColor: '#e2e4e9', color: '#374151' }}>›</button>
      </div>
    </div>
  );
}
