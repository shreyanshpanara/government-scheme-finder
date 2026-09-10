import React from 'react';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

export default function EligibilityBadge({ status, score, size = 'md' }) {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = HelpCircle;
  let text = 'Checking...';

  if (status === 'ELIGIBLE') {
    badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    Icon = CheckCircle2;
    text = 'Eligible';
  } else if (status === 'LIKELY_ELIGIBLE') {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
    Icon = HelpCircle;
    text = 'Likely Eligible';
  } else if (status === 'INELIGIBLE') {
    badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';
    Icon = XCircle;
    text = 'Not Eligible';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${badgeStyle} ${padding}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>{text}</span>
      {score !== undefined && score !== null && (
        <span className="font-bold opacity-85">({score}%)</span>
      )}
    </span>
  );
}
