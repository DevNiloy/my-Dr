import { baseApi } from '../../api/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/register/send-otp',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtpAndRegister: builder.mutation({
      query: (data) => ({
        url: '/auth/register/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpAndRegisterMutation,
} = authApi;
