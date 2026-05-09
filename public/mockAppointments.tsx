

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Appointment {
  id: string
  doctorId: string
  patientId: string
  patientName: string
  doctorName: string
  date: string // "2026-05-10"
  time: string // "10:30"
  reason: string
  status: AppointmentStatus
}
export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    doctorId: 'd1',
    patientId: 'p1',
    patientName: 'John Doe',
    doctorName: 'Dr. Smith',
    date: '2026-05-10',
    time: '10:00',
    reason: 'Fever & headache',
    status: 'pending'
  },
  {
    id: 'a2',
    doctorId: 'd1',
    patientId: 'p2',
    patientName: 'Alice Brown',
    doctorName: 'Dr. Smith',
    date: '2026-05-10',
    time: '10:30',
    reason: 'Chest pain',
    status: 'confirmed'
  },
  {
    id: 'a3',
    doctorId: 'd1',
    patientId: 'p3',
    patientName: 'Rahim Khan',
    doctorName: 'Dr. Smith',
    date: '2026-05-11',
    time: '11:00',
    reason: 'Follow-up checkup',
    status: 'completed'
  }
]