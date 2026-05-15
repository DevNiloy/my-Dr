import { baseApi } from "./baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.patientId) queryParams.append("patientId", params.patientId);

        return {
          url: `/reports?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Reports"],
    }),
    createReport: builder.mutation({
      query: (formData: FormData) => ({
        url: "/reports",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reports"],
    }),
    updateReport: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => ({
        url: `/reports/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Reports"],
    }),
    deleteReport: builder.mutation({
      query: (id: string) => ({
        url: `/reports/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportApi;
