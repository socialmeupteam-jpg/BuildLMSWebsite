import api from './api';

export const grievanceService = {
  async getGrievances() {
    return api.get('/grievances');
  },

  async createGrievance(data: {
    category: string;
    subject: string;
    description: string;
    priority?: string;
  }) {
    return api.post('/grievances', data);
  },

  async updateGrievance(id: string, data: any) {
    return api.put(`/grievances/${id}`, data);
  },
};

export default grievanceService;
