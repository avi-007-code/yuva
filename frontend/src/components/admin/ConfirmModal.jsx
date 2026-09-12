import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#1C1B1F]/50 backdrop-blur-xs"
          onClick={isLoading ? undefined : onClose}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          className="relative w-full max-w-md bg-white border border-[#E7E5E4] rounded-lg shadow-lg overflow-hidden z-10"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded border ${
                    isDestructive
                      ? 'bg-[#FDF2F2] border-[#F3CECE] text-[#8B3A3A]'
                      : 'bg-[#FAF4E8] border-[#EEDFA8] text-[#8A6421]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 stroke-[1.75]" />
                </div>
                <h3 className="text-base font-semibold text-[#1C1B1F] font-serif">{title}</h3>
              </div>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="text-[#8E8B85] hover:text-[#1C1B1F] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-3 text-sm text-[#6B6966] leading-relaxed">{message}</p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 bg-[#F2F0EC] hover:bg-[#E7E5E4] text-[#38373A] text-xs font-medium rounded border border-[#E7E5E4] transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-white text-xs font-medium rounded transition-colors flex items-center gap-2 disabled:opacity-50 ${
                  isDestructive
                    ? 'bg-[#8B3A3A] hover:bg-[#722F2F]'
                    : 'bg-[#B08D57] hover:bg-[#997847]'
                }`}
              >
                {isLoading && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;

