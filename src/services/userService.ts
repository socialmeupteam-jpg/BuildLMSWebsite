import api from './api';

export const userService = {
  async getProfile() {
    return api.get('/users/profile');
  },

  async updateProfile(data: { name?: string; phone?: string; bio?: string; avatarUrl?: string }) {
    return api.put('/users/profile', data);
  },

  async getUsers(params?: { role?: string; search?: string; limit?: number; offset?: number }) {
    const qs = new URLSearchParams(params as any).toString();
    return api.get(`/users${qs ? `?${qs}` : ''}`);
  },

  async getChildren() {
    return api.get('/users/children');
  },
};

export default userService;
