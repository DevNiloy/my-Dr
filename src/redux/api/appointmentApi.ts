import { baseApi } from './baseApi';

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: (params: { 
        doctorId?: string; 
        patientId?: string; 
        date?: string; 
        page?: number; 
        limit?: number;
        status?: string;
        paymentStatus?: string;
        adminApprovalStatus?: string;
        search?: string;
        type?: string;
      } = {}) => {
        const qs = new URLSearchParams();
        if (params.doctorId) qs.set('doctorId', params.doctorId);
        if (params.patientId) qs.set('patientId', params.patientId);
        if (params.date) qs.set('date', params.date);
        if (params.page) qs.set('page', params.page.toString());
        if (params.limit) qs.set('limit', params.limit.toString());
        if (params.status) qs.set('status', params.status);
        if (params.paymentStatus) qs.set('paymentStatus', params.paymentStatus);
        if (params.adminApprovalStatus) qs.set('adminApprovalStatus', params.adminApprovalStatus);
        if (params.search) qs.set('search', params.search);
        if (params.type) qs.set('type', params.type);
        
        return { url: `/appointments?${qs.toString()}`, method: 'GET' };
      },
      providesTags: ['Appointments'],
    }),
    createAppointment: builder.mutation({
      query: (body) => ({ url: '/appointments', method: 'POST', body }),
      invalidatesTags: ['Appointments'],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/appointments/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Appointments'],
    }),
    updateAdminApprovalStatus: builder.mutation({
      query: ({ id, adminApprovalStatus }) => ({
        url: `/appointments/${id}/admin-approval`,
        method: 'PATCH',
        body: { adminApprovalStatus },
      }),
      invalidatesTags: ['Appointments'],
    }),
    getFinancialSummary: builder.query({
      query: () => ({ url: '/appointments/financial-summary', method: 'GET' }),
      providesTags: ['Appointments'],
    }),
    getDoctorAppointments: builder.query({
      query: (params: {
        status?: string;
        type?: string;
        date?: string;
        search?: string;
        page?: number;
        limit?: number;
      } = {}) => {
        const qs = new URLSearchParams();
        if (params.status) qs.set('status', params.status);
        if (params.type) qs.set('type', params.type);
        if (params.date) qs.set('date', params.date);
        if (params.search) qs.set('search', params.search);
        if (params.page) qs.set('page', params.page.toString());
        if (params.limit) qs.set('limit', params.limit.toString());
        return { url: `/appointments/my-appointments?${qs.toString()}`, method: 'GET' };
      },
      providesTags: ['Appointments'],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useUpdateAdminApprovalStatusMutation,
  useGetFinancialSummaryQuery,
  useGetDoctorAppointmentsQuery,
} = appointmentApi;
