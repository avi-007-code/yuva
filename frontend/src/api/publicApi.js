import api from './axios';

export const publicApi = {
  // Public Clubs
  getClubs: async () => {
    const res = await api.get('/clubs');
    return res.data;
  },

  getClubById: async (clubId) => {
    const res = await api.get(`/clubs/${clubId}`);
    return res.data;
  },

  // Public Events
  getUpcomingEvents: async () => {
    const res = await api.get('/events/upcoming');
    return res.data;
  },

  getClubUpcomingEvents: async (clubId) => {
    const res = await api.get(`/clubs/${clubId}/events/upcoming`);
    return res.data;
  },

  getClubPastEvents: async (clubId) => {
    const res = await api.get(`/clubs/${clubId}/events/past`);
    return res.data;
  },

  getPublicEvent: async (clubId, eventId) => {
    const res = await api.get(`/clubs/${clubId}/events/${eventId}`);
    return res.data;
  },
};

export default publicApi;
