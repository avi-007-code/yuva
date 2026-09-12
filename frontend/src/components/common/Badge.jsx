import React from 'react';

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    manager: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    member: 'bg-slate-500/10 text-slate-400 border-slate-700',
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    default: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
