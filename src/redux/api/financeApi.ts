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
  }),
});

export const {
  useGetFinancesQuery,
} = financeApi;
