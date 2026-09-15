import api from './axios';

export const inviteApi = {
  /**
   * Validate invitation token expiry and active status
   * GET /invite/:token/validate
   */
  validateInvite: async (token) => {
    const res = await api.get(`/invite/${token}/validate`);
    return res.data;
  },

  /**
   * Accept invitation and set user password
   * POST /invite/:token/accept
   */
  acceptInvite: async (token, password) => {
    const res = await api.post(`/invite/${token}/accept`, { password });
    return res.data;
  },
};

export default inviteApi;
