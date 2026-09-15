import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inviteApi } from '../api/inviteApi';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Mail,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Home,
  Check,
} from 'lucide-react';

const AcceptInvitePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  // State variables
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [invitedUser, setInvitedUser] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submission states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [acceptedSuccess, setAcceptedSuccess] = useState(false);

  // Validate token on mount
  const checkToken = async () => {
    if (!token) {
      setValidating(false);
      setIsValid(false);
      setValidationError('Invitation token is missing from the URL.');
      return;
    }

    try {
      setValidating(true);
      setValidationError('');
      const res = await inviteApi.validateInvite(token);

      const isTokenValid = res.data?.valid || res.valid;
      const userData = res.data?.user || res.user;

      if (isTokenValid && userData) {
        setIsValid(true);
        setInvitedUser(userData);
      } else {
        setIsValid(false);
        setValidationError(
          res.message && res.message !== 'Invitation validation completed'
            ? res.message
            : 'This invitation link is invalid, expired, or has already been accepted.'
        );
      }
    } catch (err) {
      setIsValid(false);
      setValidationError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Unable to validate invitation. The token may be expired or invalid.'
      );
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    document.title = 'Accept Club Manager Invitation | 4 THE PEOPLE';
    checkToken();
  }, [token]);

  // Validation rules
  const hasMinLength = password.length >= 6;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = hasMinLength && passwordsMatch && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!hasMinLength) {
      setSubmitError('Password must be at least 6 characters long.');
      return;
    }

    if (!passwordsMatch) {
      setSubmitError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      await inviteApi.acceptInvite(token, password);
      setAcceptedSuccess(true);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to accept invitation. Please try again or ask your admin to resend your invite.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0F172A] font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Accent Glows matching Manager Theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF5733]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2563EB]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2 relative z-10">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FF5733] flex items-center justify-center text-white font-black shadow-md shadow-[#FF5733]/30 group-hover:scale-105 transition-transform">
            <span className="font-['Syne',sans-serif] text-xl font-black leading-none">4</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 font-['Syne',sans-serif] leading-tight">
              <span className="text-[10px] font-black tracking-widest text-[#FF5733] uppercase">THE</span>
              <span className="text-lg font-black tracking-tight text-[#0F172A]">
                PEOPLE<span className="text-[#FF5733]">.</span>
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
              Club Manager
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E0D5] text-[#0F172A] text-xs font-extrabold uppercase tracking-wider hover:bg-[#F0EEE6] transition-all shadow-xs"
        >
          <Home className="w-3.5 h-3.5 text-[#64748B]" />
          <span>Home</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-10 my-auto relative z-10 w-full max-w-md mx-auto">
        {/* 1. LOADING VALIDATION STATE */}
        {validating && (
          <div className="w-full bg-white border border-[#E2E0D5] rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center text-[#FF5733]">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="font-['Syne',sans-serif] text-2xl font-black text-[#0F172A] uppercase tracking-tight">
                Verifying <span className="text-[#FF5733]">Invitation...</span>
              </h2>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Checking link validity and security token. Please wait a moment.
              </p>
            </div>
          </div>
        )}

        {/* 2. INVALID OR EXPIRED TOKEN STATE */}
        {!validating && !isValid && (
          <div className="w-full bg-white border border-[#E2E0D5] rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider">
                Invalid or Expired Link
              </span>
              <h2 className="font-['Syne',sans-serif] text-2xl font-black text-[#0F172A] uppercase tracking-tight mt-1">
                Invitation <span className="text-rose-500">Unavailable</span>
              </h2>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed max-w-xs mx-auto">
                {validationError || 'This invitation link is invalid, has expired, or was already used.'}
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F5] border border-[#E2E0D5] rounded-2xl text-left space-y-2">
              <p className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                What should I do?
              </p>
              <p className="text-xs text-[#64748B] font-medium leading-normal">
                If you haven't set your password yet, contact your Yuuva administrator to issue a fresh invitation link.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => navigate('/login/manager')}
                className="w-full py-3.5 px-6 rounded-full bg-[#0F172A] text-white font-extrabold text-xs uppercase tracking-wider hover:bg-[#2563EB] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Go to Manager Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={checkToken}
                className="w-full py-3 px-6 rounded-full bg-[#FAF9F5] border border-[#E2E0D5] text-[#0F172A] font-extrabold text-xs uppercase tracking-wider hover:bg-[#F0EEE6] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Retry Validation</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. SUCCESS ACCEPTANCE STATE */}
        {!validating && isValid && acceptedSuccess && (
          <div className="w-full bg-white border border-[#E2E0D5] rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Account Registration Complete
              </span>
              <h2 className="font-['Syne',sans-serif] text-3xl font-black text-[#0F172A] uppercase tracking-tight mt-1">
                Welcome to <span className="text-[#FF5733]">4 THE PEOPLE!</span>
              </h2>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                Your password has been successfully set. You can now log in to manage your assigned clubs and events.
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F5] border border-[#E2E0D5] rounded-2xl text-left flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] font-black text-sm shrink-0 uppercase">
                {invitedUser?.name ? invitedUser.name.charAt(0) : 'M'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#0F172A] truncate">{invitedUser?.name || 'Club Manager'}</p>
                <p className="text-[11px] text-[#64748B] font-medium truncate">{invitedUser?.email}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/login/manager')}
              className="w-full py-4 px-6 rounded-full bg-[#FF5733] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF5733]/25 hover:bg-[#E64A26] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Proceed to Manager Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4. SET PASSWORD FORM STATE */}
        {!validating && isValid && !acceptedSuccess && (
          <div className="w-full bg-white border border-[#E2E0D5] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl space-y-6 relative overflow-hidden">
            {/* Header / Intro */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5733]/10 text-[#FF5733] text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Club Manager Invitation</span>
              </div>
              <h1 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-black text-[#0F172A] uppercase tracking-tight">
                Complete Your <span className="text-[#FF5733]">Registration</span>
              </h1>
              <p className="text-xs text-[#64748B] font-medium leading-relaxed max-w-sm mx-auto">
                You have been invited to join 4 THE PEOPLE as a Club Manager. Please create your password below to activate your account.
              </p>
            </div>

            {/* Invited User Card */}
            {invitedUser && (
              <div className="p-4 bg-[#FAF9F5] border border-[#E2E0D5] rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm uppercase">
                    {invitedUser.name ? invitedUser.name.charAt(0) : 'M'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#0F172A] truncate">{invitedUser.name}</p>
                    <p className="text-[11px] text-[#64748B] font-medium truncate">{invitedUser.email}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full shrink-0">
                  Manager
                </span>
              </div>
            )}

            {/* Inline Submission Error */}
            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-xs font-bold">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0F172A] mb-1.5">
                  Set Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-[#FAF9F5] border border-[#E2E0D5] focus:border-[#FF5733] focus:bg-white rounded-2xl text-xs text-[#0F172A] font-semibold placeholder-[#94A3B8] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#0F172A] mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-[#FAF9F5] border border-[#E2E0D5] focus:border-[#FF5733] focus:bg-white rounded-2xl text-xs text-[#0F172A] font-semibold placeholder-[#94A3B8] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-3 bg-[#FAF9F5] border border-[#E2E0D5] rounded-2xl space-y-1.5 text-[11px]">
                <div className={`flex items-center gap-2 font-bold ${hasMinLength ? 'text-emerald-600' : 'text-[#64748B]'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-emerald-100 text-emerald-600' : 'bg-[#E2E0D5] text-white'}`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Minimum 6 characters long</span>
                </div>

                <div className={`flex items-center gap-2 font-bold ${passwordsMatch ? 'text-emerald-600' : 'text-[#64748B]'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${passwordsMatch ? 'bg-emerald-100 text-emerald-600' : 'bg-[#E2E0D5] text-white'}`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Passwords match</span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-4 px-6 rounded-full bg-[#FF5733] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF5733]/25 hover:bg-[#E64A26] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Accept Invitation & Set Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto py-4 text-center text-xs font-semibold text-[#64748B] relative z-10">
        <p>© {new Date().getFullYear()} Yuuva Club Event Manager. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AcceptInvitePage;
