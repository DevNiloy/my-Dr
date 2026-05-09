import { createSlice, type PayloadAction,  } from '@reduxjs/toolkit'

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  doctorId: string
  patientId: string
  patientName: string
  date: string
  time: string
  reason: string
  status: AppointmentStatus
}
interface AppointmentState {
  appointments: Appointment[]
}

const initialState: AppointmentState = {
  appointments: []
}

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload
    }
  }
})

export const { setAppointments } = appointmentSlice.actions
export default appointmentSlice.reducer