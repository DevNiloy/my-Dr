import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { setSchedule } from "../../redux/feature/doctor/scheduleSlice"
 

export default function DoctorAvailability() {
  const dispatch = useAppDispatch()
  const schedule = useAppSelector(state => state.schedule.schedule)

  const [startTime, setStartTime] = useState(schedule?.startTime || "09:00")
  const [endTime, setEndTime] = useState(schedule?.endTime || "17:00")
  const [slotDuration, setSlotDuration] = useState(schedule?.slotDuration || 20)
  const [maxPerDay, setMaxPerDay] = useState(schedule?.maxAppointmentsPerDay || 20)
  const [offDays, setOffDays] = useState<string[]>(schedule?.offDays || [])
  const [workingDays, setWorkingDays] = useState<string[]>(schedule?.workingDays || [])

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day))
    } else {
      setWorkingDays([...workingDays, day])
    }
  }

  const addOffDay = (date: string) => {
    if (!offDays.includes(date)) {
      setOffDays([...offDays, date])
    }
  }

  const removeOffDay = (date: string) => {
    setOffDays(offDays.filter(d => d !== date))
  }

  const handleSave = () => {
    dispatch(
      setSchedule({
        doctorId: "d1",
        startTime,
        endTime,
        slotDuration,
        maxAppointmentsPerDay: maxPerDay,
        workingDays,
        offDays
      })
    )
    alert("Schedule saved")
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="p-4 lg:p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Doctor Availability Setup
      </h1>

      {/* TIME SETTINGS */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">

        <div className="flex gap-4">
          <div>
            <p className="text-sm">Start Time</p>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="border p-2 rounded"
            />
          </div>

          <div>
            <p className="text-sm">End Time</p>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <p className="text-sm">Slot Duration (min)</p>
          <input
            type="number"
            value={slotDuration}
            onChange={e => setSlotDuration(Number(e.target.value))}
            className="border p-2 rounded w-32"
          />
        </div>

        <div>
          <p className="text-sm">Max Appointments Per Day</p>
          <input
            type="number"
            value={maxPerDay}
            onChange={e => setMaxPerDay(Number(e.target.value))}
            className="border p-2 rounded w-32"
          />
        </div>

      </div>

      {/* WORKING DAYS */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="font-bold mb-3">Working Days</h2>

        <div className="flex flex-wrap gap-2">
          {days.map(day => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded-full border ${
                workingDays.includes(day)
                  ? "bg-green-600 text-white"
                  : "bg-white"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* OFF DAYS */}
      <div className="bg-white border rounded-2xl p-6 space-y-3">

        <h2 className="font-bold">Off Days</h2>

        <input
          type="date"
          onChange={e => addOffDay(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="space-y-2">
          {offDays.map(d => (
            <div key={d} className="flex justify-between border p-2 rounded">
              <span>{d}</span>
              <button
                onClick={() => removeOffDay(d)}
                className="text-red-500"
              >
                remove
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded-xl"
      >
        Save Schedule
      </button>

    </div>
  )
}