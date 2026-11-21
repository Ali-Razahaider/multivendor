import { useEffect, useState } from 'react';

type Props = {
  targetDate: string;
};

const timeLeftUntil = (targetDate: string) => {
  const difference = +new Date(targetDate) - Date.now();
  if (!(difference > 0)) return null;
  return {
    Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    Mins: Math.floor((difference / (1000 * 60)) % 60),
    Secs: Math.floor((difference / 1000) % 60),
  };
};

function Countdown({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => timeLeftUntil(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(timeLeftUntil(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <p className="font-semibold text-rose-600">This offer has ended.</p>;
  }

  return (
    <div className="flex gap-2" role="timer" aria-label="Time left on this offer">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="min-w-[64px] rounded-xl bg-slate-900 px-3 py-2 text-center text-white">
          <div className="text-xl font-bold tabular-nums">{String(value).padStart(2, '0')}</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default Countdown;
