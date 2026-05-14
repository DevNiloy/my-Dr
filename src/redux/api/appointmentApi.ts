import { baseApi } from './baseApi';

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: (params: { doctorId?: string; patientId?: string; date?: string } = {}) => {
        const qs = new URLSearchParams();
        if (params.doctorId) qs.set('doctorId', params.doctorId);
        if (params.patientId) qs.set('patientId', params.patientId);
        if (params.date) qs.set('date', params.date);
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
  }),
});

export const {
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
} = appointmentApi;
