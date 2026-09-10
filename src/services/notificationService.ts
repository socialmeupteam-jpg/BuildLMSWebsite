import api from './api';

export const notificationService = {
  async getNotifications() {
    return api.get('/notifications');
  },

  async markAsRead(id: string) {
    return api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead() {
    return api.put('/notifications/read-all');
  },
};

export default notificationService;
