import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { getCloudinaryUrl, CLOUDINARY_TRANSFORMS } from '../utils/cloudinary';

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
};

const formatTimeOrDuration = (event) => {
  if (event.duration) return event.duration;
  if (event.readTime) return event.readTime;

  // Extract time or range from startDate / date
  const dateVal = event.date || event.eventDate || event.startDate;
  if (!dateVal) return null;

  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return null;
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (event.endDate) {
      const endD = new Date(event.endDate);
      if (!isNaN(endD.getTime())) {
        const endTimeStr = endD.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        return `${timeStr} - ${endTimeStr}`;
      }
    }
    return timeStr;
  } catch {
    return null;
  }
};

export const EventHero = ({ event, children, className = '' }) => {
  const [coverFailed, setCoverFailed] = useState(false);

  if (!event) return null;

  // Flexible property extraction supporting event.coverImageUrl / event.coverUrl / nested objects
  const rawCoverUrl = event.coverImageUrl || event.coverUrl || event.coverImage?.url || event.cover?.url;
  const transformedCoverUrl = getCloudinaryUrl(rawCoverUrl, CLOUDINARY_TRANSFORMS.COVER);

  const category = event.category || event.type || event.tag || 'Featured Event';
  const status = event.status; // e.g., 'UPCOMING', 'LIVE', 'COMPLETED'
  const title = event.title || event.name || 'Untitled Event';
  const formattedDate = formatDate(event.date || event.eventDate || event.startDate);
  const timeOrDuration = formatTimeOrDuration(event);
  const venue = event.venue || event.location || event.club?.name;

  const showCoverImage = transformedCoverUrl && !coverFailed;

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl group ${className}`}>
      {/* Magazine-style Hero Banner Container (~320–460px height, responsive) */}
      <div className="relative w-full min-h-[340px] sm:min-h-[380px] md:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 md:p-10">

        {/* Background Cover Image or Fallback Gradient */}
        {showCoverImage ? (
          <img
            src={transformedCoverUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.18),transparent_55%)]" />
          </div>
        )}

        {/* Dark gradient overlay from bottom (black/90 -> transparent) for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 via-50% to-black/20 pointer-events-none" />

        {/* Hero Content Layer (all text & badges within overlaid gradient area) */}

        {/* Top Badge Area */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category / Magazine Pill */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-md border border-purple-400/40 text-pink-200 text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-950/50">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>{category}</span>
            </span>

            {/* Event Status Pill (if present) */}
            {status && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border text-xs font-semibold uppercase tracking-wider shadow-md ${
                  status === 'LIVE' || status === 'ONGOING'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : status === 'COMPLETED'
                    ? 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                }`}
              >
                {(status === 'LIVE' || status === 'ONGOING') && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
                <span>{status}</span>
              </span>
            )}
          </div>

          {/* Optional Action/Children Slot */}
          {children && <div className="relative z-10">{children}</div>}
        </div>

        {/* Bottom Area: Meta Row + Bold Multi-line Title */}
        <div className="relative z-10 mt-auto pt-12 space-y-3">
          {/* Meta Row: Date, Duration / Time, Venue */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm font-medium text-slate-200">
            {formattedDate && (
              <div className="inline-flex items-center gap-1.5 text-purple-200">
                <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{formattedDate}</span>
              </div>
            )}

            {formattedDate && timeOrDuration && (
              <span className="text-slate-600 hidden sm:inline">•</span>
            )}

            {timeOrDuration && (
              <div className="inline-flex items-center gap-1.5 text-indigo-200">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{timeOrDuration}</span>
              </div>
            )}

            {(formattedDate || timeOrDuration) && venue && (
              <span className="text-slate-600 hidden sm:inline">•</span>
            )}

            {venue && (
              <div className="inline-flex items-center gap-1.5 text-pink-200">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{venue}</span>
              </div>
            )}
          </div>

          {/* Bold Event Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-snug drop-shadow-md max-w-4xl">
            {title}
          </h1>

          {/* Optional Short Description */}
          {event.description && (
            <p className="text-slate-300/90 text-sm sm:text-base line-clamp-2 max-w-3xl leading-relaxed font-normal pt-1">
              {event.description}
            </p>
          )}

          {/* External Redirect / Registration Link */}
          {(event.registrationUrl || event.url || event.externalUrl || event.link) && (
            <div className="pt-2">
              <a
                href={event.registrationUrl || event.url || event.externalUrl || event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.03] active:scale-[0.97]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Register / Open Link</span>
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EventHero;
