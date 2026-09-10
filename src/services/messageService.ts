import api from './api';

export const messageService = {
  async getMessages() {
    return api.get('/messages');
  },

  async sendMessage(data: { recipient_id: string; content: string; subject?: string }) {
    return api.post('/messages', data);
  },
};

export default messageService;
