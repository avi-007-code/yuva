import React, { useState } from 'react';
import { Users, Tag, Building2 } from 'lucide-react';
import { getCloudinaryUrl, CLOUDINARY_TRANSFORMS } from '../utils/cloudinary';

const getInitials = (name) => {
  if (!name) return 'YU';
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
    <div className={`relative w-full rounded-3xl overflow-hidden bg-white border border-[#E2E0D5] shadow-sm ${className}`}>
      {/* Cover Image Container */}
      <div className="relative w-full h-60 sm:h-72 md:h-[340px] bg-[#FAF9F5]">

        {/* Background Image / Placeholder */}
        <div className="absolute inset-0 overflow-hidden">
          {showCoverImage ? (
            <img
              src={transformedCoverUrl}
              alt={`${club.name || 'Club'} Cover`}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={() => setCoverFailed(true)}
            />
          ) : (
            <div className="w-full h-full bg-[#FAF9F5] border-b border-[#E8E6DF] relative flex items-center justify-center">
              <div className="relative text-center p-6 space-y-2 select-none">
                <Building2 className="w-16 h-16 text-[#FF5733]/30 mx-auto" />
                <p className="font-['Syne',sans-serif] text-xs uppercase font-black tracking-widest text-[#0F172A]">
                  {club.name || 'Yuuva Campus Club'}
                </p>
              </div>
            </div>
          )}

          {/* Subtle bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 via-40% to-transparent pointer-events-none" />
        </div>

        {/* Category & Member count pills */}
        <div className="absolute bottom-4 right-6 z-10 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5733] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            <Tag className="w-3.5 h-3.5" />
            <span>{category}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0F172A] text-[10px] font-black uppercase tracking-wider border border-[#E2E0D5] shadow-md">
            <Users className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{memberCount.toLocaleString()} {memberCount === 1 ? 'member' : 'members'}</span>
          </span>
        </div>

        {/* Square Logo overlapping bottom edge */}
        <div className="absolute -bottom-10 sm:-bottom-12 left-6 sm:left-8 z-20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white shrink-0 relative">
            {showLogoImage ? (
              <img
                src={transformedLogoUrl}
                alt={`${club.name || 'Club'} Logo`}
                className="w-full h-full object-cover"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="w-full h-full bg-[#FF5733] flex items-center justify-center text-white font-['Syne',sans-serif] font-black text-2xl sm:text-3xl uppercase">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content area below cover */}
      <div className="px-6 sm:px-8 pb-6 pt-14 sm:pt-16 relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-['Syne',sans-serif] text-2xl sm:text-3xl md:text-4xl font-black text-[#0F172A] uppercase tracking-tight">
              {club.name || 'Untitled Club'}
            </h1>
            {club.description && (
              <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed">
                {club.description}
              </p>
            )}
          </div>

          {/* Optional actions slot */}
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
