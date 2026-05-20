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
    sendForgotPasswordOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password/send-otp',
        method: 'POST',
        body: data,
      }),
    }),
    verifyForgotPasswordOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password/reset-password',
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
  useSendForgotPasswordOtpMutation,
  useVerifyForgotPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi;
