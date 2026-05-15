import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadProfilePic: builder.mutation({
      query: (formData) => ({
        url: '/users/upload-profile-pic',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Doctors', 'Patients'],
    }),
    getMe: builder.query({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
    }),
  }),
});

export const { useUploadProfilePicMutation, useGetMeQuery } = userApi;
