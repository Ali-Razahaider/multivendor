import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type Props = { eyebrow?: string; title: string; subtitle?: string; link?: { to: string; label: string }; id?: string };

const SectionHeader = ({ eyebrow, title, subtitle, link, id }: Props) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
    <div>
      {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{eyebrow}</p>}
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {subtitle && <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">{subtitle}</p>}
    </div>
    {link && (
      <Link to={link.to} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-600">
        {link.label}
        <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    )}
  </div>
);

export default SectionHeader;
