import { Check } from 'lucide-react';

const STEPS = ['Shipping', 'Payment', 'Done'];

const CheckoutSteps = ({ active }: { active: number }) => (
  <ol className="mx-auto flex w-full max-w-md items-center" aria-label="Checkout progress">
    {STEPS.map((label, i) => {
      const step = i + 1;
      const done = step < active;
      const current = step === active;
      return (
        <li key={label} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`} aria-current={current ? 'step' : undefined}>
          <span className="flex items-center gap-2">
            <span
              className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${
                done ? 'bg-brand-600 text-white' : current ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {done ? <Check size={16} /> : step}
            </span>
            <span className={`text-sm font-semibold ${current || done ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
          </span>
          {i < STEPS.length - 1 && <span className={`mx-3 h-0.5 flex-1 rounded ${done ? 'bg-brand-600' : 'bg-slate-200'}`} />}
        </li>
      );
    })}
  </ol>
);

export default CheckoutSteps;
