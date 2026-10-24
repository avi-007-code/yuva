import React, { useRef } from 'react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Enhanced Date & Time Picker Component
 * Provides an interactive calendar date selector, time picker, quick time presets, and live preview.
 */
export const DateTimePicker = ({
  label,
  value,
  onChange,
  required = false,
  min,
  max,
  disabled = false,
  className = '',
}) => {
  const { isDark } = useTheme();
  const inputRef = useRef(null);

  // Format current datetime string (YYYY-MM-DDTHH:mm) for human-readable preview
  const formatDatePreview = (val) => {
    if (!val) return null;
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return null;
    }
  };

  const formattedPreview = formatDatePreview(value);

  // Extract separate date (YYYY-MM-DD) and time (HH:mm) strings
  const datePart = value ? value.split('T')[0] || '' : '';
  const timePart = value ? value.split('T')[1]?.slice(0, 5) || '' : '';

  const handleDateChange = (newDate) => {
    const time = timePart || '10:00';
    if (!newDate) {
      onChange('');
    } else {
      onChange(`${newDate}T${time}`);
    }
  };

  const handleTimeChange = (newTime) => {
    const date = datePart || new Date().toISOString().split('T')[0];
    onChange(`${date}T${newTime}`);
  };

  // Quick time preset buttons
  const timePresets = [
    { label: '9:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '2:00 PM', value: '14:00' },
    { label: '5:00 PM', value: '17:00' },
    { label: '7:00 PM', value: '19:00' },
  ];

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className={`block text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {label} {required && <span className="text-purple-500">*</span>}
        </label>
      )}

      {/* Grid of Date Picker & Time Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Date Selector with Calendar Icon */}
        <div className="relative flex items-center">
          <input
            type="date"
            value={datePart}
            onChange={(e) => handleDateChange(e.target.value)}
            min={min ? min.split('T')[0] : undefined}
            max={max ? max.split('T')[0] : undefined}
            required={required}
            disabled={disabled}
            className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none transition shadow-inner ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500 [color-scheme:dark]'
                : 'bg-white border-slate-300 text-slate-900 focus:border-purple-600 [color-scheme:light]'
            }`}
          />
          <Calendar className={`w-4 h-4 absolute left-3.5 pointer-events-none ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
        </div>

        {/* Time Selector with Clock Icon */}
        <div className="relative flex items-center">
          <input
            type="time"
            value={timePart}
            onChange={(e) => handleTimeChange(e.target.value)}
            required={required}
            disabled={disabled}
            className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none transition shadow-inner ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-white focus:border-purple-500 [color-scheme:dark]'
                : 'bg-white border-slate-300 text-slate-900 focus:border-purple-600 [color-scheme:light]'
            }`}
          />
          <Clock className={`w-4 h-4 absolute left-3.5 pointer-events-none ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </div>
      </div>

      {/* Hidden combined datetime-local ref */}
      <input
        ref={inputRef}
        type="datetime-local"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="hidden"
      />

      {/* Quick Time Presets & Live Selected Preview */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Quick Time:</span>
          {timePresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleTimeChange(preset.value)}
              disabled={disabled}
              className={`px-2 py-0.5 text-[11px] rounded-lg border font-medium transition cursor-pointer ${
                timePart === preset.value
                  ? isDark
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-purple-50 text-purple-700 border-purple-300 font-semibold'
                  : isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Selected Date & Time Preview Badge */}
        {formattedPreview && (
          <div className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-lg border ${
            isDark
              ? 'text-purple-300 bg-purple-500/10 border-purple-500/20'
              : 'text-purple-700 bg-purple-50 border-purple-200 font-semibold'
          }`}>
            <Sparkles className={`w-3 h-3 ${isDark ? 'text-pink-400' : 'text-pink-600'}`} />
            <span>{formattedPreview}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateTimePicker;
