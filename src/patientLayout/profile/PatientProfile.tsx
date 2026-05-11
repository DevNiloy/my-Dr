import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { User, Mail, Phone, Award, Save } from "lucide-react";

export default function PatientProfile() {
  const patient = useAppSelector((state) => state.patients.patients[0]);

  const [edit, setEdit] = useState(false);

  const [name, setName] = useState(patient?.name || "John Doe");
  const [email, setEmail] = useState(patient?.email || "patient@gmail.com");
  const [phone, setPhone] = useState(patient?.phone || "+8801XXXXXXXXX");
  const [age, setAge] = useState(patient?.age || 25);
  const [bloodGroup, setBloodGroup] = useState(patient?.bloodGroup || "O+");
  const [address, setAddress] = useState(
    patient?.address || "Dhaka, Bangladesh",
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Profile</h1>
          <p className="text-sm text-gray-500">
            Manage your personal information
          </p>
        </div>

        <button
          onClick={() => setEdit(!edit)}
          className="bg-black text-white px-5 py-2 rounded-xl flex items-center gap-2"
        >
          {edit ? (
            <>
              <Save size={16} />
              Save
            </>
          ) : (
            "Edit Profile"
          )}
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white border rounded-3xl p-6 space-y-5">
        {/* NAME */}
        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          {edit ? (
            <input
              className="w-full border p-2 rounded-xl mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="font-semibold flex items-center gap-2 mt-1">
              <User size={16} />
              {name}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-gray-500">Email</label>
          {edit ? (
            <input
              className="w-full border p-2 rounded-xl mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <p className="flex items-center gap-2 mt-1">
              <Mail size={16} />
              {email}
            </p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="text-sm text-gray-500">Phone</label>
          {edit ? (
            <input
              className="w-full border p-2 rounded-xl mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          ) : (
            <p className="flex items-center gap-2 mt-1">
              <Phone size={16} />
              {phone}
            </p>
          )}
        </div>

        {/* AGE + BLOOD */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Age</label>
            {edit ? (
              <input
                type="number"
                className="w-full border p-2 rounded-xl mt-1"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            ) : (
              <p className="mt-1">{age}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500">Blood Group</label>
            {edit ? (
              <input
                className="w-full border p-2 rounded-xl mt-1"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              />
            ) : (
              <p className="mt-1 flex items-center gap-2">
                <Award size={16} />
                {bloodGroup}
              </p>
            )}
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm text-gray-500">Address</label>
          {edit ? (
            <textarea
              className="w-full border p-2 rounded-xl mt-1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          ) : (
            <p className="mt-1">{address}</p>
          )}
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Appointments</p>
          <h2 className="text-2xl font-bold">8</h2>
        </div>

        <div className="bg-green-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Reports</p>
          <h2 className="text-2xl font-bold">12</h2>
        </div>

        <div className="bg-purple-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-500">Prescriptions</p>
          <h2 className="text-2xl font-bold">5</h2>
        </div>
      </div>
    </div>
  );
}
