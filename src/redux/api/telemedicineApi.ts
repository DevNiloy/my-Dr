import { baseApi } from './baseApi';

export const telemedicineApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalls: builder.query({
      query: (params: { doctorId?: string; patientId?: string } = {}) => {
        const qs = new URLSearchParams();
        if (params.doctorId) qs.set('doctorId', params.doctorId);
        if (params.patientId) qs.set('patientId', params.patientId);
        return { url: `/telemedicine?${qs.toString()}`, method: 'GET' };
      },
      providesTags: ['Calls'],
    }),
    createCall: builder.mutation({
      query: (body) => ({ url: '/telemedicine', method: 'POST', body }),
      invalidatesTags: ['Calls'],
    }),
  }),
});

export const {
  useGetCallsQuery,
  useCreateCallMutation,
} = telemedicineApi;
