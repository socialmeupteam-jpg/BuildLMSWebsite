import api from './api';

export const paymentService = {
  async getPayments() {
    return api.get('/payments');
  },

  async recordOfflinePayment(data: {
    student_id: string;
    amount: number;
    payment_method: string;
    course_id?: string;
    reference_number?: string;
    notes?: string;
  }) {
    return api.post('/payments/offline', data);
  },
};

export default paymentService;
