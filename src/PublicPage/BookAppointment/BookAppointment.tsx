import { CalendarDays, Search, Video } from "lucide-react";

const doctors = [
  {
    id: 1,
    name: "Dr. John Smith",
    specialization: "Cardiologist",
    slots: [
      {
        day: "Mon",
        date: "05/11/26",
        times: ["11:15"],
      },
      {
        day: "Tue",
        date: "05/12/26",
        times: [],
      },
      {
        day: "Wed",
        date: "05/13/26",
        times: [],
      },
      {
        day: "Thu",
        date: "05/14/26",
        times: [],
      },
      {
        day: "Fri",
        date: "05/15/26",
        times: [],
      },
    ],
  },

  {
    id: 2,
    name: "Dr. Sarah Wilson",
    specialization: "Neurologist",
    slots: [
      {
        day: "Mon",
        date: "06/29/26",
        times: [],
      },
      {
        day: "Tue",
        date: "06/30/26",
        times: ["10:00", "10:30", "11:00"],
      },
      {
        day: "Wed",
        date: "07/01/26",
        times: ["14:00", "14:15", "14:30"],
      },
      {
        day: "Thu",
        date: "07/02/26",
        times: [],
      },
      {
        day: "Fri",
        date: "07/03/26",
        times: ["10:00", "10:30", "11:00"],
      },
    ],
  },
];

export default function BookAppointment() {
  return (
    <div className="space-y-8 container mx-auto py-10">
      {/* TOP FILTER */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-6 lg:p-8 shadow-lg">
        <div className="grid lg:grid-cols-4 gap-4">
          {/* SPECIALIST */}
          <div>
            <label className="text-white text-sm mb-2 block">
              Specialist / Doctor
            </label>

            <input
              type="text"
              placeholder="Cardiologist"
              className="w-full h-14 rounded-2xl px-4 outline-none bg-white"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="text-white text-sm mb-2 block">City</label>

            <input
              type="text"
              placeholder="e-Visit"
              className="w-full h-14 rounded-2xl px-4 outline-none bg-blue-400/30 text-white placeholder:text-blue-100"
            />
          </div>

          {/* DATE */}
          <div>
            <label className="text-white text-sm mb-2 block">Date</label>

            <div className="relative">
              <input
                type="date"
                className="w-full h-14 rounded-2xl px-4 outline-none bg-white"
              />

              <CalendarDays
                className="absolute right-4 top-4 text-gray-500"
                size={20}
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex items-end">
            <button className="w-full h-14 rounded-2xl bg-pink-500 hover:bg-pink-600 transition text-white font-semibold flex items-center justify-center gap-2 shadow-lg">
              <Search size={18} />
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Available Appointments
        </h1>

        <p className="text-gray-500 mt-1">Book your appointment instantly</p>
      </div>

      {/* CONTENT */}
      <div className="grid xl:grid-cols-[1fr_320px] gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white border rounded-3xl overflow-hidden shadow-sm"
            >
              {/* HEADER */}
              <div className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">
                  👨‍⚕️
                </div>

                <div>
                  <h2 className="text-xl font-bold text-blue-600">
                    {doctor.name}
                  </h2>

                  <p className="text-gray-500">{doctor.specialization}</p>
                </div>
              </div>

              {/* SCHEDULE */}
              <div className="border-t bg-gray-50 overflow-x-auto">
                <div className="min-w-[800px] grid grid-cols-5">
                  {doctor.slots.map((slot, index) => (
                    <div key={index} className="border-r last:border-r-0">
                      {/* DAY */}
                      <div className="bg-slate-100 p-3 text-center border-b">
                        <p className="font-medium text-gray-700">{slot.day}</p>

                        <p className="text-sm text-gray-500">{slot.date}</p>
                      </div>

                      {/* TIMES */}
                      <div className="p-3 min-h-[170px] flex flex-col gap-2">
                        {slot.times.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-sm text-gray-400">
                            No visits
                          </div>
                        ) : (
                          slot.times.map((time, i) => (
                            <button
                              key={i}
                              className="border rounded-full py-2 text-sm hover:bg-blue-500 hover:text-white transition"
                            >
                              {time}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-purple-900 text-white rounded-3xl p-6 h-fit sticky top-5">
          <div className="flex items-center gap-3 mb-5">
            <Video size={26} />

            <h2 className="text-2xl font-bold">Telemedicine</h2>
          </div>

          <ul className="space-y-4 text-sm leading-7">
            <li>• Consult with doctors online</li>

            <li>• Get prescriptions instantly</li>

            <li>• Video call support</li>

            <li>• Upload medical reports</li>

            <li>• Follow-up consultation</li>

            <li>• Secure & private system</li>
          </ul>

          <div className="mt-8 pt-5 border-t border-purple-700 text-xs text-purple-200 leading-6">
            Online consultations help patients connect with doctors quickly and
            securely from anywhere.
          </div>
        </div>
      </div>
    </div>
  );
}
