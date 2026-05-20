import { useState, useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import {
  setSchedule,
  type DaySchedule,
} from "../../redux/feature/doctor/scheduleSlice";
import {
  Clock,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  CalendarX,
  Settings2,
  ListRestart,
  CreditCard,
  // ExternalLink,
  // ChevronRight,
} from "lucide-react";
import {
  useGetDoctorMeQuery,
  useUpdateDoctorAvailabilityMutation,
} from "../../redux/api/doctorApi";
import { useCreateStripeAccountMutation } from "../../redux/api/paymentApi";
import { toast } from "react-toastify";

const DAYS_OF_WEEK = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function DoctorAvailability() {
  const dispatch = useAppDispatch();

  // 1. Fetch live data from backend
  const {
    data: doctorData,
    isLoading: isFetching,
    isError,
  } = useGetDoctorMeQuery({});
  const [updateAvailability, { isLoading: isUpdating }] =
    useUpdateDoctorAvailabilityMutation();
  const [connectStripe, { isLoading: isConnecting }] =
    useCreateStripeAccountMutation();

  const isStripeConnected = doctorData?.data?.isStripeConnected;
  // const stripeAccountId = doctorData?.data?.stripeAccountId;

  // 2. Local state for form management
  const [slotDuration, setSlotDuration] = useState(30);
  const [maxPerDay, setMaxPerDay] = useState(20);
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(
    DAYS_OF_WEEK.map((day) => ({
      day,
      isActive: day !== "Friday",
      startTime: "09:00",
      endTime: "17:00",
    })),
  );
  const [offDays, setOffDays] = useState<string[]>([]);
  const [newOffDay, setNewOffDay] = useState("");

  // 3. Populate state when data arrives
  useEffect(() => {
    if (doctorData?.data?.availability) {
      const { availability } = doctorData.data;
      if (availability.slotDurationMinutes)
        setSlotDuration(availability.slotDurationMinutes);
      if (availability.maxAppointmentsPerDay)
        setMaxPerDay(availability.maxAppointmentsPerDay);
      if (
        availability.weeklySchedule &&
        availability.weeklySchedule.length > 0
      ) {
        setWeeklySchedule(availability.weeklySchedule);
      }
      if (availability.offDays) {
        setOffDays(availability.offDays);
      }
    }
  }, [doctorData]);

  const handleToggleDay = (dayName: string) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === dayName ? { ...item, isActive: !item.isActive } : item,
      ),
    );
  };

  const handleTimeChange = (
    dayName: string,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === dayName ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSave = async () => {
    try {
      const availabilityPayload = {
        weeklySchedule,
        slotDurationMinutes: slotDuration,
        maxAppointmentsPerDay: maxPerDay,
        offDays,
      };

      const response = await updateAvailability({
        id: doctorData.data._id,
        availability: availabilityPayload,
      }).unwrap();

      if (response.success) {
        // Update Redux for global consistency
        dispatch(
          setSchedule({
            doctorId: doctorData.data._id,
            weeklySchedule,
            slotDuration,
            maxAppointmentsPerDay: maxPerDay,
            offDays,
          }),
        );
        toast.success("Availability preferences updated successfully!");
      }
    } catch (err: any) {
      toast.error(
        err.data?.message || "Failed to update availability. Please try again.",
      );
    }
  };

  const addOffDay = async () => {
    if (newOffDay && !offDays.includes(newOffDay)) {
      const updatedOffDays = [...offDays, newOffDay];
      setOffDays(updatedOffDays);
      setNewOffDay("");

      // Auto-save for better reliability
      try {
        await updateAvailability({
          id: doctorData.data._id,
          availability: {
            weeklySchedule,
            slotDurationMinutes: slotDuration,
            maxAppointmentsPerDay: maxPerDay,
            offDays: updatedOffDays,
          },
        }).unwrap();
        toast.info(`Added ${newOffDay} as an off day.`);
      } catch (err) {
        toast.error("Failed to sync closure date");
      }
    }
  };

  const removeOffDay = async (date: string) => {
    const updatedOffDays = offDays.filter((d) => d !== date);
    setOffDays(updatedOffDays);

    try {
      await updateAvailability({
        id: doctorData.data._id,
        availability: {
          weeklySchedule,
          slotDurationMinutes: slotDuration,
          maxAppointmentsPerDay: maxPerDay,
          offDays: updatedOffDays,
        },
      }).unwrap();
      toast.warn("Closure date removed");
    } catch (err) {
      toast.error("Failed to sync change");
    }
  };

  const handleConnectStripe = async () => {
    try {
      const res = await connectStripe({}).unwrap();
      if (res.success && res.url) {
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to start Stripe onboarding");
    }
  };

  if (isFetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
        <p className="font-bold tracking-widest uppercase text-xs">
          Syncing Schedule...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-rose-500">
        <AlertCircle size={48} />
        <p className="font-black text-xl">System Synchronization Error</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-rose-50 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-100 transition-all"
        >
          <ListRestart size={18} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Stripe Connection Status */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
        {!isStripeConnected ? (
          <div className="bg-linear-to-r from-red-500 to-red-600 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 flex-1">
              <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md shrink-0">
                <CreditCard size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  Payment Setup Required
                </h2>
                <p className="text-red-100 font-medium text-sm mt-1">
                  Connect your Stripe account to start receiving consultation
                  fees. Once verified, you'll be visible to all patients.
                </p>
              </div>
            </div>
            <button
              onClick={handleConnectStripe}
              disabled={isConnecting}
              className="px-8 py-4 bg-white text-red-600 rounded-2xl font-black hover:bg-red-50 transition-all flex items-center gap-2 shadow-xl active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isConnecting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <CreditCard size={20} />
              )}
              {isConnecting ? "Setting up..." : "Setup Stripe"}
            </button>
          </div>
        ) : (
          <div className="space-y-4 p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500">
            {doctorData?.data?.isStripeAccountVerified ? (
              <div className="bg-white rounded-2xl p-6 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                      ✓ Verified
                    </p>
                    <h3 className="text-lg font-black text-slate-900">
                      Stripe Account Active
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      You are now public and accepting payments
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                    Status
                  </p>
                  <p className="flex items-center gap-2 font-black text-emerald-600">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                    LIVE
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-amber-600">
                      ⏳ Pending
                    </p>
                    <h3 className="text-lg font-black text-slate-900">
                      Verification in Progress
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Stripe is reviewing your account details
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 1. Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-sky-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sky-100 text-sky-600 rounded-xl">
              <Settings2 size={24} />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
              Availability Setup
            </h1>
          </div>
          <p className="text-sm lg:text-base text-slate-500 font-medium max-w-xl">
            Optimizing your practice flow by managing consultation hours, daily
            caps, and specific time slots.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="relative z-10 flex items-center justify-center gap-2 px-10 py-5 bg-[#0EA5E9] text-white rounded-[1.5rem] font-black shadow-2xl shadow-sky-200 hover:bg-sky-600 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isUpdating ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          <span>{isUpdating ? "Saving..." : "Update Preferences"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Config & Off-Days */}
        <div className="lg:col-span-4 space-y-8">
          {/* Efficiency Metrics */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/20 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-500 shadow-inner">
                <Clock size={20} />
              </div>
              <h2 className="font-black text-slate-800 uppercase text-[12px] tracking-[0.15em]">
                System Metrics
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Slot Interval (Minutes)
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                    className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 transition-all group-hover:bg-white group-hover:border-indigo-100 focus:bg-white focus:border-indigo-400 focus:ring-0"
                  />
                  <Clock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors"
                    size={18}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Daily Patient Cap
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    value={maxPerDay}
                    onChange={(e) => setMaxPerDay(Number(e.target.value))}
                    className="w-full p-4 pl-12 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-slate-700 transition-all group-hover:bg-white group-hover:border-indigo-100 focus:bg-white focus:border-indigo-400 focus:ring-0"
                  />
                  <CheckCircle2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors"
                    size={18}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Off-Day Manager */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg shadow-slate-200/20 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500 shadow-inner">
                <CalendarX size={20} />
              </div>
              <h2 className="font-black text-slate-800 uppercase text-[12px] tracking-[0.15em]">
                Practice Closures
              </h2>
            </div>

            <div className="flex gap-2">
              <input
                type="date"
                value={newOffDay}
                onChange={(e) => setNewOffDay(e.target.value)}
                className="flex-1 p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-rose-500 transition-all"
              />
              <button
                onClick={addOffDay}
                className="w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-rose-500 transition-all active:scale-90"
              >
                <Plus size={24} />
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {offDays.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-slate-300 italic text-sm">
                  <AlertCircle size={16} /> No closures scheduled
                </div>
              ) : (
                offDays.map((date) => (
                  <div
                    key={date}
                    className="flex items-center justify-between p-4 bg-rose-50/50 border border-rose-100 rounded-2xl group animate-in slide-in-from-left-2 duration-300"
                  >
                    <span className="text-sm font-black text-rose-600">
                      {date}
                    </span>
                    <button
                      onClick={() => removeOffDay(date)}
                      className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Schedule */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Operational Blueprint
            </h3>
            <div className="h-px flex-1 bg-slate-100 mx-6" />
          </div>

          <div className="grid grid-cols-1 gap-5">
            {weeklySchedule.map((item) => (
              <div
                key={item.day}
                className={`bg-white p-6 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden relative ${
                  item.isActive
                    ? "border-sky-50 shadow-xl shadow-sky-100/30"
                    : "border-slate-50 opacity-60 grayscale-[0.4]"
                }`}
              >
                {item.isActive && (
                  <div className="absolute top-0 right-0 h-full w-2 bg-sky-500" />
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="flex items-center gap-6">
                    {/* Professional Toggle */}
                    <div
                      onClick={() => handleToggleDay(item.day)}
                      className={`w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-500 ${
                        item.isActive ? "bg-sky-500" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 transform ${
                          item.isActive ? "translate-x-8" : "translate-x-0"
                        }`}
                      />
                    </div>

                    <div>
                      <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                        {item.day}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${item.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            item.isActive
                              ? "text-emerald-500"
                              : "text-slate-400"
                          }`}
                        >
                          {item.isActive ? "Operational" : "Clinic Closed"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.isActive ? (
                    <div className="flex items-center gap-4 bg-slate-50/80 p-2 rounded-[2rem] border border-slate-100 backdrop-blur-sm">
                      <div className="px-6 py-4 rounded-2xl bg-white shadow-sm border border-slate-50 group hover:border-sky-200 transition-all">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter block mb-1">
                          Clinic Start
                        </span>
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) =>
                            handleTimeChange(
                              item.day,
                              "startTime",
                              e.target.value,
                            )
                          }
                          className="bg-transparent border-none p-0 text-xl font-black text-slate-800 focus:ring-0 cursor-pointer"
                        />
                      </div>

                      <div className="text-slate-300 font-black text-xl px-2">
                        →
                      </div>

                      <div className="px-6 py-4 rounded-2xl bg-white shadow-sm border border-slate-50 group hover:border-sky-200 transition-all">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter block mb-1">
                          Clinic End
                        </span>
                        <input
                          type="time"
                          value={item.endTime}
                          onChange={(e) =>
                            handleTimeChange(
                              item.day,
                              "endTime",
                              e.target.value,
                            )
                          }
                          className="bg-transparent border-none p-0 text-xl font-black text-slate-800 focus:ring-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-400 font-bold bg-slate-50/50 px-10 py-6 rounded-[2rem] border border-slate-100 border-dashed italic text-sm">
                      <AlertCircle size={18} />
                      Blocked for Practice
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
