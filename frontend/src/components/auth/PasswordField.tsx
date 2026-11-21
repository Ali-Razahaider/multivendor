import { useState } from 'react';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import { PASSWORD_RULES } from '../../lib/api';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  showRules?: boolean;
  required?: boolean;
};

// Password input with a visibility toggle and optional live strength checklist.
const PasswordField = ({ id, label, value, onChange, autoComplete = 'current-password', showRules = false, required = true }: Props) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field pr-11"
          aria-describedby={showRules ? `${id}-rules` : undefined}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showRules && (
        <ul id={`${id}-rules`} className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-3">
          {PASSWORD_RULES.map((rule) => {
            const ok = rule.test(value);
            return (
              <li key={rule.label} className={`flex items-center gap-1 ${ok ? 'text-emerald-600' : 'text-slate-500'}`}>
                {ok ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PasswordField;
