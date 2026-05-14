import { baseApi } from './baseApi';

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params: { patientId?: string } = {}) => {
        const qs = new URLSearchParams();
        if (params.patientId) qs.set('patientId', params.patientId);
        return { url: `/reports?${qs.toString()}`, method: 'GET' };
      },
      providesTags: ['Reports'],
    }),
    getReportById: builder.query({
      query: (id: string) => ({ url: `/reports/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Reports', id }],
    }),
    createReport: builder.mutation({
      query: (body) => ({ url: '/reports', method: 'POST', body }),
      invalidatesTags: ['Reports'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useCreateReportMutation,
} = reportApi;
