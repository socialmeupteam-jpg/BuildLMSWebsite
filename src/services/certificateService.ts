import api from './api';

export const certificateService = {
  async getCertificates() {
    return api.get('/certificates');
  },

  async verifyCertificate(certificateNumber: string) {
    return api.get(`/certificates/verify/${encodeURIComponent(certificateNumber)}`);
  },

  async issueCertificate(data: {
    student_id: string;
    course_id: string;
    grade?: string;
    score?: number;
  }) {
    return api.post('/certificates/issue', data);
  },
};

export default certificateService;
