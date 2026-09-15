import React from 'react';
import { getCloudinaryUrl, CLOUDINARY_TRANSFORMS } from '../../utils/cloudinary';
import { Sparkles, Calendar, MapPin } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return 'Saturday, March 18, 9:30PM';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(' ', '');

  return `${weekday}, ${month} ${day}, ${time}`;
};

export const EventCard = ({ event, onClick, badgeText }) => {
  if (!event) return null;

  const rawCoverUrl = event.coverImage?.url || event.coverImageUrl || event.coverUrl;
  const coverUrl = getCloudinaryUrl(rawCoverUrl, CLOUDINARY_TRANSFORMS.COVER);
  const clubName = event.club?.name || 'Student Club';
  
  // Format Date according to Figma specs ("Saturday, March 18, 9.30PM")
  const dateFormatted = formatDate(event.startAt);

  // Format Location according to Figma specs ("ONLINE EVENT - Attend anywhere")
  let locationFormatted = 'ONLINE EVENT - Attend anywhere';
  if (event.location) {
    locationFormatted = event.location.toUpperCase().includes('ONLINE')
      ? event.location
      : `${event.location} - In-Person Event`;
  }

  const badge = badgeText || (event.isPaid ? `$${event.ticketPrice || 'PAID'}` : 'FREE');

  return (
    <div
      onClick={onClick}
      className="group relative w-full h-[400px] bg-[#FFFFFF] rounded-[10px] figma-card-shadow transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer overflow-hidden select-none"
      style={{
        fontFamily: "'Product Sans', 'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Event Image Container (height: 240px, top: 20px, left: 20px, right: 19.67px, border-radius: 5px) */}
      <div 
        className="absolute top-[20px] left-[20px] right-[19.67px] h-[240px] rounded-[5px] overflow-hidden bg-slate-100"
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={event.title || 'Event Cover'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 flex flex-col items-center justify-center p-4 text-white">
            <Sparkles className="w-10 h-10 mb-2 opacity-80 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
              {clubName}
            </span>
          </div>
        )}

        {/* Badge (Frame 1: top: 30px, left: 30px -> relative to image: top: 10px, left: 10px) */}
        <div className="absolute top-[10px] left-[10px] px-[10px] py-[5px] bg-[#FFFFFF] rounded-[5px] flex items-center justify-center gap-[10px] shadow-sm z-10">
          <span className="text-[10px] leading-[12px] font-normal text-[#7848F4] tracking-wide text-center uppercase min-w-[22px]">
            {badge}
          </span>
        </div>
      </div>

      {/* Event Title (top: 275px, left: 20px, right: 19.67px, height: 38px, font-size: 16px, line-height: 19px) */}
      <h3 
        className="absolute top-[275px] left-[20px] right-[19.67px] h-[38px] text-[16px] leading-[19px] font-normal text-[#000000] line-clamp-2 group-hover:text-[#7848F4] transition-colors"
        title={event.title}
      >
        {event.title || 'BestSeller Book Bootcamp - Write, Market & Publish Your Book'}
      </h3>

      {/* Date & Time (bottom: 56px, left: 20px, right: 19.67px, height: 15px, font-size: 12px, line-height: 15px, color: #7848F4) */}
      <div className="absolute bottom-[56px] left-[20px] right-[19.67px] h-[15px] text-[12px] leading-[15px] font-normal text-[#7848F4] truncate flex items-center gap-1.5">
        <span>{dateFormatted}</span>
      </div>

      {/* Event Location / Type (bottom: 20px, left: 20px, right: 19.67px, height: 15px, font-size: 12px, line-height: 15px, color: #7E7E7E) */}
      <div className="absolute bottom-[20px] left-[20px] right-[19.67px] h-[15px] text-[12px] leading-[15px] font-normal text-[#7E7E7E] truncate flex items-center gap-1.5">
        <span>{locationFormatted}</span>
      </div>
    </div>
  );
};

export default EventCard;
