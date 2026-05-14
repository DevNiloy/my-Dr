import { baseApi } from './baseApi';

export const doctorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query({
      query: (params: any) => {
        const p = (params && typeof params === 'object') ? params : {};
        const { search = '', page = 1, limit = 10, department = '' } = p;
        return {
          url: `/doctors?search=${search}&page=${page}&limit=${limit}&department=${department}`,
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
} = doctorApi;
