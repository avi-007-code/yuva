import React from 'react';

export const EventCardSkeleton = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      <div className="w-full h-48 bg-slate-800/80" />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800 rounded w-1/4" />
        </div>
        <div className="h-6 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-2/3" />
        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
          <div className="h-4 bg-slate-800 rounded w-1/4" />
          <div className="h-8 bg-slate-800 rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
};

export const ClubCardSkeleton = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-lg animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-slate-800 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-800 rounded w-2/3" />
          <div className="h-4 bg-slate-800 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-800 rounded w-full" />
        <div className="h-4 bg-slate-800 rounded w-4/5" />
      </div>
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="h-4 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800 rounded w-1/4" />
      </div>
    </div>
  );
};

export const CardSkeleton = ClubCardSkeleton;
export default ClubCardSkeleton;
