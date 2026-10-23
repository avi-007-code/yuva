import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { adminApi } from '../api/adminApi';
import { managerApi } from '../api/managerApi';
import { ShieldCheck, UserCheck, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, Home, Sun, Moon } from 'lucide-react';

const Login = ({ role: propsRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const effectiveRole = propsRole || (location.pathname.includes('admin') ? 'admin' : 'manager');
  const isAdmin = effectiveRole === 'admin';

  React.useEffect(() => {
    document.title = `${isAdmin ? 'Admin Login' : 'Manager Login'} | 4 THE PEOPLE`;
  }, [isAdmin]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const res = isAdmin
        ? await adminApi.login(email, password)
        : await managerApi.login(email, password);

      const token = res?.token || res?.data?.token;
      const userObj = res?.user || res?.data?.user;

      if (token) {
        login(token, userObj);
        navigate(isAdmin ? '/admin' : '/manager', { replace: true });
      } else {
        setError('Authentication failed. No token received.');
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Invalid email or password.';
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    setError('');
    setNotice('');

    if (!email) {
      setError('Please enter your manager email address.');
      return;
    }

    try {
      setSubmitting(true);
      await managerApi.requestPasswordReset(email);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send the reset code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit OTP from your email.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      await managerApi.resetPassword(email, otp, newPassword);
      setForgotPassword(false);
      setOtpSent(false);
      setOtp('');
      setNewPassword('');
      setPassword('');
      setNotice('Password reset successfully. You can now sign in.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset your password.');
    } finally {
      setSubmitting(false);
    }
  };

  const showForgotPassword = () => {
    setError('');
    setNotice('');
    setForgotPassword(true);
    setOtpSent(false);
  };

  const showLogin = () => {
    setError('');
    setNotice('');
    setForgotPassword(false);
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-[#FAF9F5] text-[#0F172A]'
    }`}>
      {/* Background Glow Accents */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-indigo-500/10' : 'bg-indigo-300/15'
      }`} />
      <div className={`absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
        isDark ? 'bg-purple-500/10' : 'bg-purple-300/15'
      }`} />

      <div className={`w-full max-w-md rounded-3xl p-8 relative z-10 border transition-all duration-300 ${
        isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
      }`}>
        {/* Top Home Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className={`absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
            isDark
              ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-700/60'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
          }`}
          title="Return to Public Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`absolute top-6 right-6 p-2 rounded-xl border text-xs font-bold transition-all ${
            isDark
              ? 'bg-slate-800/60 border-slate-700 text-amber-300 hover:bg-slate-800'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <div
            className={`inline-flex p-3 rounded-2xl shadow-lg mb-4 text-white ${isAdmin
              ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-indigo-500/25'
              : 'bg-gradient-to-tr from-purple-500 to-indigo-600 shadow-purple-500/25'
              }`}
          >
            {isAdmin ? <ShieldCheck className="w-8 h-8" /> : <UserCheck className="w-8 h-8" />}
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
            {isAdmin ? 'Admin Login' : 'Manager Login'}
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isAdmin ? 'Global Administrator Portal' : 'Club Manager Portal'}
          </p>
        </div>

        {/* Inline Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {notice && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-sm">
            {notice}
          </div>
        )}

        {forgotPassword ? (
          <form onSubmit={otpSent ? handleResetPassword : (e) => e.preventDefault()} className="space-y-5">
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {otpSent
                ? 'Enter the OTP sent to your email and choose a new password.'
                : 'Enter your manager email and we will send you a password reset OTP.'}
            </p>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Manager Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl transition-all text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                    : 'bg-[#FAF9F5] border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                }`}
                required
                disabled={otpSent}
              />
            </div>

            {otpSent && (
              <>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Email OTP
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className={`w-full px-4 py-3 border rounded-xl transition-all text-sm tracking-[0.4em] focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'
                        : 'bg-[#FAF9F5] border-slate-200 text-slate-900 focus:border-indigo-500'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-4 pr-11 py-3 border rounded-xl transition-all text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                          : 'bg-[#FAF9F5] border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors focus:outline-none ${
                        isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={showNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={otpSent ? handleResetPassword : handleSendOtp}
              disabled={submitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? 'Please wait...' : otpSent ? 'Reset Password' : 'Send OTP'}
            </button>

            <button
              type="button"
              onClick={showLogin}
              className={`w-full text-sm transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Back to manager login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAdmin ? 'admin@example.com' : 'manager@example.com'}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl transition-all text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                      : 'bg-[#FAF9F5] border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-3 border rounded-xl transition-all text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                      : 'bg-[#FAF9F5] border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors focus:outline-none ${
                    isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 text-white font-semibold text-sm rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:pointer-events-none ${isAdmin
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/25'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-purple-500/25'
                }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>{isAdmin ? 'Sign In as Admin' : 'Sign In as Manager'}</span>
              )}
            </button>

            {!isAdmin && (
              <button
                type="button"
                onClick={showForgotPassword}
                className={`w-full text-sm transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Forgot password?
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

