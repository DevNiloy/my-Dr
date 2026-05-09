import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Medicine {
  name: string
  dosage: string
  frequency: string
  duration: string
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  age: number
  gender: string
  diagnosis: string
  medicines: Medicine[]
  advice?: string
  createdAt: string
}

interface PrescriptionState {
  prescriptions: Prescription[]
  selectedPrescription: Prescription | null
}

const initialState: PrescriptionState = {
  prescriptions: [],
  selectedPrescription: null
}

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.prescriptions.push(action.payload)
    },

    setSelectedPrescription: (
      state,
      action: PayloadAction<Prescription | null>
    ) => {
      state.selectedPrescription = action.payload
    }
  }
})

export const { addPrescription, setSelectedPrescription } =
  prescriptionSlice.actions

export default prescriptionSlice.reducer