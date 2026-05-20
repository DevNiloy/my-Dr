import { baseApi } from './baseApi';

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: (params: any) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.department) queryParams.append('department', params.department);
        if (params?.specialization) queryParams.append('specialization', params.specialization);
        if (params?.availableDate) queryParams.append('availableDate', params.availableDate);

        return {
          url: `/doctors?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Doctors'],
    }),
    addDoctor: builder.mutation({
      query: (newDoctor) => ({
        url: '/doctors',
        method: 'POST',
        body: newDoctor,
      }),
      invalidatesTags: ['Doctors', 'Departments'],
    }),
    updateDoctor: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Doctors', 'Departments'],
    }),
    suspendDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}/suspend`,
        method: 'PUT',
      }),
      invalidatesTags: ['Doctors'],
    }),
    deleteDoctor: builder.mutation({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Doctors'],
    }),
    updateDoctorAvailability: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/doctors/${id}/availability`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Doctors'],
    }),
    getDoctorMe: builder.query({
      query: () => ({
        url: '/doctors/me',
        method: 'GET',
      }),
      providesTags: ['Doctors'],
    }),
    updateDoctorMe: builder.mutation({
      query: (body) => ({
        url: '/doctors/me',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Doctors'],
    }),
    getMyPatients: builder.query({
      query: (params: any) => {
        const search = params?.search || "";
        return {
          url: `/doctors/my-patients?search=${search}`,
          method: 'GET',
        };
      },
      providesTags: ['Patients'],
    }),
    getDoctorDashboardStats: builder.query({
      query: () => ({
        url: '/doctors/dashboard-stats',
        method: 'GET',
      }),
      providesTags: ['Appointments', 'Patients', 'Prescriptions'],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useAddDoctorMutation,
  useUpdateDoctorMutation,
  useSuspendDoctorMutation,
  useDeleteDoctorMutation,
  useUpdateDoctorAvailabilityMutation,
  useGetDoctorMeQuery,
  useUpdateDoctorMeMutation,
  useGetMyPatientsQuery,
  useGetDoctorDashboardStatsQuery,
} = doctorApi;
