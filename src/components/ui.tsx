import React from 'react';

// --- Badge ---
export function Badge({ label, variant = 'default' }: { label: string; variant?: 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'info' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    gold: 'bg-amber-50 text-amber-800 border border-amber-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}>
      {label}
    </span>
  );
}

// --- Button ---
export function Button({
  children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', type = 'button', icon
}: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg'; disabled?: boolean; className?: string; type?: 'button' | 'submit'; icon?: React.ReactNode;
}) {
  const base = 'inline-flex items-center gap-2 font-medium rounded transition-all duration-150 cursor-pointer';
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  const variants = {
    primary: 'bg-[#0B1F3A] text-white hover:bg-[#122845] active:bg-[#0a1a30]',
    secondary: 'bg-[#C9A84C] text-white hover:bg-[#A8872C] active:bg-[#8f721f]',
    outline: 'border border-[#0B1F3A] text-[#0B1F3A] hover:bg-gray-50',
    ghost: 'text-[#0B1F3A] hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

// --- Input ---
export function Input({ label, type = 'text', value, onChange, placeholder, required, error, helper, id }: {
  label?: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; error?: string; helper?: string; id?: string;
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-[#0B1F3A]">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`border rounded px-3 py-2 text-sm text-[#0B1F3A] bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition ${error ? 'border-red-400' : 'border-gray-300'}`}
      />
      {helper && !error && <p className="text-xs text-gray-500">{helper}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// --- Textarea ---
export function Textarea({ label, value, onChange, placeholder, rows = 4, required, helper }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; required?: boolean; helper?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[#0B1F3A]">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="border border-gray-300 rounded px-3 py-2 text-sm text-[#0B1F3A] bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent resize-y"
      />
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </div>
  );
}

// --- Select ---
export function Select({ label, value, onChange, options, required }: {
  label?: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[#0B1F3A]">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 text-sm text-[#0B1F3A] bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// --- Card ---
export function Card({ children, className = '', padding = true }: { children: React.ReactNode; className?: string; padding?: boolean }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

// --- Stat Card ---
export function StatCard({ label, value, sub, color = 'navy' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color === 'gold' ? 'text-[#C9A84C]' : 'text-[#0B1F3A]'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Card>
  );
}

// --- Modal ---
export function Modal({ title, children, onClose, actions }: {
  title: string; children: React.ReactNode; onClose: () => void;
  actions?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-[#0B1F3A]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {actions && <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-200">{actions}</div>}
      </div>
    </div>
  );
}

// --- Alert ---
export function Alert({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error' | 'warning'; onClose?: () => void }) {
  const styles = {
    success: 'bg-green-50 border-green-300 text-green-800',
    error: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
  };
  const icons = { success: '✓', error: '✕', warning: '!' };
  return (
    <div className={`flex items-start gap-3 border rounded-lg px-4 py-3 ${styles[type]}`}>
      <span className="font-bold">{icons[type]}</span>
      <p className="text-sm flex-1">{message}</p>
      {onClose && <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">&times;</button>}
    </div>
  );
}

// --- Table ---
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`${onClick ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-gray-700 ${className}`}>{children}</td>;
}

// --- Search ---
export function SearchBar({ value, onChange, placeholder = 'Search...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm bg-white w-64 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
      />
    </div>
  );
}

// --- Breadcrumb ---
export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-gray-300">/</span>}
          <span className={i === items.length - 1 ? 'text-[#0B1F3A] font-medium' : ''}>{item}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}

// --- Page Header ---
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F3A] font-serif">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// --- Upload Area ---
export function UploadArea({ label, accept, helper, onClick }: { label: string; accept?: string; helper?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#C9A84C] hover:bg-amber-50 transition-colors group"
    >
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📁</div>
      <p className="text-sm font-medium text-[#0B1F3A]">{label}</p>
      {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
      {accept && <p className="text-xs text-gray-400">{accept}</p>}
    </div>
  );
}

// --- Tabs ---
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
            active === tab
              ? 'border-[#C9A84C] text-[#0B1F3A]'
              : 'border-transparent text-gray-500 hover:text-[#0B1F3A]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// --- Status indicator ---
export function StatusDot({ status }: { status: 'published' | 'draft' | 'archived' | 'active' | 'inactive' | 'upcoming' | 'past' | 'completed' | 'ongoing' }) {
  const map: Record<string, string> = {
    published: 'bg-green-500',
    active: 'bg-green-500',
    upcoming: 'bg-blue-500',
    ongoing: 'bg-amber-500',
    draft: 'bg-gray-400',
    inactive: 'bg-gray-400',
    archived: 'bg-gray-300',
    past: 'bg-gray-400',
    completed: 'bg-purple-500',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[status] ?? 'bg-gray-400'}`} />;
}

// --- Pagination ---
export function Pagination({ page, total, perPage, onChange }: { page: number; total: number; perPage: number; onChange: (p: number) => void }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500">
      <span>Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}</span>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40">‹</button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} className={`px-2.5 py-1 rounded ${p === page ? 'bg-[#0B1F3A] text-white' : 'hover:bg-gray-100'}`}>{p}</button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === pages} className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-40">›</button>
      </div>
    </div>
  );
}

// --- Toggle ---
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#C9A84C]' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}

// --- Empty State ---
export function EmptyState({ icon, title, message, action }: { icon?: string; title: string; message?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-4xl mb-3 opacity-40">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-600">{title}</h3>
      {message && <p className="text-sm text-gray-400 mt-1 max-w-xs">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// --- Confirmation Dialog ---
export function ConfirmDialog({ title, message, onConfirm, onCancel, danger }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  return (
    <Modal title={title} onClose={onCancel} actions={
      <>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>Confirm</Button>
      </>
    }>
      <p className="text-sm text-gray-600">{message}</p>
    </Modal>
  );
}
