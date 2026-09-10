import api from './api';

export const courseService = {
  async getCourses(filters?: { status?: string; category?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return api.get(`/courses${params ? `?${params}` : ''}`);
  },

  async getCourseById(id: string) {
    return api.get(`/courses/${id}`);
  },

  async createCourse(data: any) {
    return api.post('/courses', data);
  },

  async enrollInCourse(courseId: string, batchId?: string) {
    return api.post('/enrollments', { course_id: courseId, batch_id: batchId });
  },

  async getEnrollments() {
    return api.get('/enrollments');
  },
};

export default courseService;
