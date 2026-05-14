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
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientByIdQuery,
  useGetPatientMeQuery,
} = patientApi;
