import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2, RefreshCw, Mail, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DeleteOtpModal = ({
  isOpen,
  onClose,
  onRequestCode,
  onConfirm,
  onConfirmDelete,
  title = 'Confirm Deletion',
  itemName = '',
  warningText = 'This action cannot be undone.',
  confirmText = 'Confirm Delete',
  onSuccess,
}) => {
  const [stage, setStage] = useState('requesting'); // 'requesting' | 'code' | 'blocked'
  const [code, setCode] = useState('');
  const [blockedError, setBlockedError] = useState('');
  const [inlineError, setInlineError] = useState('');
  const [notice, setNotice] = useState('');
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setBlockedError('');
      setInlineError('');
      setNotice('');
      requestCode();
    } else {
      setStage('requesting');
    }
  }, [isOpen]);

  const requestCode = async () => {
    setIsRequestingCode(true);
    setBlockedError('');
    setInlineError('');

    try {
      await onRequestCode();
      setStage('code');
      setNotice('A verification code has been sent to your email.');
    } catch (err) {
      console.error('Request deletion code error:', err);
      const status = err.response?.status;
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to request deletion verification code.';

      if (status === 403 || status === 409) {
        setBlockedError(message);
        setStage('blocked');
      } else {
        setBlockedError(message);
        setStage('blocked');
      }
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleResendCode = async () => {
    setIsRequestingCode(true);
    setInlineError('');
    setNotice('');
    try {
      await onRequestCode();
      setNotice('A new verification code has been sent to your email.');
    } catch (err) {
      setInlineError(err.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || isDeleting) return;

    setIsDeleting(true);
    setInlineError('');

    try {
      const confirmFn = onConfirm || onConfirmDelete;
      if (confirmFn) {
        await confirmFn(code.trim());
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Delete confirmation error:', err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Invalid or expired verification code.';
      setInlineError(message);
    } finally {
      setIsDeleting(false);
    }
  };

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
          onClick={isDeleting || isRequestingCode ? undefined : onClose}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          className="relative w-full max-w-md bg-white border border-[#E7E5E4] rounded-lg shadow-lg overflow-hidden z-10 p-6 sm:p-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={isDeleting || isRequestingCode}
            className="absolute top-5 right-5 text-[#8E8B85] hover:text-[#1C1B1F] transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>

          {/* STAGE 1: Requesting / Sending Code Loading State */}
          {stage === 'requesting' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded bg-[#FAF9F7] border border-[#E7E5E4] text-[#B08D57] flex items-center justify-center mx-auto">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#1C1B1F] font-serif">Sending Verification Code</h3>
                <p className="text-xs text-[#6B6966] mt-1">
                  Requesting authorization code for {itemName || 'this item'}...
                </p>
              </div>
            </div>
          )}

          {/* STAGE 1 BLOCKED / ERROR STATE */}
          {stage === 'blocked' && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FDF2F2] border border-[#F3CECE] rounded text-[#8B3A3A] shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1C1B1F] font-serif">Deletion Blocked</h3>
                  <p className="text-xs text-[#6B6966]">Action cannot be completed</p>
                </div>
              </div>

              <div className="p-4 bg-[#FDF2F2] border border-[#F3CECE] rounded text-[#8B3A3A] text-xs leading-relaxed">
                {blockedError}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 px-4 bg-[#F2F0EC] hover:bg-[#E7E5E4] text-[#38373A] font-medium text-xs rounded border border-[#E7E5E4] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: Code Input Form */}
          {stage === 'code' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 bg-[#FDF2F2] border border-[#F3CECE] rounded text-[#8B3A3A] shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#1C1B1F] font-serif leading-tight">{title}</h3>
                  {itemName && <p className="text-xs text-[#8B3A3A] font-medium mt-0.5">{itemName}</p>}
                </div>
              </div>

              {/* Success / Notice Banner */}
              {notice && (
                <div className="p-3 bg-[#EBF3ED] border border-[#D1E3D7] rounded flex items-center gap-2 text-[#2E5A44] text-xs font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E5A44]" />
                  <span>{notice}</span>
                </div>
              )}

              {/* Inline Error Banner */}
              {inlineError && (
                <div className="p-3 bg-[#FDF2F2] border border-[#F3CECE] rounded flex items-center justify-between text-[#8B3A3A] text-xs">
                  <span>{inlineError}</span>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isRequestingCode}
                    className="underline font-semibold text-[#8B3A3A] hover:text-[#722F2F] transition shrink-0 ml-2"
                  >
                    Resend
                  </button>
                </div>
              )}

              <p className="text-xs text-[#6B6966] leading-relaxed">{warningText}</p>

              {/* 6-Digit OTP Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-[#6B6966]">
                    Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isRequestingCode || isDeleting}
                    className="text-xs text-[#B08D57] hover:text-[#997847] font-medium transition inline-flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRequestingCode ? 'animate-spin' : ''}`} />
                    <span>Resend Code</span>
                  </button>
                </div>

                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B85]" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#D8D7DC] focus:border-[#B08D57] rounded text-[#1C1B1F] font-mono text-base tracking-[0.2em] text-center placeholder:tracking-normal placeholder:font-sans placeholder:text-[#A8A5A0] focus:outline-none transition-colors"
                    required
                    disabled={isDeleting}
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-[#8E8B85]">
                  Code expires in 10 minutes. Check your admin email inbox.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="flex-1 py-2 px-4 bg-[#F2F0EC] hover:bg-[#E7E5E4] text-[#38373A] font-medium text-xs rounded border border-[#E7E5E4] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={code.trim().length < 6 || isDeleting || isRequestingCode}
                  className="flex-1 py-2 px-4 bg-[#8B3A3A] hover:bg-[#722F2F] text-white font-medium text-xs rounded transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>{confirmText}</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DeleteOtpModal;

