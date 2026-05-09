import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Patient } from '../../../types/PatientTypes'

interface PatientState {
  patients: Patient[]
  selectedPatient: Patient | null
  loading: boolean
}

const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Rahim Ahmed',
    age: 32,
    gender: 'Male',
    phone: '01700000000',
    email: 'rahim@gmail.com',
    bloodGroup: 'A+',
    address: 'Dhaka',
    lastVisit: '2026-05-01'
  },
  {
    id: 'p2',
    name: 'Karim Mia',
    age: 45,
    gender: 'Male',
    phone: '01800000000',
    bloodGroup: 'B+',
    address: 'Narayanganj',
    lastVisit: '2026-04-28'
  },
  {
    id: 'p3',
    name: 'Sumi Akter',
    age: 28,
    gender: 'Female',
    phone: '01900000000',
    email: 'sumi@gmail.com',
    bloodGroup: 'O+',
    address: 'Dhaka',
    lastVisit: '2026-05-03'
  }
]

const initialState: PatientState = {
  patients: mockPatients,
  selectedPatient: null,
  loading: false
}

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload
    },

    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload)
    },

    updatePatient: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex(
        p => p.id === action.payload.id
      )
      if (index !== -1) {
        state.patients[index] = action.payload
      }
    },

    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(
        p => p.id !== action.payload
      )
    },

    setSelectedPatient: (
      state,
      action: PayloadAction<Patient | null>
    ) => {
      state.selectedPatient = action.payload
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  }
})

export const {
  setPatients,
  addPatient,
  updatePatient,
  deletePatient,
  setSelectedPatient,
  setLoading
} = patientSlice.actions

export default patientSlice.reducer