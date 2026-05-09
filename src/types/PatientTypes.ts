export type Gender = 'Male' | 'Female' | 'Other'

export interface Patient {
  id: string
  name: string
  age: number
  gender: Gender
  phone: string
  email?: string
  bloodGroup: string
  address: string
  lastVisit?: string
}