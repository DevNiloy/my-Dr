import { baseApi } from './baseApi';

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinances: builder.query({
      query: (params: { doctorId?: string } = {}) => {
        const qs = new URLSearchParams();
        if (params.doctorId) qs.set('doctorId', params.doctorId);
        return { url: `/finances?${qs.toString()}`, method: 'GET' };
      },
      providesTags: ['Finances'],
    }),
    getClinicAnalytics: builder.query({
      query: () => ({
        url: '/finances/analytics',
        method: 'GET',
      }),
      providesTags: ['Finances', 'Appointments', 'Doctors'],
    }),
    getMyEarnings: builder.query({
      query: () => ({
        url: '/finances/my-earnings',
        method: 'GET',
      }),
      providesTags: ['Finances'],
    }),
  }),
});

export const {
  useGetFinancesQuery,
  useGetClinicAnalyticsQuery,
  useGetMyEarningsQuery,
} = financeApi;
