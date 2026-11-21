import axios from 'axios';

/** Best human-readable message from an axios/fetch error. */
export const apiError = (err: unknown, fallback = 'Something went wrong. Please try again.') => {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Can’t reach the server. Check your connection and try again.';
    return (err.response.data as { message?: string })?.message || fallback;
  }
  return (err as Error)?.message || fallback;
};

export const PASSWORD_RULES = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[a-zA-Z]/.test(p), label: 'A letter' },
  { test: (p: string) => /\d/.test(p), label: 'A number' },
];

export const passwordIsStrong = (p: string) => PASSWORD_RULES.every((r) => r.test(p));
