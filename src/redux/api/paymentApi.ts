import { baseApi } from "./baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStripeAccount: builder.mutation({
      query: () => ({ url: "/payments/create-account", method: "POST" }),
      invalidatesTags: ["Doctors"],
    }),
    getStripeDashboardLink: builder.query({
      query: () => ({ url: "/payments/dashboard-link", method: "GET" }),
    }),
// 
    createCheckoutSession: builder.mutation({
      query: (body: any) => ({
        url: "/payments/create-checkout-session",
        method: "POST",
        body,
      }),
    }),
    getStripeStatus: builder.query({
      query: () => ({ url: "/payments/stripe-status", method: "GET" }),
      providesTags: ["Doctors"],
    }),
  }),
});

export const {
  useCreateStripeAccountMutation,
  useGetStripeDashboardLinkQuery,
  useCreateCheckoutSessionMutation,
  useGetStripeStatusQuery,
} = paymentApi;
