 

export default function Earning() {
   interface Earning {
  id: string
  doctorId: string
  amount: number
  date: string
  patientName: string
  appointmentId: string
}

   const mockEarnings: Earning[] = [
  {
    id: 'e1',
    doctorId: 'd1',
    amount: 500,
    date: '2026-05-10',
    patientName: 'John Doe',
    appointmentId: 'a1'
  },
  {
    id: 'e2',
    doctorId: 'd1',
    amount: 700,
    date: '2026-05-10',
    patientName: 'Alice Brown',
    appointmentId: 'a2'
  },
  {
    id: 'e3',
    doctorId: 'd1',
    amount: 400,
    date: '2026-05-11',
    patientName: 'Rahim Khan',
    appointmentId: 'a3'
  }
]

  const total = mockEarnings.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        Earnings Overview
      </h1>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-green-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <h2 className="text-2xl font-bold text-green-700">
            ${total}
          </h2>
        </div>

        <div className="bg-blue-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Total Appointments</p>
          <h2 className="text-2xl font-bold text-blue-700">
            {mockEarnings.length}
          </h2>
        </div>

        <div className="bg-yellow-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Average Per Patient</p>
          <h2 className="text-2xl font-bold text-yellow-700">
            ${(total / mockEarnings.length).toFixed(0)}
          </h2>
        </div>

      </div>

      {/* EARNING LIST */}
      <div className="bg-white border rounded-2xl p-4">

        <h2 className="font-bold mb-3">
          Transaction History
        </h2>

        <div className="space-y-3">

          {mockEarnings.map(e => (
            <div
              key={e.id}
              className="flex justify-between items-center border-b pb-2"
            >

              <div>
                <p className="font-semibold">
                  {e.patientName}
                </p>
                <p className="text-sm text-gray-500">
                  {e.date}
                </p>
              </div>

              <div className="font-bold text-green-600">
                +${e.amount}
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  )
}