import React, { useState } from 'react';
import { Users, Tag, Building2 } from 'lucide-react';
import { getCloudinaryUrl, CLOUDINARY_TRANSFORMS } from '../utils/cloudinary';

const getInitials = (name) => {
  if (!name) return 'CP';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const ClubHeader = ({ club, children, className = '' }) => {
  const [coverFailed, setCoverFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  if (!club) return null;

  // Flexible property extraction supporting club.coverImageUrl / club.coverUrl / nested objects
  const rawCoverUrl = club.coverImageUrl || club.coverUrl || club.coverImage?.url || club.cover?.url;
  const rawLogoUrl = club.logoUrl || club.logo?.url;

  const transformedCoverUrl = getCloudinaryUrl(rawCoverUrl, CLOUDINARY_TRANSFORMS.COVER);
  const transformedLogoUrl = getCloudinaryUrl(rawLogoUrl, CLOUDINARY_TRANSFORMS.LOGO);

  const category = club.category || club.type || 'Student Club';
  const rawMemberCount = club.memberCount ?? club.membersCount ?? club._count?.members ?? club.members?.length ?? 0;
  const memberCount = typeof rawMemberCount === 'number' ? rawMemberCount : 0;
  const initials = getInitials(club.name);

  const showCoverImage = transformedCoverUrl && !coverFailed;
  const showLogoImage = transformedLogoUrl && !logoFailed;

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-2xl ${className}`}>
      {/* Cover Image Container (~320–420px height, responsive) - overflow visible so overlapping logo extends cleanly */}
      <div className="relative w-full h-64 sm:h-80 md:h-[380px] lg:h-[420px] bg-slate-950">
        
        {/* Background Image / Placeholder - strictly clipped to cover bounds */}
        <div className="absolute inset-0 overflow-hidden">
          {showCoverImage ? (
            <img
              src={transformedCoverUrl}
              alt={`${club.name || 'Club'} Cover`}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={() => setCoverFailed(true)}
            />
          ) : (
            /* Solid dark purple/pink gradient placeholder when cover is missing or failed */
            <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,39,119,0.18),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.18),transparent_50%)]" />
              <div className="relative text-center p-6 space-y-2 opacity-30 select-none">
                <Building2 className="w-16 h-16 md:w-20 md:h-20 text-purple-300 mx-auto" />
                <p className="text-xs uppercase font-extrabold tracking-widest text-purple-200">
                  {club.name || 'CampusPulse Club'}
                </p>
              </div>
            </div>
          )}

          {/* Dark gradient overlay from bottom (black/90 -> transparent) for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 via-40% to-transparent pointer-events-none" />
        </div>

        {/* Category badge pill + member count positioned bottom-right over gradient to prevent colliding with logo */}
        <div className="absolute bottom-4 sm:bottom-6 right-6 md:right-10 z-10 flex flex-wrap items-center gap-2.5">
          {/* Category Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-purple-500/25 backdrop-blur-md border border-purple-400/30 text-purple-200 text-xs font-semibold uppercase tracking-wider shadow-lg shadow-purple-950/40">
            <Tag className="w-3.5 h-3.5 text-pink-400" />
            <span>{category}</span>
          </span>

          {/* Member Count Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/70 text-slate-200 text-xs font-medium shadow-lg">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>{memberCount.toLocaleString()} {memberCount === 1 ? 'member' : 'members'}</span>
          </span>
        </div>

        {/* Square Logo overlapping bottom edge of cover (Channel / Profile header style) - unclipped! */}
        <div className="absolute -bottom-10 sm:-bottom-12 md:-bottom-14 left-6 md:left-10 z-20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl md:rounded-3xl border-4 border-slate-900 shadow-2xl shadow-purple-950/60 overflow-hidden bg-slate-900 shrink-0 relative">
            {showLogoImage ? (
              <img
                src={transformedLogoUrl}
                alt={`${club.name || 'Club'} Logo`}
                className="w-full h-full object-cover"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-inner uppercase tracking-wider">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content area below cover: club name & description with enough top padding to clear overlapping logo */}
      <div className="px-6 md:px-10 pb-8 pt-14 sm:pt-16 md:pt-18 relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2.5 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {club.name || 'Untitled Club'}
            </h1>
            {club.description && (
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {club.description}
              </p>
            )}
          </div>

          {/* Optional actions/buttons slot */}
          {children && (
            <div className="shrink-0 flex items-center gap-3 pt-2 md:pt-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubHeader;
