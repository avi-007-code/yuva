import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, trend }) => {
  return (
    <div className="bg-white border border-[#E7E5E4] p-6 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] font-sans">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium text-[#6B6966]">{title}</span>
        {Icon && (
          <div className="p-2 rounded bg-[#F9F8F6] border border-[#E7E5E4] text-[#6B6966]">
            <Icon className="w-4 h-4 stroke-[1.75]" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-serif text-3xl sm:text-4xl font-normal text-[#B08D57] tracking-tight">{value}</span>
        {trend && <span className="text-xs font-medium text-[#2E5A44]">{trend}</span>}
      </div>
      {description && <p className="mt-1 text-xs text-[#8E8B85]">{description}</p>}
    </div>
  );
};

export default StatCard;

