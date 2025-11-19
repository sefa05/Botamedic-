const colors: Record<string, string> = {
  new: 'bg-slate-200 text-slate-800',
  preparing: 'bg-yellow-100 text-yellow-800',
  on_the_way: 'bg-blue-100 text-blue-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-rose-100 text-rose-800'
};

export function OrderStatusBadge({ status }: { status: keyof typeof colors }) {
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status]}`}>{status}</span>;
}
