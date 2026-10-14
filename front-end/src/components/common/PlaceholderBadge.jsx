import React from 'react';
import { AlertTriangle, Lock, FileText, Info } from 'lucide-react';

const PlaceholderBadge = ({ text = '[To Be Confirmed]', size = 'normal' }) => {
  const getIcon = () => {
    if (text.includes('RERA') || text.includes('Legal')) return <Lock className="w-3 h-3 text-[#e67e22]" />;
    if (text.includes('Asset') || text.includes('Data')) return <AlertTriangle className="w-3 h-3 text-[#e67e22]" />;
    return <Info className="w-3 h-3 text-[#e67e22]" />;
  };

  const isSmall = size === 'small';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 bg-[#e67e22]/10 border border-dashed border-[#e67e22]/60 text-[#e67e22] rounded font-medium ${
        isSmall ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
      title="Official Specification Placeholder"
    >
      {getIcon()}
      <span>{text}</span>
    </span>
  );
};

export default PlaceholderBadge;
