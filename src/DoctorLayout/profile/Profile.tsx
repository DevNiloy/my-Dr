import { useState } from "react"
 

export default function Profile() {

  const doctor = {
  name: "Dr. John Smith",
  email: "doctor@gmail.com",
  phone: "+8801XXXXXXXXX",
  specialization: "Cardiologist",
  hospital: "City Medical Hospital"
}


  const [edit, setEdit] = useState(false)

  const [name, setName] = useState(doctor?.name || "Dr. John Smith")
  const [email, setEmail] = useState(doctor?.email || "doctor@gmail.com")
  const [phone, setPhone] = useState(doctor?.phone || "+8801XXXXXXXXX")
  const [specialization, setSpecialization] = useState(
    doctor?.specialization || "Cardiologist"
  )
  const [hospital, setHospital] = useState(
    doctor?.hospital || "City Medical Hospital"
  )

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Doctor Profile
        </h1>

        <button
          onClick={() => setEdit(!edit)}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          {edit ? "Save" : "Edit Profile"}
        </button>

      </div>

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-2xl p-6 space-y-4">

        {/* NAME */}
        <div>
          <p className="text-sm text-gray-500">Full Name</p>

          {edit ? (
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <h2 className="text-lg font-semibold">{name}</h2>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <p className="text-sm text-gray-500">Email</p>

          {edit ? (
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{email}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <p className="text-sm text-gray-500">Phone</p>

          {edit ? (
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{phone}</p>
          )}
        </div>

        {/* SPECIALIZATION */}
        <div>
          <p className="text-sm text-gray-500">Specialization</p>

          {edit ? (
            <input
              value={specialization}
              onChange={e => setSpecialization(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{specialization}</p>
          )}
        </div>

        {/* HOSPITAL */}
        <div>
          <p className="text-sm text-gray-500">Hospital</p>

          {edit ? (
            <input
              value={hospital}
              onChange={e => setHospital(e.target.value)}
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{hospital}</p>
          )}
        </div>

      </div>

      {/* QUICK STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-blue-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Total Patients</p>
          <h2 className="text-2xl font-bold">120</h2>
        </div>

        <div className="bg-green-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Appointments</p>
          <h2 className="text-2xl font-bold">45</h2>
        </div>

        <div className="bg-yellow-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Rating</p>
          <h2 className="text-2xl font-bold">4.8 ⭐</h2>
        </div>

      </div>

    </div>
  )
}