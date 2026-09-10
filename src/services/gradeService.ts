import api from './api';

export const gradeService = {
  async getGrades(studentId?: string) {
    const params = studentId ? `?student_id=${studentId}` : '';
    return api.get(`/grades${params}`);
  },

  async gradeSubmission(data: { submission_id: string; score: number; feedback?: string }) {
    return api.post('/grades', data);
  },
};

export default gradeService;
