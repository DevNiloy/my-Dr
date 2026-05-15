import { baseApi } from './baseApi';

export const patientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: () => ({ url: '/patients', method: 'GET' }),
      providesTags: ['Patients'],
    }),
    getPatientById: builder.query({
      query: (id: string) => ({ url: `/patients/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Patients', id }],
    }),
    getPatientMe: builder.query({
      query: () => ({ url: '/patients/me', method: 'GET' }),
      providesTags: ['Patients'],
    }),
    updatePatient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/patients/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Patients', { type: 'Patients', id: 'me' }],
    }),
    getPatientDashboardStats: builder.query({
      query: () => ({
        url: '/patients/dashboard-stats',
        method: 'GET',
      }),
      providesTags: ['Appointments', 'Prescriptions', 'Reports'],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useGetPatientMeQuery,
  useUpdatePatientMutation,
  useGetPatientDashboardStatsQuery,
} = patientApi;
