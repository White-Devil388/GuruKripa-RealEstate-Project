import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const Toast = () => {
  const { toast } = useLead();

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 shrink-0" />;
      default:
        return <AlertCircle className="w-5 h-5 text-accent shrink-0" />;
    }
  };

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-24 right-6 z-50 max-w-md pointer-events-auto"
        >
          <div className="bg-surface border border-accent/30 text-ink px-5 py-4 shadow-xl flex items-start gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent" />
            {getIcon()}
            <div className="text-sm font-medium leading-snug">{toast.message}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

