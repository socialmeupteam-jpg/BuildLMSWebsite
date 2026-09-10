import api from './api';

export const assignmentService = {
  async getAssignments(filters?: { course_id?: string; batch_id?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return api.get(`/assignments${params ? `?${params}` : ''}`);
  },

  async createAssignment(data: any) {
    return api.post('/assignments', data);
  },

  async submitAssignment(data: { assignment_id: string; content?: string; file_url?: string }) {
    return api.post('/assignments/submit', data);
  },
};

export default assignmentService;
