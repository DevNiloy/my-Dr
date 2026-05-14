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
      providesTags: (result, error, id) => [{ type: 'Prescriptions', id }],
    }),
    createPrescription: builder.mutation({
      query: (body) => ({ url: '/prescriptions', method: 'POST', body }),
      invalidatesTags: ['Prescriptions'],
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useCreatePrescriptionMutation,
} = prescriptionApi;
