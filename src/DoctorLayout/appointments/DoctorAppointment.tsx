import { useState } from 'react'
import { mockAppointments } from '../../../public/mockAppointments'

type TabType = 'today' | 'upcoming' | 'cancelled'

export default function DoctorAppointment() {

  const [tab, setTab] = useState<TabType>('today')

  const filteredAppointments = mockAppointments.filter(app => {
    if (tab === 'today') return app.date === '2026-05-10'
    if (tab === 'upcoming') return app.status !== 'cancelled'
    if (tab === 'cancelled') return app.status === 'cancelled'
    return true
  })

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">
          Appointments
        </h1>

        <div className="flex gap-2">

          <button onClick={() => setTab('today')}
            className={`px-3 py-1 rounded-full text-sm border ${
              tab === 'today' ? 'bg-black text-white' : ''
            }`}
          >
            Today
          </button>

          <button onClick={() => setTab('upcoming')}
            className={`px-3 py-1 rounded-full text-sm border ${
              tab === 'upcoming' ? 'bg-black text-white' : ''
            }`}
          >
            Upcoming
          </button>

          <button onClick={() => setTab('cancelled')}
            className={`px-3 py-1 rounded-full text-sm border ${
              tab === 'cancelled' ? 'bg-black text-white' : ''
            }`}
          >
            Cancelled
          </button>

        </div>

      </div>

      {/* LIST */}
      <div className="grid gap-4">

        {filteredAppointments.map(app => (
          <div
            key={app.id}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >

            {/* TOP */}
            <div className="flex justify-between items-center">

              <h2 className="font-bold text-lg">
                {app.patientName}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  app.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : app.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-700'
                    : app.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {app.status}
              </span>

            </div>

            {/* INFO */}
            <p className="text-sm text-gray-500 mt-1">
              Reason: {app.reason}
            </p>

            <div className="mt-2 text-sm text-gray-600 flex justify-between">
              <p>Date: {app.date}</p>
              <p>Time: {app.time} (30 min)</p>
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex gap-3">

              {/* ZOOM BUTTON */}
              <a
                href="https://zoom.us/j/123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700"
              >
                Join Zoom
              </a>

              {/* STATUS BUTTONS */}
              {app.status === 'pending' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm">
                  Accept
                </button>
              )}

              {app.status !== 'cancelled' && (
                <button className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm">
                  Cancel
                </button>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}