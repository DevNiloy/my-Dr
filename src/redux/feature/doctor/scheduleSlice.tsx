import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// ডক্টরের শিডিউল ইন্টারফেস
export interface DaySchedule {
  day: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

export interface DoctorSchedule {
  doctorId: string;
  weeklySchedule: DaySchedule[];
  slotDuration: number;
  maxAppointmentsPerDay: number;
  offDays: string[];
}

interface ScheduleState {
  schedule: DoctorSchedule | null // any এর বদলে ইন্টারফেস ব্যবহার করা হয়েছে
}

const initialState: ScheduleState = {
  schedule: null
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    // সম্পূর্ণ শিডিউল সেট করার জন্য
    setSchedule: (state, action: PayloadAction<DoctorSchedule>) => {
      state.schedule = action.payload
    },

    // অফ-ডে আপডেট করার জন্য (আগের গুলোর সাথে নতুনগুলো যোগ করা বা রিপ্লেস করা)
    updateOffDays: (state, action: PayloadAction<string[]>) => {
      if (state.schedule) {
        state.schedule.offDays = action.payload
      }
    },

    // অফ-ডে তে একটি নতুন তারিখ যোগ করার জন্য (একবারে সব রিপ্লেস না করে)
    addOffDay: (state, action: PayloadAction<string>) => {
      if (state.schedule && !state.schedule.offDays.includes(action.payload)) {
        state.schedule.offDays.push(action.payload)
      }
    },

    // শিডিউল রিসেট করার জন্য (লগআউট বা অন্য প্রয়োজনে)
    clearSchedule: (state) => {
      state.schedule = null
    }
  }
})

export const { setSchedule, updateOffDays, addOffDay, clearSchedule } = scheduleSlice.actions
export default scheduleSlice.reducer