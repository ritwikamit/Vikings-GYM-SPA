import React, { useState, useEffect } from "react";
import { membersAPI, membershipsAPI, attendanceAPI, paymentsAPI, leadsAPI } from "../api";
import { StorageManager } from "../data/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  UserRole, 
  Member, 
  Trainer, 
  MembershipPlan, 
  MemberMembership, 
  Attendance, 
  Payment, 
  Lead, 
  Expense, 
  InventoryItem, 
  WorkoutPlan, 
  DietPlan, 
  ProgressRecord, 
  Announcement, 
  Coupon, 
  Equipment, 
  Locker, 
  AuditLog,
  PtSession,
  PtPackage
} from "../types";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Dumbbell, 
  Activity, 
  Users, 
  FolderLock, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Check, 
  Search, 
  ShoppingBag, 
  PlusCircle, 
  Trash2, 
  Printer, 
  FileText, 
  Coins, 
  Calendar, 
  Clock, 
  Cpu, 
  ChevronRight, 
  ChevronLeft, 
  Shuffle, 
  Award, 
  Smile, 
  Megaphone, 
  ShieldAlert,
  Sliders,
  DollarSign,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ERPModulesProps {
  currentUser: User;
  activeTab: string;
  onLogAction: (action: string, module: string) => void;
}

