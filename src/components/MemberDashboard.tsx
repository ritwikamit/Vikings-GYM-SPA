import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { membersAPI } from "../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Smile, 
  Wallet, 
  QrCode, 
  Calendar, 
  Dumbbell, 
  Utensils, 
  CreditCard, 
  User as UserIcon, 
  Clock, 
  Activity, 
  Award, 
  CheckCircle, 
  TrendingUp, 
  AlertCircle,
  FileText,
  ShieldCheck,
  Zap,
  Flame,
  HeartPulse
} from "lucide-react";

export default function MemberDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "attendance" | "workouts" | "diet" | "payments" | "profile">("overview");
  const [showQRModal, setShowQRModal] = useState(false);

  // Fetch Member Profile
  const { data: member, isLoading: isMemberLoading } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      try {
        const res = await membersAPI.getById("me");
        return res.data?.data || null;
      } catch (err) {
        return null;
      }
    },
    enabled: !!user,
  });

  const memberId = member?.id;

  // Fetch Membership Plan
  const { data: membership } = useQuery({
    queryKey: ["my-membership", memberId],
    queryFn: async () => {
      if (!memberId) return null;
      const res = await membersAPI.getMembership(memberId);
      return res.data?.data || null;
    },
    enabled: !!memberId,
  });

  // Fetch Attendance Log
  const { data: attendanceList = [], isLoading: isAttendanceLoading } = useQuery({
    queryKey: ["my-attendance", memberId],
    queryFn: async () => {
      if (!memberId) return [];
      const res = await membersAPI.getAttendance(memberId);
      return res.data?.data || [];
    },
    enabled: !!memberId,
  });

  // Fetch Payments History
  const { data: paymentsList = [], isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["my-payments", memberId],
    queryFn: async () => {
      if (!memberId) return [];
      const res = await membersAPI.getPayments(memberId);
      return res.data?.data || [];
    },
    enabled: !!memberId,
  });

  // Fetch Assigned Workouts
  const { data: workoutsList = [], isLoading: isWorkoutsLoading } = useQuery({
    queryKey: ["my-workouts", memberId],
    queryFn: async () => {
      if (!memberId) return [];
      const res = await membersAPI.getWorkouts(memberId);
      return res.data?.data || [];
    },
    enabled: !!memberId,
  });

  // Fetch Assigned Diet Plans
  const { data: dietList = [], isLoading: isDietLoading } = useQuery({
    queryKey: ["my-diet", memberId],
    queryFn: async () => {
      if (!memberId) return [];
      const res = await membersAPI.getDiet(memberId);
      return res.data?.data || [];
    },
    enabled: !!memberId,
  });

  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    address: "",
    medicalConditions: "",
  });

  React.useEffect(() => {
    if (member) {
      setProfileForm({
        name: member?.name || "",
        phone: member?.phone || "",
        gender: member?.gender || "",
        dob: member?.dob || "",
        bloodGroup: member?.bloodGroup || "",
        height: member?.height ? String(member.height) : "",
        weight: member?.weight ? String(member.weight) : "",
        fitnessGoal: member?.fitnessGoal || "",
        emergencyContactName: member?.emergencyContactName || "",
        emergencyContactPhone: member?.emergencyContactPhone || "",
        address: member?.address || "",
        medicalConditions: member?.medicalConditions || "",
      });
    }
  }, [member]);

  const updateProfileMutation = useMutation({
    mutationFn: (payload: object) => membersAPI.update("me", payload),
    onSuccess: () => {
      setEditMode(false);
      setSaveMessage("Profile updated successfully.");
      setTimeout(() => setSaveMessage(""), 3500);
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (err: any) => {
      setSaveMessage(err?.response?.data?.message || "Failed to save profile changes.");
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage("");
    updateProfileMutation.mutate({
      name: profileForm.name,
      phone: profileForm.phone,
      gender: profileForm.gender,
      dob: profileForm.dob,
      bloodGroup: profileForm.bloodGroup,
      height: profileForm.height ? Number(profileForm.height) : 0,
      weight: profileForm.weight ? Number(profileForm.weight) : 0,
      fitnessGoal: profileForm.fitnessGoal,
      emergencyContactName: profileForm.emergencyContactName,
      emergencyContactPhone: profileForm.emergencyContactPhone,
      address: profileForm.address,
      medicalConditions: profileForm.medicalConditions,
    });
  };

  if (isMemberLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500 border-r-2" />
        <span className="font-mono text-xs text-red-500 font-bold uppercase tracking-widest animate-pulse">
          LOADING WARRIOR CONSOLE...
        </span>
      </div>
    );
  }

  const displayName = member?.name || user?.name || "Warrior Member";
  const displayEmail = member?.email || user?.email || "";
  const walletCredits = member?.wallet_balance || member?.walletCredits || 0;
  const qrCodeData = member?.qr_code || member?.qrCode || "";
  const memberCode = member?.member_id || member?.memberId || `MEM-${user?.id?.substring(0, 6) || "000"}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Profile Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-red-950/40 p-6 rounded-xl border border-red-950/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Member Info */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 shrink-0 shadow-lg shadow-red-950/50">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <Smile className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">{displayName}</h1>
                <span className="bg-red-600/20 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-red-900/50 uppercase">
                  {membership?.plan_name || "MEMBER"}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-3">
                <span>ID: <strong className="text-white font-bold">{memberCode}</strong></span>
                <span>•</span>
                <span>{displayEmail}</span>
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Wallet Metric */}
            <div className="bg-black/60 border border-neutral-800 px-4 py-2.5 rounded-lg flex items-center gap-3">
              <Wallet className="text-amber-500 w-5 h-5 shrink-0" />
              <div>
                <span className="text-[9px] text-gray-500 uppercase font-mono font-bold block">VIKINGS WALLET</span>
                <span className="text-sm font-black text-white font-mono">₹{walletCredits}</span>
              </div>
            </div>

            {/* QR Pass Button */}
            <button
              onClick={() => setShowQRModal(true)}
              className="bg-red-600 hover:bg-red-700 text-black font-mono font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-red-900/20 uppercase"
            >
              <QrCode className="w-4 h-4" />
              <span>ENTRY PASS</span>
            </button>
          </div>
        </div>

        {!member && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-900/40 rounded-lg text-amber-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Self-registered account detected. Visit reception or contact staff to activate your physical membership profile and plan.</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-850 overflow-x-auto pb-1 font-mono text-xs scrollbar-none">
        {[
          { id: "overview", label: "OVERVIEW", icon: Activity },
          { id: "attendance", label: "ATTENDANCE", icon: Clock },
          { id: "workouts", label: "WORKOUT PLAN", icon: Dumbbell },
          { id: "diet", label: "DIET & NUTRITION", icon: Utensils },
          { id: "payments", label: "PAYMENTS", icon: CreditCard },
          { id: "profile", label: "MY PROFILE", icon: UserIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-bold transition-all uppercase whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-red-600 text-black shadow-md shadow-red-900/20"
                  : "text-gray-400 hover:text-white hover:bg-neutral-900/60"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900/50 border border-neutral-850 p-5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
                <span>MEMBERSHIP PLAN</span>
                <Award className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-xl font-black text-white">{membership?.plan_name || "Active Tier"}</div>
              <p className="text-[11px] text-gray-500 font-mono">
                {membership?.end_date ? `Expires: ${membership.end_date}` : "Status: Active Member"}
              </p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-850 p-5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
                <span>GYM VISITS</span>
                <Clock className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-white">{attendanceList.length} Check-ins</div>
              <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Recorded in System
              </p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-850 p-5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
                <span>WORKOUT ROUTINES</span>
                <Dumbbell className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-white">{workoutsList.length} Active Plans</div>
              <p className="text-[11px] text-gray-500 font-mono">Assigned by Personal Trainer</p>
            </div>

            <div className="bg-neutral-900/50 border border-neutral-850 p-5 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-gray-400 text-xs font-mono">
                <span>MEAL PLANS</span>
                <Utensils className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-white">{dietList.length} Prescribed</div>
              <p className="text-[11px] text-gray-500 font-mono">Tailored Nutrition Protocol</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick QR Entry Card */}
            <div className="bg-neutral-900/50 border border-neutral-850 p-6 rounded-xl text-center space-y-4 flex flex-col justify-center">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest block">
                CONTACTLESS ENTRY PASS
              </span>
              <div className="bg-white p-4 rounded-xl inline-block mx-auto shadow-xl">
                {qrCodeData ? (
                  <img src={qrCodeData} alt="Member QR Code" className="w-36 h-36 mx-auto" />
                ) : (
                  <QrCode className="w-36 h-36 text-black mx-auto" />
                )}
              </div>
              <div>
                <span className="block text-xs font-mono font-bold text-white uppercase">{displayName}</span>
                <span className="text-[10px] font-mono text-gray-500">Scan at front desk scanner for entry</span>
              </div>
            </div>

            {/* Recent Workout Preview */}
            <div className="lg:col-span-2 bg-neutral-900/50 border border-neutral-850 p-6 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-red-500" />
                  CURRENT WORKOUT PROGRAM
                </h3>
                <button
                  onClick={() => setActiveTab("workouts")}
                  className="text-xs text-red-500 hover:text-red-400 font-mono font-bold"
                >
                  VIEW ALL →
                </button>
              </div>

              {workoutsList.length > 0 ? (
                <div className="space-y-3">
                  {workoutsList.slice(0, 2).map((w: any, idx: number) => (
                    <div key={idx} className="bg-black/50 border border-neutral-800 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-white">{w.title || w.name || "Strength & Conditioning"}</span>
                        <span className="text-[10px] font-mono bg-red-600/20 text-red-400 px-2 py-0.5 rounded uppercase">
                          {w.level || "ALL LEVELS"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{w.description || "Follow assigned set/rep protocol."}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500 font-mono text-xs space-y-2">
                  <Flame className="w-8 h-8 mx-auto text-neutral-700" />
                  <p>No custom workout program assigned yet.</p>
                  <p className="text-[10px] text-gray-600">Ask your personal trainer at Vikings Gym to assign your routine.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE TAB */}
      {activeTab === "attendance" && (
        <div className="bg-neutral-900/50 border border-neutral-850 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-500" />
                ATTENDANCE & CHECK-IN HISTORY
              </h2>
              <p className="text-xs text-gray-400 font-mono">Track your daily gym visits and check-in times</p>
            </div>
            <div className="bg-black/60 border border-neutral-800 px-3 py-1.5 rounded text-xs font-mono text-emerald-400 font-bold">
              TOTAL VISITS: {attendanceList.length}
            </div>
          </div>

          {isAttendanceLoading ? (
            <div className="text-center py-10 font-mono text-xs text-gray-500">Loading attendance log...</div>
          ) : attendanceList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-gray-500 uppercase bg-black/40">
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">CHECK-IN TIME</th>
                    <th className="py-3 px-4">CHECK-OUT TIME</th>
                    <th className="py-3 px-4">ENTRY METHOD</th>
                    <th className="py-3 px-4">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850">
                  {attendanceList.map((log: any, i: number) => (
                    <tr key={i} className="hover:bg-neutral-850/40 text-gray-300">
                      <td className="py-3 px-4 font-bold text-white">{log.date || log.check_in?.substring(0, 10) || "N/A"}</td>
                      <td className="py-3 px-4 text-emerald-400">{log.check_in_time || log.check_in?.substring(11, 16) || "—"}</td>
                      <td className="py-3 px-4 text-gray-400">{log.check_out_time || log.check_out?.substring(11, 16) || "—"}</td>
                      <td className="py-3 px-4 uppercase text-gray-400">{log.method || "QR Code"}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-900/40 uppercase">
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 space-y-2 text-gray-500 font-mono">
              <Clock className="w-10 h-10 mx-auto text-neutral-700" />
              <p className="text-sm text-gray-400 font-bold">No Attendance Records Yet</p>
              <p className="text-xs">Scan your QR entry pass at the reception desk scanner during your next visit.</p>
            </div>
          )}
        </div>
      )}

      {/* WORKOUTS TAB */}
      {activeTab === "workouts" && (
        <div className="bg-neutral-900/50 border border-neutral-850 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-red-500" />
                MY WORKOUT PROGRAM
              </h2>
              <p className="text-xs text-gray-400 font-mono">Tailored exercise schedules and routine breakdowns</p>
            </div>
            <div className="bg-black/60 border border-neutral-800 px-3 py-1.5 rounded text-xs font-mono text-red-400 font-bold">
              PROGRAMS: {workoutsList.length}
            </div>
          </div>

          {isWorkoutsLoading ? (
            <div className="text-center py-10 font-mono text-xs text-gray-500">Loading workout plan...</div>
          ) : workoutsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workoutsList.map((w: any, idx: number) => (
                <div key={idx} className="bg-black/60 border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
                    <span className="text-base font-bold text-white font-mono">{w.title || w.name || `Workout Plan #${idx + 1}`}</span>
                    <span className="text-[10px] font-mono bg-red-600/20 text-red-400 px-2 py-0.5 rounded border border-red-900/50 uppercase">
                      {w.goal || "HYPERTROPHY"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400">{w.description || "Follow the structured exercises below."}</p>

                  {/* Exercise Items if available */}
                  {Array.isArray(w.exercises) && w.exercises.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-mono font-bold text-gray-500 uppercase block">EXERCISES PROTOCOL</span>
                      {w.exercises.map((ex: any, eIdx: number) => (
                        <div key={eIdx} className="bg-neutral-900/80 p-2.5 rounded border border-neutral-850 flex justify-between items-center text-xs">
                          <span className="font-bold text-white">{ex.name || ex.exercise_name}</span>
                          <span className="font-mono text-red-400 text-[11px]">{ex.sets || 3} Sets × {ex.reps || 12} Reps</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-gray-500 bg-neutral-900/40 p-3 rounded text-center">
                      3–4 Sets per exercise • Rest 60s between sets
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3 text-gray-500 font-mono">
              <Dumbbell className="w-12 h-12 mx-auto text-neutral-700" />
              <p className="text-sm text-gray-300 font-bold">No Custom Workout Assigned</p>
              <p className="text-xs max-w-md mx-auto">Your personal trainer has not assigned a workout plan to your profile yet. Ask your trainer to construct a personalized plan.</p>
            </div>
          )}
        </div>
      )}

      {/* DIET TAB */}
      {activeTab === "diet" && (
        <div className="bg-neutral-900/50 border border-neutral-850 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-500" />
                DIET & NUTRITION PROTOCOL
              </h2>
              <p className="text-xs text-gray-400 font-mono">Daily meal schedules and targeted macronutrients</p>
            </div>
          </div>

          {isDietLoading ? (
            <div className="text-center py-10 font-mono text-xs text-gray-500">Loading diet protocol...</div>
          ) : dietList.length > 0 ? (
            <div className="space-y-6">
              {dietList.map((d: any, idx: number) => (
                <div key={idx} className="bg-black/60 border border-neutral-800 rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-850 pb-3">
                    <div>
                      <h3 className="text-base font-bold text-white font-mono">{d.title || d.name || "Daily Meal Plan"}</h3>
                      <span className="text-xs text-gray-400 font-mono">Target: {d.target_calories || d.calories || "2,200"} kcal/day</span>
                    </div>
                    <div className="flex gap-2 text-[10px] font-mono">
                      <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded border border-amber-900/40">
                        PROTEIN: {d.protein || "140"}g
                      </span>
                      <span className="bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-900/40">
                        CARBS: {d.carbs || "200"}g
                      </span>
                      <span className="bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded border border-rose-900/40">
                        FATS: {d.fats || "65"}g
                      </span>
                    </div>
                  </div>

                  {/* Meals Schedule */}
                  {Array.isArray(d.meals) && d.meals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {d.meals.map((meal: any, mIdx: number) => (
                        <div key={mIdx} className="bg-neutral-900/70 p-3 rounded-lg border border-neutral-850 space-y-1">
                          <div className="flex justify-between items-center text-xs font-mono font-bold text-amber-400">
                            <span>{meal.name || meal.meal_type || `Meal #${mIdx + 1}`}</span>
                            <span className="text-gray-500 text-[10px]">{meal.time || ""}</span>
                          </div>
                          <p className="text-xs text-gray-300">{meal.items || meal.description || "Balanced meal portion."}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">{d.description || "Follow nutrition guideline as prescribed."}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3 text-gray-500 font-mono">
              <Utensils className="w-12 h-12 mx-auto text-neutral-700" />
              <p className="text-sm text-gray-300 font-bold">No Custom Diet Plan Assigned</p>
              <p className="text-xs max-w-md mx-auto">Your nutritionist or trainer has not prescribed a diet plan yet. Request a meal schedule at Vikings Gym reception.</p>
            </div>
          )}
        </div>
      )}

      {/* PAYMENTS TAB */}
      {activeTab === "payments" && (
        <div className="bg-neutral-900/50 border border-neutral-850 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                PAYMENTS & BILLING HISTORY
              </h2>
              <p className="text-xs text-gray-400 font-mono">Invoices, transaction receipts, and subscription charges</p>
            </div>
          </div>

          {isPaymentsLoading ? (
            <div className="text-center py-10 font-mono text-xs text-gray-500">Loading payment history...</div>
          ) : paymentsList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-800 text-gray-500 uppercase bg-black/40">
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">INVOICE / ID</th>
                    <th className="py-3 px-4">DESCRIPTION</th>
                    <th className="py-3 px-4">METHOD</th>
                    <th className="py-3 px-4">AMOUNT</th>
                    <th className="py-3 px-4">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850">
                  {paymentsList.map((p: any, i: number) => (
                    <tr key={i} className="hover:bg-neutral-850/40 text-gray-300">
                      <td className="py-3 px-4">{p.created_at?.substring(0, 10) || p.date || "N/A"}</td>
                      <td className="py-3 px-4 font-bold text-white">{p.invoice_id || p.id?.substring(0, 8) || "INV-001"}</td>
                      <td className="py-3 px-4 text-gray-300">{p.description || p.plan_name || "Gym Membership Plan"}</td>
                      <td className="py-3 px-4 uppercase text-gray-400">{p.method || p.payment_method || "Razorpay"}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">₹{p.amount || 0}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-900/40 uppercase">
                          {p.status || "SUCCESS"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 space-y-2 text-gray-500 font-mono">
              <CreditCard className="w-10 h-10 mx-auto text-neutral-700" />
              <p className="text-sm text-gray-300 font-bold">No Payment Receipts Found</p>
              <p className="text-xs">Your payment invoices and billing statements will appear here after transactions.</p>
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="bg-neutral-900/50 border border-neutral-850 rounded-xl p-6 space-y-6">
          <div className="border-b border-neutral-800 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-red-500" />
                MY WARRIOR PROFILE
              </h2>
              <p className="text-xs text-gray-400 font-mono">Edit your personal metrics, health details, and contact info</p>
            </div>
            <div className="flex gap-2">
              {!editMode ? (
                <button
                  onClick={() => { setEditMode(true); setSaveMessage(""); }}
                  className="bg-red-600 hover:bg-red-700 text-black font-mono font-bold text-[11px] px-4 py-2 rounded uppercase transition-all cursor-pointer"
                >
                  EDIT PROFILE
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-neutral-800 hover:bg-neutral-700 text-gray-300 font-mono font-bold text-[11px] px-4 py-2 rounded uppercase transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateProfileMutation.mutate({
                      name: profileForm.name,
                      phone: profileForm.phone,
                      gender: profileForm.gender,
                      dob: profileForm.dob,
                      bloodGroup: profileForm.bloodGroup,
                      height: profileForm.height ? Number(profileForm.height) : 0,
                      weight: profileForm.weight ? Number(profileForm.weight) : 0,
                      fitnessGoal: profileForm.fitnessGoal,
                      emergencyContactName: profileForm.emergencyContactName,
                      emergencyContactPhone: profileForm.emergencyContactPhone,
                      address: profileForm.address,
                      medicalConditions: profileForm.medicalConditions,
                    })}
                    disabled={updateProfileMutation.isPending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-black font-mono font-bold text-[11px] px-4 py-2 rounded uppercase transition-all cursor-pointer disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {saveMessage && (
            <div className="p-3 bg-emerald-600/10 border border-emerald-800/40 rounded text-xs text-emerald-400 font-mono">
              {saveMessage}
            </div>
          )}
          {updateProfileMutation.isError && (
            <div className="p-3 bg-red-500/10 border border-red-800/40 rounded text-xs text-red-400 font-mono">
              {saveMessage}
            </div>
          )}

          {!editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="bg-black/60 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest border-b border-neutral-850 pb-2">
                  PERSONAL INFORMATION
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-500">FULL NAME:</span><span className="text-white font-bold">{member?.name || displayName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">EMAIL:</span><span className="text-white">{member?.email || displayEmail}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">PHONE:</span><span className="text-white">{member?.phone || user?.phone || "Not provided"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">GENDER:</span><span className="text-white uppercase">{member?.gender || "Unspecified"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">DATE OF BIRTH:</span><span className="text-white">{member?.dob || "Not provided"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">ADDRESS:</span><span className="text-white">{member?.address || "Not provided"}</span></div>
                </div>
              </div>
              <div className="bg-black/60 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest border-b border-neutral-850 pb-2">
                  FITNESS & HEALTH METRICS
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-500">BLOOD GROUP:</span><span className="text-white font-bold">{member?.bloodGroup || member?.blood_group || "O+"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">HEIGHT / WEIGHT:</span><span className="text-white">{member?.height || "—"} cm / {member?.weight || "—"} kg</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">FITNESS GOAL:</span><span className="text-emerald-400 uppercase font-bold">{member?.fitnessGoal || member?.fitness_goal || "General Fitness"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">EMERGENCY CONTACT:</span><span className="text-white">{member?.emergencyContactName || member?.emergency_contact_name || "On file"} ({member?.emergencyContactPhone || member?.emergency_contact_phone || "N/A"})</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">MEDICAL NOTES:</span><span className="text-white">{member?.medicalConditions || "None on file"}</span></div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="bg-black/60 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest border-b border-neutral-850 pb-2">
                  PERSONAL INFORMATION
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-500 mb-1">FULL NAME</label>
                    <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">PHONE</label>
                    <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="+91 1234567890" className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">GENDER</label>
                    <select value={profileForm.gender} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none">
                      <option value="">Unspecified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">DATE OF BIRTH</label>
                    <input type="date" value={profileForm.dob} onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">ADDRESS</label>
                    <input value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="bg-black/60 border border-neutral-800 rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest border-b border-neutral-850 pb-2">
                  FITNESS & HEALTH METRICS
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-500 mb-1">BLOOD GROUP</label>
                    <input value={profileForm.bloodGroup} onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })} placeholder="e.g. O+" className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-500 mb-1">HEIGHT (cm)</label>
                      <input type="number" value={profileForm.height} onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })} placeholder="e.g. 175" className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-gray-500 mb-1">WEIGHT (kg)</label>
                      <input type="number" value={profileForm.weight} onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })} placeholder="e.g. 70" className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">FITNESS GOAL</label>
                    <select value={profileForm.fitnessGoal} onChange={(e) => setProfileForm({ ...profileForm, fitnessGoal: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none">
                      <option value="General Fitness">General Fitness</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Endurance">Endurance</option>
                      <option value="Strength">Strength</option>
                      <option value="Rehabilitation">Rehabilitation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">EMERGENCY CONTACT NAME</label>
                    <input value={profileForm.emergencyContactName} onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">EMERGENCY CONTACT PHONE</label>
                    <input value={profileForm.emergencyContactPhone} onChange={(e) => setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">MEDICAL CONDITIONS</label>
                    <textarea value={profileForm.medicalConditions} onChange={(e) => setProfileForm({ ...profileForm, medicalConditions: e.target.value })} rows={2} className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-white focus:border-red-600 focus:outline-none" />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* QR MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-950/60 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white font-mono text-sm"
            >
              ✕
            </button>
            <span className="text-xs font-mono font-bold text-red-500 tracking-widest block uppercase">
              VIKINGS CONTACTLESS ENTRY PASS
            </span>
            <div className="bg-white p-4 rounded-xl inline-block mx-auto shadow-2xl">
              {qrCodeData ? (
                <img src={qrCodeData} alt="Member QR Code" className="w-48 h-48 mx-auto" />
              ) : (
                <QrCode className="w-48 h-48 text-black mx-auto" />
              )}
            </div>
            <div>
              <h3 className="text-base font-black text-white">{displayName}</h3>
              <p className="text-xs font-mono text-gray-400">MEMBER ID: {memberCode}</p>
            </div>
            <button
              onClick={() => setShowQRModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-black font-mono font-bold text-xs py-2.5 rounded-lg uppercase"
            >
              CLOSE PASS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
