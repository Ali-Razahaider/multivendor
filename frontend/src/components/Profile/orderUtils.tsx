export const FULFILMENT_STEPS = ['Processing', 'Transferred to delivery partner', 'Shipping', 'Received', 'On the way', 'Delivered'];
export const REFUND_STATUSES = ['Processing refund', 'Refund Success', 'Refund Rejected'];

export const isRefundStatus = (status?: string) => REFUND_STATUSES.some((s) => s.toLowerCase() === (status || '').toLowerCase());

const TONES: Record<string, string> = {
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
  'Processing refund': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Refund Success': 'bg-sky-50 text-sky-700 ring-sky-200',
  'Refund Rejected': 'bg-rose-50 text-rose-700 ring-rose-200',
};

export const StatusBadge = ({ status }: { status?: string }) => (
  <span className={`badge ring-1 ${TONES[status || ''] || 'bg-brand-50 text-brand-700 ring-brand-200'}`}>{status || 'Processing'}</span>
);

export const shortId = (id: string) => `#${String(id).slice(-8).toUpperCase()}`;

export const orderDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

export const itemCount = (order: any) => (order.cart || []).reduce((n: number, i: any) => n + (i.qty || 1), 0);

export const itemImage = (item: any) => item.image || item.images?.[0]?.url || item.images?.[0];

export const paymentLabel = (order: any) => {
  const type = order.paymentInfo?.type || 'Unknown';
  const status = order.paymentInfo?.status;
  const statusText = status === 'succeeded' ? 'Paid' : status === 'refunded' ? 'Refunded' : status === 'pending' ? 'Due on delivery' : status || '';
  return statusText ? `${type} · ${statusText}` : type;
};

