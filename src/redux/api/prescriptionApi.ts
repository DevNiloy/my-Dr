import { baseApi } from './baseApi';

export const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptions: builder.query({
      query: (params: { patientId?: string } = {}) => {
        const qs = new URLSearchParams();
        if (params.patientId) qs.set('patientId', params.patientId);
        return { url: `/prescriptions?${qs.toString()}`, method: 'GET' };
      },
      providesTags: ['Prescriptions'],
    }),
    getPrescriptionById: builder.query({
      query: (id: string) => ({ url: `/prescriptions/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Prescriptions', id }],
    }),
    createPrescription: builder.mutation({
      query: (body) => ({ url: '/prescriptions', method: 'POST', body }),
      invalidatesTags: ['Prescriptions'],
    }),
    getPatientPrescriptions: builder.query({
      query: (patientId: string) => ({ url: `/prescriptions/patient/${patientId}`, method: 'GET' }),
      providesTags: ['Prescriptions'],
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useCreatePrescriptionMutation,
  useGetPatientPrescriptionsQuery,
} = prescriptionApi;
