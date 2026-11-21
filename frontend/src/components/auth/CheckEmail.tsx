import { MailCheck } from 'lucide-react';

// Confirmation shown after sign-up / password reset requests.
const CheckEmail = ({ email, message, onReset }: { email?: string; message: string; onReset?: () => void }) => (
  <div className="text-center" role="status">
    <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
      <MailCheck size={28} aria-hidden="true" />
    </span>
    <h2 className="mt-4 text-xl font-bold text-slate-900">Check your inbox</h2>
    <p className="mt-2 text-sm text-slate-600">{message}</p>
    {email && <p className="mt-1 text-sm font-medium text-slate-800">{email}</p>}
    <p className="mt-4 text-xs text-slate-500">The link expires in 30 minutes. Don’t see it? Check your spam folder.</p>
    {onReset && (
      <button type="button" onClick={onReset} className="btn-secondary mt-6 w-full">Use a different email</button>
    )}
  </div>
);

export default CheckEmail;
