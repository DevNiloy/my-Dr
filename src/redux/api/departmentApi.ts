import { baseApi } from '../api/baseApi';

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: (params: any) => {
        const p = (params && typeof params === 'object') ? params : {};
        const { search = '', page = 1, limit = 10 } = p;
        return {
          url: `/departments?search=${search}&page=${page}&limit=${limit}`,
          method: 'GET',
        };
      },
      providesTags: ['Departments'],
    }),
    getDepartmentById: builder.query({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Departments', id }],
    }),
    addDepartment: builder.mutation({
      query: (newDepartment) => ({
        url: '/departments',
        method: 'POST',
        body: newDepartment,
      }),
      invalidatesTags: ['Departments'],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/departments/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Departments'],
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Departments'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
