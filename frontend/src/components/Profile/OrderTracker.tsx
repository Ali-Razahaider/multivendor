import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Check, CircleX, RotateCcw } from 'lucide-react';
import server from '../../server';
import { apiError } from '../../lib/api';
import { FULFILMENT_STEPS, isRefundStatus } from './orderUtils';

/** Loads one of the signed-in shopper's orders. */
export const useOrder = (id?: string) => {
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}order/user-order/${id}`);
      setOrder(data.order);
      setError('');
    } catch (err) {
      setError(apiError(err, 'We couldn’t load this order.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { order, error, loading, reload, setOrder };
};

// Vertical (mobile) / horizontal (desktop) progress tracker for an order.
const OrderTracker = ({ status }: { status?: string }) => {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700">
        <CircleX className="text-slate-500" /> This order was cancelled. Any card payment has been refunded.
      </div>
    );
  }

  const refund = isRefundStatus(status);
  const current = refund ? FULFILMENT_STEPS.length - 1 : Math.max(0, FULFILMENT_STEPS.indexOf(status || 'Processing'));

  return (
    <div className="space-y-4">
      <ol className="flex flex-col gap-4 sm:flex-row sm:gap-0">
        {FULFILMENT_STEPS.map((step, i) => {
          const done = i <= current;
          return (
            <li key={step} className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:text-center" aria-current={i === current ? 'step' : undefined}>
              <div className="flex items-center sm:w-full">
                <span className={`hidden h-0.5 flex-1 sm:block ${i === 0 ? 'invisible' : done ? 'bg-brand-600' : 'bg-slate-200'}`} />
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${done ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'} ${i === current && !refund ? 'ring-4 ring-brand-100' : ''}`}>
                  {done ? <Check size={15} /> : i + 1}
                </span>
                <span className={`hidden h-0.5 flex-1 sm:block ${i === FULFILMENT_STEPS.length - 1 ? 'invisible' : i < current ? 'bg-brand-600' : 'bg-slate-200'}`} />
              </div>
              <span className={`text-sm sm:mt-2 sm:px-1 sm:text-xs ${done ? 'font-semibold text-slate-900' : 'text-slate-400'}`}>{step}</span>
            </li>
          );
        })}
      </ol>
      {refund && (
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          <RotateCcw size={18} />
          {status?.toLowerCase() === 'processing refund'
            ? 'Your refund request is with the seller.'
            : status === 'Refund Success'
              ? 'Your refund has been approved. Card refunds take 5–10 business days to appear.'
              : 'The seller declined this refund request. Message them from your inbox if you have questions.'}
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
