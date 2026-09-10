import api from './api';

export const attendanceService = {
  async getAttendance(filters?: { student_id?: string; batch_id?: string; start_date?: string; end_date?: string }) {
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    return api.get(`/attendance${params ? `?${params}` : ''}`);
  },

  async markAttendance(data: {
    batch_id: string;
    date: string;
    records: Array<{ student_id: string; status: string; notes?: string }>;
  }) {
    return api.post('/attendance', data);
  },
};

export default attendanceService;
