import api from './api';

export const batchService = {
  async getBatches(filters?: { course_id?: string; status?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return api.get(`/batches${params ? `?${params}` : ''}`);
  },

  async createBatch(data: any) {
    return api.post('/batches', data);
  },
};

export default batchService;
