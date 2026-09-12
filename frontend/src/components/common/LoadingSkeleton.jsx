import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 w-1/3 bg-slate-800 rounded-md"></div>
      <div className="h-5 w-16 bg-slate-800 rounded-full"></div>
    </div>
    <div className="h-4 w-3/4 bg-slate-800 rounded-md mb-3"></div>
    <div className="h-4 w-1/2 bg-slate-800 rounded-md mb-6"></div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
      <div className="h-4 w-24 bg-slate-800 rounded-md"></div>
      <div className="h-8 w-24 bg-slate-800 rounded-lg"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-slate-800/60">
    <td className="py-4 px-6">
      <div className="h-4 w-32 bg-slate-800 rounded"></div>
    </td>
    <td className="py-4 px-6">
      <div className="h-4 w-48 bg-slate-800 rounded"></div>
    </td>
    <td className="py-4 px-6">
      <div className="h-5 w-20 bg-slate-800 rounded-full"></div>
    </td>
    <td className="py-4 px-6">
      <div className="h-4 w-24 bg-slate-800 rounded"></div>
    </td>
    <td className="py-4 px-6">
      <div className="h-5 w-20 bg-slate-800 rounded-full"></div>
    </td>
    <td className="py-4 px-6 text-right">
      <div className="h-8 w-24 bg-slate-800 rounded-lg ml-auto"></div>
    </td>
  </tr>
);
