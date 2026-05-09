import { configureStore } from "@reduxjs/toolkit";
// import { baseApi } from "./api/baseApi";
import patientReducer from '../redux/feature/patient/patientSlice'
import presciptionReducer from '../redux/feature/patient/prescriptionSlice'
import scheduleReducer from '../redux/feature/doctor/scheduleSlice'
import appointmentReducer from '../redux/feature/doctor/appointmentSlice'

export const store = configureStore({
  reducer: {
    // [baseApi.reducerPath]: baseApi.reducer,
    patients:patientReducer,
    prescriptions:presciptionReducer,
    schedule:scheduleReducer,
    appointments:appointmentReducer
   
  },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(baseApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