export default function ERPModules({ currentUser, activeTab, onLogAction }: ERPModulesProps) {
  // Common states
  const currentBranchId = "b-aurangabad";
  const queryClient = useQueryClient();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load all reactive data from StorageManager
  
  const { data: members = [] } = useQuery({ queryKey: ["members"], queryFn: () => membersAPI.getAll().then(res => res.data.data) });
  const { data: plans = [] } = useQuery({ queryKey: ["plans"], queryFn: () => membershipsAPI.getPlans().then(res => res.data.data) });
  const { data: memberships = [] } = useQuery({ queryKey: ["memberships"], queryFn: () => membershipsAPI.getAll().then(res => res.data.data) });
  const { data: attendance = [] } = useQuery({ queryKey: ["attendance"], queryFn: () => attendanceAPI.getAll().then(res => res.data.data) });
  const { data: payments = [] } = useQuery({ queryKey: ["payments"], queryFn: () => paymentsAPI.getAll().then(res => res.data.data) });
  const { data: leads = [] } = useQuery({ queryKey: ["leads"], queryFn: () => leadsAPI.getAll().then(res => res.data.data) });
  // Stub out the rest for now since API might not cover everything or we can keep them empty arrays
  const trainers = [];
  const expenses = [];
  const inventory = [];
  const workouts = [];
  const diets = [];
  const lockers = [];
  const equipment = [];
  const coupons = [];
  const auditLogs = [];
  const ptSessions = [];


  const triggerRefresh = () => {
    queryClient.invalidateQueries();
  };

  // 1. RECEPTION & REGISTRATION COMPONENT STATE
  const [receptionSearch, setReceptionSearch] = useState("");
  const [receptionMessage, setReceptionMessage] = useState<{ status: "success" | "error"; text: string } | null>(null);
  
  const [walkinName, setWalkinName] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");
  const [walkinSource, setWalkinSource] = useState<Lead["source"]>("Walk-In");
  const [walkinNotes, setWalkinNotes] = useState("");

  const handleReceptionCheckIn = (memberId: string) => {
    attendanceAPI.checkIn({ memberId, method: "Reception" })
      .then((res) => {
        setReceptionMessage({ status: "success", text: res.data?.message || "Checked in successfully" });
        onLogAction(`Checked in member ID ${memberId} via reception dashboard`, "Attendance");
        triggerRefresh();
      })
      .catch((e) => {
        setReceptionMessage({ status: "error", text: e.response?.data?.message || "Check-in failed" });
      })
      .finally(() => {
        setTimeout(() => setReceptionMessage(null), 5000);
      });
  };

  const handleReceptionCheckOut = (memberId: string) => {
    attendanceAPI.checkOut({ memberId })
      .then((res) => {
        setReceptionMessage({ status: "success", text: res.data?.message || "Checked out successfully" });
        onLogAction(`Checked out member ID ${memberId}`, "Attendance");
        triggerRefresh();
      })
      .catch((e) => {
        setReceptionMessage({ status: "error", text: e.response?.data?.message || "Check-out failed" });
      })
      .finally(() => {
        setTimeout(() => setReceptionMessage(null), 5000);
      });
  };

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone) return;

    leadsAPI.create({
      name: walkinName,
      phone: walkinPhone,
      email: walkinName.toLowerCase().replace(/ /g, "") + "@gmail.com",
      source: walkinSource,
      stage: "Contacted",
      notes: walkinNotes || "Quick front desk receptionist walkin check."
    });

    setWalkinName("");
    setWalkinPhone("");
    setWalkinNotes("");
    setReceptionMessage({ status: "success", text: `Walk-in Lead logged. Added ${walkinName} to CRM pipeline!` });
    triggerRefresh();
    setTimeout(() => setReceptionMessage(null), 4000);
  };

  // 2. MEMBER MANAGEMENT TAB STATES
  const [memberFilterSearch, setMemberFilterSearch] = useState("");
  const [selectedMemberProfile, setSelectedMemberProfile] = useState<Member | null>(null);
  
  // Create / Edit member modal trigger states
  const [isMemberFormOpen, setIsMemberFormOpen] = useState(false);
  const [memName, setMemName] = useState("");
  const [memPhone, setMemPhone] = useState("");
  const [memEmail, setMemEmail] = useState("");
  const [memGender, setMemGender] = useState("Male");
  const [memGoal, setMemGoal] = useState("Muscle Gain");
  const [memHeight, setMemHeight] = useState(175);
  const [memWeight, setMemWeight] = useState(72);
  const [memMedical, setMemMedical] = useState("None");
  const [memEmergencyName, setMemEmergencyName] = useState("");
  const [memEmergencyPhone, setMemEmergencyPhone] = useState("");

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memName || !memEmail || !memPhone) return;

    membersAPI.create({
      name: memName,
      phone: memPhone,
      email: memEmail,
      dob: "1994-06-14",
      gender: memGender,
      address: "Vikings Cidco Branch database entry",
      bloodGroup: "O+",
      medicalConditions: memMedical,
      emergencyContactName: memEmergencyName || "Family Relation",
      emergencyContactPhone: memEmergencyPhone || memPhone,
      photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300",
      fitnessGoal: memGoal,
      height: Number(memHeight),
      weight: Number(memWeight),
      referralCode: memName.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 89 + 10),
      walletCredits: 0
    });

    // Automatically trigger Monthly subscription assign as standard onboarding
    // membershipsAPI.assign({ member_id: newM.id, plan_id: "p-monthly" });

    setIsMemberFormOpen(false);
    setMemName("");
    setMemEmail("");
    setMemPhone("");
    setMemHeight(175);
    setMemWeight(72);
    setMemEmergencyName("");
    setMemEmergencyPhone("");
    setMemMedical("None");
    
    triggerRefresh();
  };

  // 3. MEMBERSHIP ASSIGNMENTS STATES
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedMemberIdForPlan, setSelectedMemberIdForPlan] = useState("");
  const [planSuccessMsg, setPlanSuccessMsg] = useState("");

  const handleAssignPlan = () => {
    if (!selectedMemberIdForPlan || !selectedPlanId) return;
    try {
      membershipsAPI.assign({ member_id: selectedMemberIdForPlan, plan_id: selectedPlanId });
      setPlanSuccessMsg(`Plan assigned successfully! Transaction receipt generated.`);
      triggerRefresh();
      setTimeout(() => setPlanSuccessMsg(""), 4000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleMembershipFreeze = (membershipId: string) => {
    StorageManager.updateMembershipStatus(membershipId, "FREEZED", 14); // Freeze membership for 14 days
    triggerRefresh();
  };

  const handleMembershipCancel = (membershipId: string) => {
    StorageManager.updateMembershipStatus(membershipId, "CANCELLED");
    triggerRefresh();
  };

  // 4. WORKOUT & DIET TAB STATES
  const [workoutMemberId, setWorkoutMemberId] = useState("");
  const [workoutCategory, setWorkoutCategory] = useState<WorkoutPlan["category"]>("Muscle Gain");
  const [workoutExercisesText, setWorkoutExercisesText] = useState("");
  const [dietMemberId, setDietMemberId] = useState("");
  const [dietCalories, setDietCalories] = useState(2500);
  const [dietMealsText, setDietMealsText] = useState("");
  const [planSubmitSuccess, setPlanSubmitSuccess] = useState("");

  const handleAssignWorkoutPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutMemberId) return;

    const matchedMem = members.find(m => m.id === workoutMemberId);
    if (!matchedMem) return;

    const exercises = workoutExercisesText.trim() ? workoutExercisesText.split("\n").map(line => {
      const parts = line.split("|");
      return {
        day: parts[0]?.trim() || "Monday",
        name: parts[1]?.trim() || "Squats",
        sets: Number(parts[2]?.trim()) || 4,
        reps: parts[3]?.trim() || "10-12 reps",
        notes: parts[4]?.trim() || "Standard form"
      };
    }) : [
      { day: "Monday", name: "Dumbbell Press", sets: 4, reps: "12 reps", notes: "Heavy compound" },
      { day: "Wednesday", name: "Lat Pull downs", sets: 4, reps: "10-12 reps", notes: "Squeeze back muscles" },
      { day: "Friday", name: "Barbell Squats", sets: 5, reps: "8 reps", notes: "Ensure deep range of motion" }
    ];

    StorageManager.assignWorkoutPlan({
      name: `Custom Routine for ${matchedMem.name}`,
      memberId: workoutMemberId,
      memberName: matchedMem.name,
      trainerId: "t-1",
      trainerName: "Thor Odinson",
      category: workoutCategory,
      exercises,
      startFrom: new Date().toISOString().substring(0, 10),
      endAt: "2026-08-30"
    });

    setWorkoutExercisesText("");
    setPlanSubmitSuccess("Personalized exercises dispatched online to member in-app portal!");
    triggerRefresh();
    setTimeout(() => setPlanSubmitSuccess(""), 4000);
  };

  const handleAssignDietPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dietMemberId) return;

    const matchedMem = members.find(m => m.id === dietMemberId);
    if (!matchedMem) return;

    const meals = dietMealsText.trim() ? dietMealsText.split("\n").map(line => {
      const parts = line.split("|");
      return {
        time: parts[0]?.trim() || "08:00 AM",
        type: (parts[1]?.trim() || "Lunch") as any,
        description: parts[2]?.trim() || "Grilled Chicken Breast with White Rice",
        caloriesEstimate: Number(parts[3]?.trim()) || 500
      };
    }) : [
      { time: "08:00 AM", type: "Breakfast" as const, description: "Oatmeal with Almonds + Black Coffee", caloriesEstimate: 450 },
      { time: "01:30 PM", type: "Lunch" as const, description: "200g Paneer/Chicken salad with Avocado", caloriesEstimate: 600 },
      { time: "07:30 PM", type: "Dinner" as const, description: "Quinoa base mixed organic vegetables", caloriesEstimate: 500 }
    ];

    StorageManager.assignDietPlan({
      name: `Nutrient Diet for ${matchedMem.name}`,
      memberId: dietMemberId,
      memberName: matchedMem.name,
      trainerId: "t-1",
      trainerName: "Thor Odinson",
      caloriesTarget: Number(dietCalories),
      meals,
      notes: "Sip plenty of lemon infused water during workout lifts."
    });

    setDietMealsText("");
    setPlanSubmitSuccess("Nutritional macro blueprint assigned securely.");
    triggerRefresh();
    setTimeout(() => setPlanSubmitSuccess(""), 4000);
  };

  // 5. POINT OF SALE (POS) TAB STATES
  const [posMemberId, setPosMemberId] = useState("walkin");
  const [posCouponCode, setPosCouponCode] = useState("");
  const [cart, setCart] = useState<{ item: InventoryItem; qty: number }[]>([]);
  const [checkoutResult, setCheckoutResult] = useState<{ status: "success" | "stale"; invoice?: string; discount?: number } | null>(null);
  
  const handleAddToCart = (item: InventoryItem) => {
    if (item.stockLevel <= 0) return;
    const existing = cart.find(c => c.item.id === item.id);
    if (existing) {
      if (existing.qty < item.stockLevel) {
        setCart(cart.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
    } else {
      setCart([...cart, { item, qty: 1 }]);
    }
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    const listPos = cart.find(c => c.item.id === itemId);
    if (!listPos) return;

    if (newQty <= 0) {
      setCart(cart.filter(c => c.item.id !== itemId));
    } else if (newQty <= listPos.item.stockLevel) {
      setCart(cart.map(c => c.item.id === itemId ? { ...c, qty: newQty } : c));
    }
  };

  const handlePOSCheckout = () => {
    if (cart.length === 0) return;
    const itemsLine = cart.map(c => ({ id: c.item.id, qty: c.qty }));
    
    // Process Local Purchase
    const res = StorageManager.checkoutPOS(posMemberId, itemsLine, posCouponCode);
    if (res.success) {
      setCheckoutResult({ status: "success", invoice: res.invoice, discount: res.discount });
      setCart([]);
      setPosCouponCode("");
      triggerRefresh();
    } else {
      setCheckoutResult({ status: "stale" });
    }
  };

  // 6. LOCKERS & PHYSICAL ASSETS ASSIGNMENT
  const [lockerSelectedId, setLockerSelectedId] = useState("");
  const [lockerMemberId, setLockerMemberId] = useState("");
  const [lockerRent, setLockerRent] = useState(600);
  const [lockerMonths, setLockerMonths] = useState(3);

  const handleAssignLockerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockerSelectedId || !lockerMemberId) return;

    StorageManager.assignLocker(lockerSelectedId, lockerMemberId, Number(lockerRent), Number(lockerMonths));
    setLockerSelectedId("");
    setLockerMemberId("");
    triggerRefresh();
  };

  const handleReleaseLocker = (lockerId: string) => {
    StorageManager.releaseLocker(lockerId);
    triggerRefresh();
  };

  // 7. CRM KANBAN PIPELINE STATES
  const handleMoveLead = (leadId: string, currentStage: Lead["stage"], direction: 'FORWARD' | 'BACKWARD') => {
    const stages: Lead["stage"][] = ["New", "Contacted", "Trial", "Negotiation", "Converted", "Lost"];
    const idx = stages.indexOf(currentStage);
    if (idx === -1) return;

    let targetIdx = idx;
    if (direction === 'FORWARD' && idx < stages.length - 1) {
      targetIdx = idx + 1;
    } else if (direction === 'BACKWARD' && idx > 0) {
      targetIdx = idx - 1;
    }

    if (targetIdx !== idx) {
      StorageManager.updateLeadStage(leadId, stages[targetIdx]);
      triggerRefresh();
    }
  };

  // 8. FINANCE ledgers
  const [expAmount, setExpAmount] = useState("");
  const [expCategory, setExpCategory] = useState<Expense["category"]>("Rent");
  const [expDesc, setExpDesc] = useState("");
  const [expPaidTo, setExpPaidTo] = useState("");

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expAmount || !expDesc) return;

    StorageManager.addExpense({
      amount: Number(expAmount),
      category: expCategory,
      description: expDesc,
      date: new Date().toISOString().substring(0, 10),
      paidTo: expPaidTo || "General Merchant vendor"
    });

    setExpAmount("");
    setExpDesc("");
    setExpPaidTo("");
    triggerRefresh();
  };

  // 9. SYSTEM CREATION FOR COUPONS
  const [coupCode, setCoupCode] = useState("");
  const [coupType, setCoupType] = useState<Coupon["type"]>("PERCENTAGE");
  const [coupValue, setCoupValue] = useState("");
  const [coupLimit, setCoupLimit] = useState("");

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupCode || !coupValue) return;

    StorageManager.addCoupon({
      code: coupCode.toUpperCase().trim(),
      type: coupType,
      value: Number(coupValue),
      expiryDate: "2026-12-31",
      usageLimit: Number(coupLimit) || 100
    });

    setCoupCode("");
    setCoupValue("");
    setCoupLimit("");
    triggerRefresh();
  };

  // Dedicated calculations for P&L Dashboard
  const totalRevenue = payments.filter(p => p.status === "PAID").reduce((sum, current) => sum + current.amount, 0);
  const totalExpenseAmount = expenses.reduce((sum, current) => sum + current.amount, 0);
  const netProfit = totalRevenue - totalExpenseAmount;

  // Render specific content according to active tab
  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        
        {/* ======================= TABS MODULE 1 : ANALYTICS DASHBOARD ======================= */}
        {activeTab === "dashboard" && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-neutral-900/40 p-5 rounded-lg border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Total Members</span>
                  <p className="text-2xl font-mono font-black text-white">{members.length}</p>
                  <span className="text-[9px] text-emerald-500 font-mono">100% active ledger baseline</span>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded text-emerald-500">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-neutral-900/40 p-5 rounded-lg border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Mtd Revenue</span>
                  <p className="text-2xl font-mono font-black text-rose-500">₹{totalRevenue.toLocaleString()}</p>
                  <span className="text-[9px] text-emerald-500 font-mono">Razorpay + Cache Ledger</span>
                </div>
                <div className="bg-rose-500/10 p-3 rounded text-rose-500">
                  <TrendingUp className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              <div className="bg-neutral-900/40 p-5 rounded-lg border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Total expenses</span>
                  <p className="text-2xl font-mono font-black text-amber-500">₹{totalExpenseAmount.toLocaleString()}</p>
                  <span className="text-[9px] text-gray-400 font-mono">Rent + Salaries + Maintenance</span>
                </div>
                <div className="bg-amber-500/10 p-3 rounded text-amber-500">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-neutral-900/40 p-5 rounded-lg border border-neutral-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Net profit</span>
                  <p className={`text-2xl font-mono font-black ${netProfit >= 0 ? 'text-teal-400' : 'text-red-500'}`}>
                    ₹{netProfit.toLocaleString()}
                  </p>
                  <span className="text-[9px] text-teal-400 font-mono">Operating Net Margin</span>
                </div>
                <div className="bg-teal-400/10 p-3 rounded text-teal-400">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Low inventory alerts */}
            {inventory.some(i => i.stockLevel < i.minAlertLevel) && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-yellow-500 w-5 h-5 shrink-0" />
                  <div>
                    <strong className="text-white text-xs font-mono block">INVENTORY WARRIOR REPLENISHMENT REQUIRED:</strong>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      The supplement retail catalog contains products falling below defined minimum target storage levels (e.g. Creatine). Update stock to fulfill walk-in guest demand.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alert("Please proceed to Supplement Store POS Tab and replenish stock levels.")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-mono font-bold text-[10px] px-3.5 py-1.5 rounded"
                >
                  AUDIT STORE
                </button>
              </div>
            )}

            {/* Advanced Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Area Chart */}
              <div className="bg-neutral-900/30 border border-neutral-850 p-6 rounded-lg">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">REVENUE STREAMS TREND (₹)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { name: "Jan", revenue: 15000 },
                        { name: "Feb", revenue: 27000 },
                        { name: "Mar", revenue: 38000 },
                        { name: "Apr", revenue: 42000 },
                        { name: "May", revenue: 31000 },
                        { name: "Jun", revenue: totalRevenue },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                      <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262617", fontSize: '12px' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Net Sales" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Membership type Pie distribution */}
              <div className="bg-neutral-900/30 border border-neutral-850 p-6 rounded-lg">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">MEMBERSHIP PLANS DISTRIBUTION</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Monthly Recruit", value: memberships.filter(m => m.planId === "p-monthly").length },
                          { name: "Quarterly Shield", value: memberships.filter(m => m.planId === "p-quarterly").length },
                          { name: "Half-Yearly Berserker", value: memberships.filter(m => m.planId === "p-halfyearly").length },
                          { name: "Valhalla Annual Champion", value: memberships.filter(m => m.planId === "p-annual").length }
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                      >
                        {["#ef4444", "#f43f5e", "#fda4af", "#b91c1c"].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262617", fontSize: '12px' }} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Attendance line tracking peaks */}
              <div className="bg-neutral-900/30 border border-neutral-850 p-6 rounded-lg">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">PEAK HOURS MEMBERSHIP LIFT COUNTS</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { hour: "06:00 AM", checkins: 8 },
                        { hour: "08:00 AM", checkins: 12 },
                        { hour: "10:00 AM", checkins: 4 },
                        { hour: "12:00 PM", checkins: 2 },
                        { hour: "04:30 PM", checkins: 9 },
                        { hour: "06:30 PM", checkins: 15 },
                        { hour: "08:30 PM", checkins: 11 },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="hour" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                      <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262617", fontSize: '12px' }} />
                      <Line type="monotone" dataKey="checkins" stroke="#f43f5e" strokeWidth={3} activeDot={{ r: 6 }} name="Visitor counts" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Coaching metrics client limits */}
              <div className="bg-neutral-900/30 border border-neutral-850 p-6 rounded-lg">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">TRAINER PERFORMANCE (CLIENT COUNTS)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trainers.map(t => ({ name: t.name.split(" ")[0], clients: t.assignedClientsCount, rating: t.rating * 10 }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                      <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#262617", fontSize: '12px' }} />
                      <Bar dataKey="clients" fill="#e11d48" radius={[4, 4, 0, 0]} name="PT Clients" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 2 : RECEPTION & GUEST CHECK-IN ======================= */}
        {activeTab === "reception" && (
          <motion.div 
            key="reception"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Attendance scanning simulation */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <Clock className="text-red-500 w-4 h-4" /> RECEPTION PORTAL CHECK-IN & MANUAL GATEWAY
                </h3>

                <div className="mb-6 relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={receptionSearch}
                    onChange={(e) => setReceptionSearch(e.target.value)}
                    placeholder="Search member list by name or phone key..."
                    className="w-full bg-neutral-950 border border-neutral-800 pl-10 pr-4 py-2.5 rounded text-xs focus:border-red-650"
                  />
                </div>

                {receptionMessage && (
                  <div className={`p-4 rounded text-xs font-bold mb-6 ${receptionMessage.status === "success" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-red-500/15 text-red-500 border border-red-500/30"}`}>
                    {receptionMessage.text}
                  </div>
                )}

                {/* Filtered members attendance controls */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {members
                    .filter(m => !receptionSearch || m.name.toLowerCase().includes(receptionSearch.toLowerCase()) || m.phone.includes(receptionSearch))
                    .map(m => {
                      // Check if checked in today
                      const todayStr = new Date().toISOString().substring(0, 10);
                      const isCheckedIn = attendance.some(a => a.memberId === m.id && a.date === todayStr && !a.checkOutTime);
                      const mPlan = memberships.find(mm => mm.memberId === m.id && mm.status === "ACTIVE");

                      return (
                        <div key={m.id} className="bg-neutral-950 border border-neutral-850 p-4 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-neutral-800 transition-colors">
                          <div className="flex items-center gap-3">
                            {m.photoUrl ? (
                              <img src={m.photoUrl} alt={m.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-neutral-700">
                                <span className="text-gray-400 font-bold text-sm uppercase">{m.name ? m.name.charAt(0) : '?'}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-xs font-bold text-white block">{m.name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{m.phone} | BMI: {m.bmi}</span>
                              <div className="mt-1">
                                {mPlan ? (
                                  <span className="text-[9px] font-mono bg-red-600/10 text-red-400 px-2 py-0.5 rounded border border-red-950">
                                    {mPlan.planName} (Exp: {mPlan.endDate})
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-mono bg-neutral-900 text-gray-500 px-2 py-0.5 rounded">
                                    No Active Membership
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCheckedIn ? (
                              <button
                                onClick={() => handleReceptionCheckOut(m.id)}
                                className="bg-amber-500 hover:bg-amber-600 text-black font-mono font-bold text-[10px] px-3.5 py-1.5 rounded cursor-pointer"
                              >
                                CHECK OUT
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReceptionCheckIn(m.id)}
                                className={`font-mono font-bold text-[10px] px-3.5 py-1.5 rounded cursor-pointer ${
                                  mPlan 
                                    ? "bg-red-600 hover:bg-red-700 text-black" 
                                    : "bg-neutral-850 text-gray-500 border border-neutral-800 hover:text-gray-400"
                                }`}
                              >
                                SCAN CHECK-IN
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Active visitor board */}
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                  ACTIVE FLOOR VISITORS REAL-TIME ({attendance.filter(a => a.date === new Date().toISOString().substring(0, 10) && !a.checkOutTime).length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attendance
                    .filter(a => a.date === new Date().toISOString().substring(0, 10) && !a.checkOutTime)
                    .map(att => (
                      <div key={att.id} className="bg-neutral-950/60 p-3 rounded border border-neutral-850 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-white font-mono font-medium block">{att.memberName}</span>
                          <span className="text-[9px] text-gray-500">In: {att.checkInTime}</span>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse">
                          ON-FLOOR
                        </span>
                      </div>
                    ))}
                  {attendance.filter(a => a.date === new Date().toISOString().substring(0, 10) && !a.checkOutTime).length === 0 && (
                    <div className="col-span-2 text-center py-6 text-xs text-gray-500 font-mono">
                      [ Floor empty. No active logged visitor sessions ]
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Quick Guest Lead / Walkin entry */}
            <div className="space-y-6">
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
                  <PlusCircle className="text-red-500 w-4 h-4" /> ADD WALK-IN GUEST LEAD
                </h3>

                <form onSubmit={handleAddWalkin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Visitor Name</label>
                    <input
                      type="text"
                      value={walkinName}
                      onChange={(e) => setWalkinName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded text-xs focus:border-red-650 focus:outline-none"
                      placeholder="e.g. Karan Dev"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      value={walkinPhone}
                      onChange={(e) => setWalkinPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded text-xs focus:border-red-650 focus:outline-none"
                      placeholder="e.g. +91 91234 56789"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Origin Source</label>
                    <select
                      value={walkinSource}
                      onChange={(e) => setWalkinSource(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded text-xs focus:border-red-650 focus:outline-none"
                    >
                      <option value="Walk-In">Walk-In Office visit</option>
                      <option value="Referral">Friend Referral</option>
                      <option value="Google">Google Search Location</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">First Impression Notes</label>
                    <textarea
                      rows={3}
                      value={walkinNotes}
                      onChange={(e) => setWalkinNotes(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded text-xs focus:border-red-650 focus:outline-none"
                      placeholder="e.g., Interested in annual package pricing..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs uppercase tracking-widest cursor-pointer"
                  >
                    INJECT AS CRM LEAD
                  </button>
                </form>
              </div>

              {/* Attendance historic log ledger */}
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">HISTORIC ATTENDANCE LEDGER</h3>
                  <button 
                    onClick={() => {
                      alert("Generating Daily Attendance CSV logs summary...");
                    }} 
                    className="text-[9px] font-mono text-red-500 hover:underline"
                  >
                    DOWNLOAD INDEX
                  </button>
                </div>
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-2 text-[10pt] font-mono">
                  {attendance.map((a, i) => (
                    <div key={i} className="p-2.5 bg-neutral-950/40 rounded border border-neutral-900 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-gray-300 font-bold block">{a.memberName}</span>
                        <span className="text-[9px] text-gray-500 block">{a.date} | In: {a.checkInTime}</span>
                      </div>
                      <span className="text-[9px] text-gray-400">
                        {a.checkOutTime ? `Out: ${a.checkOutTime}` : "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 3 : MEMBER DIRECTORY & PLANS ======================= */}
        {activeTab === "members" && (
          <motion.div 
            key="members"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header controls for members CRUD */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/20 p-4 rounded-lg border border-neutral-850">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={memberFilterSearch}
                  onChange={(e) => setMemberFilterSearch(e.target.value)}
                  placeholder="Filter members by name..."
                  className="w-full bg-neutral-950 border border-neutral-800 pl-10 pr-4 py-2 rounded text-xs focus:border-red-650"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsMemberFormOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-black py-2 px-4 rounded font-mono font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> NEW REGISTER MEMBER
                </button>
              </div>
            </div>

            {/* Members table */}
            <div className="bg-neutral-900/40 border border-neutral-850 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#171717]/80 font-mono text-gray-400 border-b border-neutral-850 text-[10px] uppercase">
                  <tr>
                    <th className="p-4">Photo / Name</th>
                    <th className="p-4">Contact Detail</th>
                    <th className="p-4">Physiology Metrics</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4">Referral Code</th>
                    <th className="p-4">Wallet Bal (₹)</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {members
                    .filter(m => !memberFilterSearch || m.name.toLowerCase().includes(memberFilterSearch.toLowerCase()) || m.phone.includes(memberFilterSearch))
                    .map(m => (
                      <tr key={m.id} className="hover:bg-neutral-950/60 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          {m.photoUrl ? (
                            <img src={m.photoUrl} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-neutral-800 shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 shrink-0">
                              <span className="text-gray-400 font-bold text-xs uppercase">{m.name ? m.name.charAt(0) : '?'}</span>
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-white block">{m.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{m.gender}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          <span className="block text-gray-300">{m.email}</span>
                          <span className="text-gray-500">{m.phone}</span>
                        </td>
                        <td className="p-4 font-mono">
                          <span className="text-rose-500 block">BMI: {m.bmi}</span>
                          <span className="text-gray-400 text-[10px]">{m.height}cm / {m.weight}kg</span>
                        </td>
                        <td className="p-4 font-mono text-gray-400">{m.joinedDate}</td>
                        <td className="p-4 font-mono text-gray-300">{m.referralCode}</td>
                        <td className="p-4 font-mono font-bold text-amber-500">₹{m.walletCredits}</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setSelectedMemberProfile(m)}
                              className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-gray-300 py-1.5 px-3 rounded text-[10px] uppercase font-mono cursor-pointer"
                            >
                              PROFILE CARD
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove member record ${m.name}?`)) {
                                  StorageManager.deleteMember(m.id);
                                  triggerRefresh();
                                }
                              }}
                              className="bg-red-950/20 hover:bg-red-950 text-red-500 p-1.5 rounded transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Add Member form Modal Overlay */}
            {isMemberFormOpen && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neutral-950 border border-red-950 p-6 sm:p-8 rounded-xl w-full max-w-lg shadow-2xl relative"
                >
                  <button 
                    onClick={() => setIsMemberFormOpen(false)} 
                    className="absolute right-4 top-4 text-neutral-500 hover:text-white font-mono text-xs"
                  >
                    [CLOSE]
                  </button>

                  <h3 className="text-lg font-mono font-black text-white uppercase tracking-tight mb-5">
                    REGISTER NEW WARRIOR MEMBER
                  </h3>

                  <form onSubmit={handleCreateMember} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Full Name</label>
                        <input
                          type="text"
                          value={memName}
                          onChange={(e) => setMemName(e.target.value)}
                          required
                          className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                          placeholder="e.g. Anand Sen"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Phone Number</label>
                        <input
                          type="tel"
                          value={memPhone}
                          onChange={(e) => setMemPhone(e.target.value)}
                          required
                          className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                          placeholder="+91..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Secure Email</label>
                      <input
                        type="email"
                        value={memEmail}
                        onChange={(e) => setMemEmail(e.target.value)}
                        required
                        className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                        placeholder="anand@gmail.com"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Gender</label>
                        <select
                          value={memGender}
                          onChange={(e) => setMemGender(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Height (CM)</label>
                        <input
                          type="number"
                          value={memHeight}
                          onChange={(e) => setMemHeight(Number(e.target.value))}
                          className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Weight (KG)</label>
                        <input
                          type="number"
                          value={memWeight}
                          onChange={(e) => setMemWeight(Number(e.target.value))}
                          className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Emergency Name</label>
                        <input
                          type="text"
                          value={memEmergencyName}
                          onChange={(e) => setMemEmergencyName(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                          placeholder="e.g. Sunil Sen"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Emergency Phone</label>
                        <input
                          type="tel"
                          value={memEmergencyPhone}
                          onChange={(e) => setMemEmergencyPhone(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:border-red-650 focus:outline-none"
                          placeholder="+91..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Fitness Goal</label>
                      <select
                        value={memGoal}
                        onChange={(e) => setMemGoal(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-xs text-white"
                      >
                        <option value="Muscle Gain">Muscle Gain Bulk</option>
                        <option value="Fat Loss">Fat Loss Lean</option>
                        <option value="Cardio Conditioning">Cardio / Stamina</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs uppercase"
                    >
                      SAVE MEMBER & ONBOARD
                    </button>
                  </form>
                </motion.div>
              </div>
            )}

            {/* Profile detail card overlay modal */}
            {selectedMemberProfile && (
              <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
                >
                  <button 
                    onClick={() => setSelectedMemberProfile(null)} 
                    className="absolute right-4 top-4 text-neutral-500 hover:text-white font-mono text-xs"
                  >
                    [CLOSE]
                  </button>

                  <div className="flex flex-col sm:flex-row gap-6 items-start pb-6 border-b border-neutral-850">
                    {selectedMemberProfile.photoUrl ? (
                      <img src={selectedMemberProfile.photoUrl} alt={selectedMemberProfile.name} className="w-20 h-20 rounded-full object-cover border-2 border-red-500 shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center border-2 border-red-500 shrink-0">
                        <span className="text-gray-400 font-bold text-2xl uppercase">{selectedMemberProfile.name ? selectedMemberProfile.name.charAt(0) : '?'}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-xl font-bold text-white block">{selectedMemberProfile.name}</span>
                      <span className="font-mono text-xs text-gray-500 block mb-2">{selectedMemberProfile.email} | {selectedMemberProfile.phone}</span>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-mono bg-red-650/10 text-red-500 px-2 py-0.5 rounded border border-red-900/30">
                          Goal: {selectedMemberProfile.fitnessGoal}
                        </span>
                        <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-900/30">
                          Blood: {selectedMemberProfile.bloodGroup}
                        </span>
                        <span className="text-[10px] font-mono bg-teal-400/10 text-teal-400 px-2 py-0.5 rounded border border-teal-900/30">
                          Credits: ₹{selectedMemberProfile.walletCredits}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 text-xs text-gray-300">
                    <div>
                      <h4 className="font-mono text-white text-xs uppercase mb-3 text-red-500 underline decoration-red-950">
                        ANATOMY PROFILE & BMI INDEX
                      </h4>
                      <ul className="space-y-2 font-mono">
                        <li className="flex justify-between py-1 border-b border-neutral-900">
                          <span className="text-gray-500">HEIGHT & WEIGHT:</span>
                          <strong>{selectedMemberProfile.height}cm / {selectedMemberProfile.weight}kg</strong>
                        </li>
                        <li className="flex justify-between py-1 border-b border-neutral-900">
                          <span className="text-gray-500">BMI INDEX LEVEL:</span>
                          <strong className="text-rose-500">{selectedMemberProfile.bmi}</strong>
                        </li>
                        <li className="flex justify-between py-1 border-b border-neutral-900 text-left">
                          <span className="text-gray-500 shrink-0 mr-4">MEDICAL FACTORS:</span>
                          <strong className="truncate max-w-[200px]" title={selectedMemberProfile.medicalConditions}>{selectedMemberProfile.medicalConditions}</strong>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-mono text-white text-xs uppercase mb-3 text-red-500 underline decoration-red-950">
                        EMERGENCY VERIFICATIONS
                      </h4>
                      <ul className="space-y-2 font-mono">
                        <li className="flex justify-between py-1 border-b border-neutral-900">
                          <span className="text-gray-500">CONTACT ALIAS:</span>
                          <strong>{selectedMemberProfile.emergencyContactName}</strong>
                        </li>
                        <li className="flex justify-between py-1 border-b border-neutral-900">
                          <span className="text-gray-500">PHONE REFERENCE:</span>
                          <strong>{selectedMemberProfile.emergencyContactPhone}</strong>
                        </li>
                        <li className="flex justify-between py-1 border-b border-neutral-900">
                          <span className="text-gray-500">ADDRESS INDEX:</span>
                          <strong className="text-right truncate max-w-[200px]" title={selectedMemberProfile.address}>{selectedMemberProfile.address}</strong>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Plan control inside profile detail */}
                  <div className="mt-8 pt-6 border-t border-neutral-850">
                    <h4 className="font-mono text-white text-xs uppercase mb-4 text-red-500">
                      SUBSCRIPTION PLAN ACTIONS
                    </h4>

                    {memberships.some(mm => mm.memberId === selectedMemberProfile.id && mm.status === "ACTIVE") ? (
                      <div className="space-y-4">
                        {memberships
                          .filter(mm => mm.memberId === selectedMemberProfile.id && mm.status === "ACTIVE")
                          .map(ms => (
                            <div key={ms.id} className="p-4 bg-neutral-900 rounded border border-neutral-800 flex justify-between items-center">
                              <div>
                                <span className="font-bold text-white block">{ms.planName}</span>
                                <span className="text-[10px] text-gray-500 font-mono">Duration: {ms.startDate} to {ms.endDate}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleMembershipFreeze(ms.id)}
                                  className="bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black font-mono font-bold text-[10px] px-3.5 py-1.5 rounded border border-amber-900/30"
                                >
                                  FREEZE CARD (+14d)
                                </button>
                                <button
                                  onClick={() => handleMembershipCancel(ms.id)}
                                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-mono font-bold text-[10px] px-3.5 py-1.5 rounded border border-red-900/30"
                                >
                                  CANCEL SUB
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-red-650/10 border border-red-950 text-center rounded-lg">
                        <span className="text-xs text-red-400 font-mono block mb-3">No active membership assigned! Blocked entry at front desk!</span>
                        <div className="flex gap-4 max-w-sm mx-auto justify-center">
                          <select
                            value={selectedPlanId}
                            onChange={(e) => setSelectedPlanId(e.target.value)}
                            className="bg-neutral-900 border border-neutral-800 text-xs text-white px-3 py-1.5 rounded"
                          >
                            <option value="">Select plan...</option>
                            {plans.map(p => (
                              <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              if (selectedPlanId) {
                                membershipsAPI.assign({ member_id: selectedMemberProfile.id, plan_id: selectedPlanId });
                                setSelectedPlanId("");
                                triggerRefresh();
                                alert("Membership Plan assigned successfully!");
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-black px-4 py-1.5 rounded font-mono font-bold text-xs"
                          >
                            ACTIVATE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* ======================= TABS MODULE 4 : MEMBERSHIPS SUB SETTINGS ======================= */}
        {activeTab === "plans" && (
          <motion.div 
            key="plans"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Col: Available Plans list */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">VIKINGS SHIELD-WALL DEFINED PLANS</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plans.map(p => (
                    <div key={p.id} className="bg-neutral-900/40 p-5 rounded-lg border border-neutral-850 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <strong className="text-xs font-bold text-white block">{p.name}</strong>
                          <span className="text-[10px] font-mono text-red-500 bg-red-600/10 px-2 py-0.5 rounded border border-red-950">
                            {p.durationMonths} Mo
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mb-4">{p.description}</p>
                      </div>

                      <div className="pt-3 border-t border-neutral-850 flex justify-between items-center">
                        <span className="text-base font-mono font-black text-white">₹{p.price.toLocaleString()}</span>
                        <span className="text-[9px] text-gray-500 font-mono">Branch ID: {p.branch_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Assignments console */}
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">ASSIGN MEMBERSHIP PACKAGE</h3>
                
                {planSuccessMsg && (
                  <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs mb-4">
                    {planSuccessMsg}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Select Member</label>
                    <select
                      value={selectedMemberIdForPlan}
                      onChange={(e) => setSelectedMemberIdForPlan(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded text-xs text-white"
                    >
                      <option value="">-- select --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Select Plan</label>
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded text-xs text-white"
                    >
                      <option value="">-- select --</option>
                      {plans.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAssignPlan}
                    className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs uppercase"
                  >
                    DISPATCH BILLING INDEX
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 5 : TRAINERS REGISTRY ======================= */}
        {activeTab === "trainers" && (
          <motion.div 
            key="trainers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Table of trainers */}
            <div className="bg-neutral-900/40 border border-neutral-850 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-[#171717] font-mono text-gray-400 border-b border-neutral-850 text-[10px] uppercase">
                  <tr>
                    <th className="p-4">Trainer Detail</th>
                    <th className="p-4">Experience Base</th>
                    <th className="p-4">Salary Tier</th>
                    <th className="p-4">Commission %</th>
                    <th className="p-4">Assigned Clients</th>
                    <th className="p-4">Rating Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {trainers.map(t => (
                    <tr key={t.id} className="hover:bg-neutral-950/60 transition-colors">
                      <td className="p-4">
                        <strong className="text-white text-xs block">{t.name}</strong>
                        <span className="text-[10px] text-gray-500 font-mono">{t.email} | {t.phone}</span>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {t.certifications.map((c, i) => (
                            <span key={i} className="text-[9px] font-mono bg-neutral-950 text-gray-400 px-2 py-0.5 rounded border border-neutral-900">
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-gray-300">{t.experienceYears} Years</td>
                      <td className="p-4 font-mono text-gray-300">₹{t.salary.toLocaleString()} / mo</td>
                      <td className="p-4 font-mono text-gray-300">{t.commissionRate}%</td>
                      <td className="p-4 font-mono text-rose-500 font-bold">{t.assignedClientsCount} active clients</td>
                      <td className="p-4 font-mono text-amber-500 font-bold">★ {t.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Commissions payout log card representation */}
            <div className="bg-neutral-900/30 p-6 rounded-lg border border-neutral-850 max-w-2xl">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-3">TRAINER REVENUE SHARE LEDGER</h3>
              <p className="text-[11px] text-gray-400 leading-normal mb-4">
                Assigned instructors receive defined commission ratios immediately when members enroll in their personalized VIP coaching packages. This aligns direct coach performance with gym sales incentives.
              </p>

              <div className="space-y-2">
                {trainers.map(t => {
                  const ptPackageSales = ptSessions.filter(s => s.trainerId === t.id).length * 8000;
                  const share = (ptPackageSales * t.commissionRate) / 100;
                  return (
                    <div key={t.id} className="p-3 bg-neutral-950/80 rounded border border-neutral-850 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-white font-mono font-bold block">{t.name}</span>
                        <span className="text-[10px] text-gray-500">Total VIP Package sales handled: ₹{ptPackageSales.toLocaleString()}</span>
                      </div>
                      <span className="text-sm font-mono font-black text-rose-500">
                        Commission Due: ₹{share.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 6 : LEAD CRM KANBAN ======================= */}
        {activeTab === "leads" && (
          <motion.div 
            key="leads"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {(["New", "Contacted", "Trial", "Negotiation", "Converted", "Lost"] as Lead["stage"][]).map(col => {
                const colLeads = leads.filter(l => l.stage === col);
                return (
                  <div key={col} className="bg-neutral-900/30 rounded-lg border border-neutral-850 p-3 min-h-[350px]">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-neutral-850">
                      <span className="text-[11px] font-mono font-bold text-white uppercase">{col}</span>
                      <span className="text-[10px] font-mono bg-red-600/10 text-red-500 px-2 rounded-full font-bold">
                        {colLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {colLeads.map(l => (
                        <div key={l.id} className="bg-neutral-950 border border-neutral-850 p-3 rounded hover:border-neutral-700 transition-colors">
                          <strong className="text-xs text-white block truncate">{l.name}</strong>
                          <span className="text-[9px] text-gray-500 font-mono block mb-2">{l.phone}</span>
                          <p className="text-[10px] text-gray-400 leading-normal line-clamp-3 mb-3 bg-black/30 p-1.5 rounded">{l.notes}</p>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-neutral-900">
                            <span className="text-[9px] text-rose-500 font-mono uppercase bg-red-550/5 px-1.5 py-0.5 rounded border border-red-950">
                              {l.source}
                            </span>
                            
                            <div className="flex gap-1.5">
                              {col !== "New" && (
                                <button
                                  onClick={() => handleMoveLead(l.id, col, 'BACKWARD')}
                                  className="p-1 hover:bg-neutral-850 text-gray-500 hover:text-white rounded transition-colors"
                                  title="Shift Back"
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              )}
                              {col !== "Lost" && (
                                <button
                                  onClick={() => handleMoveLead(l.id, col, 'FORWARD')}
                                  className="p-1 hover:bg-neutral-850 text-gray-500 hover:text-white rounded transition-colors"
                                  title="Shift Forward"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {colLeads.length === 0 && (
                      <div className="text-center py-8 text-[10px] text-gray-650 font-mono">
                        [ Empty stage ]
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 7 : WORKOUTS & DIETS ======================= */}
        {activeTab === "workouts" && (
          <motion.div 
            key="workouts"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Workout assign module */}
            <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <Dumbbell className="text-red-500 w-4 h-4" /> DISPATCH EXERCISE PLAN TEMPLATES
              </h3>

              {planSubmitSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-xs mb-4">
                  {planSubmitSuccess}
                </div>
              )}

              <form onSubmit={handleAssignWorkoutPlan} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Select Member</label>
                    <select
                      value={workoutMemberId}
                      onChange={(e) => setWorkoutMemberId(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:outline-none"
                    >
                      <option value="">-- select --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Training category</label>
                    <select
                      value={workoutCategory}
                      onChange={(e) => setWorkoutCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:outline-none"
                    >
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Fat Loss">Fat Loss</option>
                      <option value="Strength">Strength Powerlifting</option>
                      <option value="Beginner">Shield Academy Beginner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">
                    Exercises list (Format: Day | Exercise Name | Sets | Reps | notes)
                  </label>
                  <textarea
                    rows={4}
                    value={workoutExercisesText}
                    onChange={(e) => setWorkoutExercisesText(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded font-mono text-xs text-white focus:ring-1 focus:ring-red-650"
                    placeholder="Monday | Heavy Squat | 5 | 5 reps | focus depth&#10;Wednesday | Bench Press | 4 | 8 reps | strict setup"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs uppercase"
                >
                  ASSIGN EXERCSES BLUEPRINT
                </button>
              </form>
            </div>

            {/* Diet assign module */}
            <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <Activity className="text-red-500 w-4 h-4" /> tailored nutrition diet planner
              </h3>

              <form onSubmit={handleAssignDietPlan} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Select Member</label>
                    <select
                      value={dietMemberId}
                      onChange={(e) => setDietMemberId(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:outline-none"
                    >
                      <option value="">-- select --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Calorie Target Limit</label>
                    <input
                      type="number"
                      value={dietCalories}
                      onChange={(e) => setDietCalories(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">
                    Meals blueprint schedule (Format: Time | MealType | description | Est.Calories)
                  </label>
                  <textarea
                    rows={4}
                    value={dietMealsText}
                    onChange={(e) => setDietMealsText(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-3 rounded font-mono text-xs text-white focus:ring-1 focus:ring-red-650"
                    placeholder="07:30 AM | Breakfast | 6 Egg Whites + Almonds | 400&#10;01:30 PM | Lunch | Baked Chicken + Quinoa | 650"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black py-2.5 rounded font-mono font-bold text-xs uppercase"
                >
                  ASSIGN DIGITAL MACRO DIET
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 8 : SUPPLEMENT STORE POS ======================= */}
        {activeTab === "storepos" && (
          <motion.div 
            key="storepos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Supplement inventory cells */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">RETAIL POS supplement & merchandise catalog</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inventory.map(item => {
                  const isLow = item.stockLevel < item.minAlertLevel;
                  return (
                    <div 
                      key={item.id} 
                      className={`bg-neutral-900/40 p-4 rounded-lg flex flex-col justify-between border ${
                        isLow ? "border-amber-500/50 shadow-sm" : "border-neutral-850"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <strong className="text-xs font-bold text-white block">{item.name}</strong>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase ${
                            isLow ? "bg-amber-500/10 text-amber-500" : "bg-neutral-800 text-gray-400"
                          }`}>
                            STK: {item.stockLevel} units
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mb-3 font-mono">{item.category}</span>
                      </div>

                      <div className="pt-3 border-t border-neutral-900 flex justify-between items-center">
                        <span className="text-sm font-mono font-bold text-teal-400">₹{item.price.toLocaleString()}</span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stockLevel <= 0}
                          className="bg-red-600 disabled:bg-neutral-800 disabled:text-gray-500 hover:bg-red-700 text-black font-mono font-bold text-[10px] px-3.5 py-1.5 rounded cursor-pointer"
                        >
                          {item.stockLevel > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing Cart sidebar */}
            <div className="space-y-6">
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                  <ShoppingBag className="text-red-500 w-4 h-4" /> SHOPPING BILLING CHECKOUT
                </h3>

                {checkoutResult?.status === "success" && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-xs mb-4">
                    <strong className="block font-mono text-[11px]">TRANSACTION SUCCESSFUL</strong>
                    <p className="mt-1">Invoice {checkoutResult.invoice} has been recorded into ledgers. Inventory reduced.</p>
                  </div>
                )}

                {checkoutResult?.status === "stale" && (
                  <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-500 rounded text-xs mb-4">
                    Product is stale or insufficient stock levels in storage! Fulfill purchase manually.
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Linked Member</label>
                    <select
                      value={posMemberId}
                      onChange={(e) => setPosMemberId(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white"
                    >
                      <option value="walkin">Walk-in Guest</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Cart lines lists */}
                  <div className="border-t border-b border-neutral-850 py-3 space-y-2.5 max-h-[180px] overflow-y-auto">
                    {cart.map(line => (
                      <div key={line.item.id} className="flex justify-between items-center text-xs">
                        <div className="max-w-[150px] truncate">
                          <span className="text-white font-medium block truncate">{line.item.name}</span>
                          <span className="text-[10px] text-gray-500">₹{line.item.price} each</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleUpdateCartQty(line.item.id, line.qty - 1)}
                            className="bg-neutral-900 border border-neutral-800 w-6 h-6 flex items-center justify-center rounded text-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-white font-mono text-xs w-6 text-center">{line.qty}</span>
                          <button 
                            onClick={() => handleUpdateCartQty(line.item.id, line.qty + 1)}
                            className="bg-neutral-900 border border-neutral-800 w-6 h-6 flex items-center justify-center rounded text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    {cart.length === 0 && (
                      <div className="text-center py-6 text-gray-650 font-mono text-[10px]">
                        [ Shopping cart is empty ]
                      </div>
                    )}
                  </div>

                  {/* Coupon promotion input */}
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Promo discount code</label>
                    <input
                      type="text"
                      value={posCouponCode}
                      onChange={(e) => setPosCouponCode(e.target.value)}
                      placeholder="e.g. VALHALLA15"
                      className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs uppercase"
                    />
                  </div>

                  {/* Razorpay simulated triggers */}
                  <button
                    onClick={handlePOSCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-red-600 disabled:bg-neutral-850 disabled:text-gray-500 hover:bg-red-700 text-black py-2.5 rounded font-mono font-bold text-xs uppercase cursor-pointer"
                  >
                    TRIGGER RAZORPAY CHECKOUT
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 9 : LOCKER OCCUPANCY GRIDS ======================= */}
        {activeTab === "lockers" && (
          <motion.div 
            key="lockers"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Lockers Grid */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">VIKINGS PHYSICAL SPA LOCKERS OCCUPANCY BOARD</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {lockers.map(l => (
                  <div 
                    key={l.id} 
                    className={`p-4 rounded-lg border text-center relative flex flex-col justify-between min-h-[120px] ${
                      l.status === "Occupied" 
                        ? "bg-red-950/20 border-red-900/60 text-red-400" 
                        : l.status === "Maintenance" 
                        ? "bg-amber-950/20 border-amber-900/60 text-amber-500" 
                        : "bg-emerald-950/10 border-emerald-900/40 text-emerald-500"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-mono font-black block mb-2">{l.number}</span>
                      <span className="text-[9px] uppercase font-mono block mb-1 font-bold">{l.status}</span>
                      {l.status === "Occupied" && (
                        <span className="text-[10px] text-gray-300 block truncate" title={l.assignedMemberName}>
                          {l.assignedMemberName}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-2 border-t border-black/30 flex justify-center">
                      {l.status === "Occupied" ? (
                        <button
                          onClick={() => handleReleaseLocker(l.id)}
                          className="text-[9px] font-mono text-red-500 hover:underline cursor-pointer"
                        >
                          RELEASE
                        </button>
                      ) : l.status === "Available" ? (
                        <button
                          onClick={() => setLockerSelectedId(l.id)}
                          className="text-[9px] font-mono text-emerald-400 hover:underline cursor-pointer"
                        >
                          ASSIGN
                        </button>
                      ) : (
                        <span className="text-[9px] text-gray-500 font-mono">REPAIR</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Locker assignment console */}
            <div className="space-y-6">
              {lockerSelectedId && (
                <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                    ASSIGN LOCKER SLOT KEY
                  </h3>

                  <form onSubmit={handleAssignLockerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Linked Member</label>
                      <select
                        value={lockerMemberId}
                        onChange={(e) => setLockerMemberId(e.target.value)}
                        required
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white"
                      >
                        <option value="">-- select --</option>
                        {members.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Rent Amount (₹)</label>
                        <input
                          type="number"
                          value={lockerRent}
                          onChange={(e) => setLockerRent(Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Duration (Months)</label>
                        <input
                          type="number"
                          value={lockerMonths}
                          onChange={(e) => setLockerMonths(Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-black py-2 rounded font-mono font-bold text-xs uppercase"
                    >
                      COMMIT KEY ASSIGNMENT
                    </button>
                  </form>
                </div>
              )}

              {/* Equipment Maintenance logs */}
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                  EQUIPMENT MAINTENANCE SCHEDULER
                </h3>

                <div className="space-y-3 max-h-[300px] overflow-y-auto text-xs">
                  {equipment.map(e => {
                    const needsSvc = e.status === "Needs Service";
                    return (
                      <div 
                        key={e.id} 
                        className={`p-3 bg-neutral-950 rounded border ${
                          needsSvc ? "border-amber-500/50" : "border-neutral-900"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <strong className="text-white text-xs block">{e.name}</strong>
                          <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${
                            needsSvc ? "bg-amber-500 text-black" : "bg-neutral-800 text-gray-400"
                          }`}>
                            {e.status}
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-500 font-mono mt-1">Last: {e.lastServiceDate} | Next: {e.nextServiceDate}</p>
                        {e.notes && <p className="text-[10px] text-gray-400 bg-neutral-950 p-1 rounded mt-2">{e.notes}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 10 : FINANCE P&L & EXPENSES ======================= */}
        {activeTab === "finance" && (
          <motion.div 
            key="finance"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Ledger Transactions list and invoices */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">REVENUE SALES TRANSACTIONS LEDGER</h3>
              
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-lg overflow-x-auto text-[10pt]">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-[#171717] font-mono text-gray-400 border-b border-neutral-850 text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Invoice / Member</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Method</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-neutral-950/60">
                        <td className="p-3">
                          <span className="font-bold text-gray-300 block">{p.invoiceNumber}</span>
                          <span className="text-[10px] text-gray-500">{p.memberName}</span>
                        </td>
                        <td className="p-3 text-gray-400">{p.date}</td>
                        <td className="p-3">
                          <span className="text-rose-500 font-bold">{p.paymentType}</span>
                        </td>
                        <td className="p-3 text-gray-400">{p.paymentMethod}</td>
                        <td className="p-3 text-right font-black text-white">₹{p.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Col: Expense add list */}
            <div className="space-y-6">
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">LOG BRANCH EXPENSE DEBIT</h3>
                
                <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Expense Category</label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2 rounded text-xs text-white"
                    >
                      <option value="Rent">Gym Rent/Premises</option>
                      <option value="Electricity">Power/MSEDCL bill</option>
                      <option value="Internet">ISP Broadband</option>
                      <option value="Salary">Staff Payroll</option>
                      <option value="Maintenance">Machine Repair / Oil</option>
                      <option value="Marketing">Social ads</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Amount Paid (₹)</label>
                    <input
                      type="number"
                      value={expAmount}
                      onChange={(e) => setExpAmount(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2 rounded text-xs text-white"
                      placeholder="e.g. 15000"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Paid To (Merchant Vendor)</label>
                    <input
                      type="text"
                      value={expPaidTo}
                      onChange={(e) => setExpPaidTo(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2 rounded text-xs text-white"
                      placeholder="e.g. MSEDCL Corporation"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Payment explanation</label>
                    <textarea
                      rows={2}
                      value={expDesc}
                      onChange={(e) => setExpDesc(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 p-2.5 rounded text-xs text-white focus:outline-none"
                      placeholder="Details of repair..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black py-2 rounded font-mono font-bold text-xs uppercase"
                  >
                    DEBIT CASH LEDGER
                  </button>
                </form>
              </div>

              {/* Profit Loss statement */}
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                  OPERATING REVENUE STATEMENT
                </h3>
                <ul className="space-y-2.5 text-xs font-mono">
                  <li className="flex justify-between py-1.5 border-b border-neutral-950">
                    <span className="text-gray-500">TOTAL PAID TRANSACTIONS:</span>
                    <strong className="text-teal-400">₹{totalRevenue.toLocaleString()}</strong>
                  </li>
                  <li className="flex justify-between py-1.5 border-b border-neutral-950">
                    <span className="text-gray-500">DEBITED MAINTENANCE EXPENSES:</span>
                    <strong className="text-amber-500">- ₹{totalExpenseAmount.toLocaleString()}</strong>
                  </li>
                  <li className="flex justify-between py-2 text-sm">
                    <span className="text-white font-bold">NET SURPLUS COINS:</span>
                    <strong className={netProfit >= 0 ? "text-emerald-400" : "text-rose-500"}>
                      ₹{netProfit.toLocaleString()}
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* ======================= TABS MODULE 11 : AUDIT LOGS & SYSTEM CODES ======================= */}
        {activeTab === "logs" && (
          <motion.div 
            key="logs"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Audit log transactions table */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">SYSTEM SECURITY CONTROL AUDIT LOGS</h3>
              
              <div className="bg-neutral-900/40 border border-neutral-850 rounded-lg overflow-x-auto text-[9pt] max-h-[500px] overflow-y-auto pr-1">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead className="bg-[#171717] font-mono text-gray-400 border-b border-neutral-850 text-[9px] uppercase">
                    <tr>
                      <th className="p-3">Timestamp / IP</th>
                      <th className="p-3">User Admin</th>
                      <th className="p-3">Ecosystem Module</th>
                      <th className="p-3">Trackable System Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-mono">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-neutral-950/60">
                        <td className="p-3 shrink-0">
                          <span className="text-white block">{log.timestamp}</span>
                          <span className="text-[9px] text-gray-500">{log.ipAddress}</span>
                        </td>
                        <td className="p-3">
                          <span className="text-gray-300 block">{log.userName}</span>
                          <span className="text-[9px] text-rose-500 font-bold">{log.role}</span>
                        </td>
                        <td className="p-3 text-gray-500 uppercase font-bold">{log.module}</td>
                        <td className="p-3 text-gray-300 max-w-[200px] truncate" title={log.action}>{log.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Col: Configure discount coupons code */}
            <div className="space-y-6">
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">CREATE DISCOUNT COUPON</h3>
                
                <form onSubmit={handleAddCouponSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Coupon Code string</label>
                    <input
                      type="text"
                      value={coupCode}
                      onChange={(e) => setCoupCode(e.target.value)}
                      required
                      placeholder="e.g. VIKINGFEST"
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2 rounded text-xs uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Coupon Type</label>
                      <select
                        value={coupType}
                        onChange={(e) => setCoupType(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FLAT">Flat Cash (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Value Amount</label>
                      <input
                        type="number"
                        value={coupValue}
                        onChange={(e) => setCoupValue(e.target.value)}
                        required
                        className="w-full bg-neutral-950 border border-neutral-800 px-3 py-2 rounded text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase">Total Usage limits</label>
                    <input
                      type="number"
                      value={coupLimit}
                      onChange={(e) => setCoupLimit(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 rounded text-xs text-white"
                      placeholder="100 instances"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-650 hover:bg-red-700 text-black py-2 rounded font-mono font-bold text-xs uppercase"
                  >
                    PUBLISH DISCOUNT CODE
                  </button>
                </form>
              </div>

              {/* Active Coupons Ledger */}
              <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">ACTIVE DISCOUNTS LIST</h3>
                <div className="space-y-3.5">
                  {coupons.map(c => (
                    <div key={c.id} className="p-3 bg-neutral-950 rounded border border-neutral-900 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-white font-mono font-bold block">{c.code}</span>
                        <span className="text-[10px] text-gray-500">Value: {c.type === "PERCENTAGE" ? `${c.value}%` : `₹${c.value}`}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Used {c.timesUsed} / {c.usageLimit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
