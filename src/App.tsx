import React, { useState, useEffect } from "react";
import { StorageManager } from "./data/store";
import { User, UserRole, Branch, Member, Trainer, Attendance, MemberMembership, WorkoutPlan, DietPlan, ProgressRecord, Notification } from "./types";
import PublicWebsite from "./components/PublicWebsite";
import AuthGateway from "./components/AuthGateway";
import ERPModules from "./components/ERPModules";
import { 
  Dumbbell, 
  MapPin, 
  Sparkles, 
  Bell, 
  UserCheck, 
  LogOut, 
  ShieldCheck,
  TrendingUp,
  LayoutDashboard,
  Clock,
  Users,
  Award,
  Activity,
  ShoppingBag,
  FolderLock,
  DollarSign,
  Cpu,
  BookmarkCheck,
  QrCode,
  Wallet,
  Plus,
  RefreshCw,
  Sliders,
  Briefcase,
  Smile
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logoPremium from "@/assets/l.png";

export default function App() {
  // Navigation states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentBranchId, setCurrentBranchId] = useState("b-aurangabad");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appState, setAppState] = useState<"WEBSITE" | "AUTH" | "CONSOLE">("WEBSITE");

  // Dynamic self-service member states
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);
  const [memberWorkout, setMemberWorkout] = useState<WorkoutPlan | null>(null);
  const [memberDiet, setMemberDiet] = useState<DietPlan | null>(null);
  const [memberMembership, setMemberMembership] = useState<MemberMembership | null>(null);
  const [memberProgressHistory, setMemberProgressHistory] = useState<ProgressRecord[]>([]);

  // Notifications inbox states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifBoxOpen, setNotifBoxOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sync session auth on startup
  useEffect(() => {
    const cachedUser = StorageManager.getCurrentUser();
    if (cachedUser) {
      setCurrentUser(cachedUser);
      setAppState("CONSOLE");
      
      // Select appropriate default tab for non-admin roles
      if (cachedUser.role === UserRole.RECEPTIONIST) {
        setActiveTab("reception");
      } else if (cachedUser.role === UserRole.TRAINER) {
        setActiveTab("members");
      } else if (cachedUser.role === UserRole.MEMBER) {
        setActiveTab("memberProfile");
      } else {
        setActiveTab("dashboard");
      }
    }
    const cachedBranch = StorageManager.getCurrentBranchId();
    if (cachedBranch) {
      setCurrentBranchId(cachedBranch);
    }
  }, []);

  // Fetch Member-Specific Details is Member logs in
  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.MEMBER) {
      const matchMem = StorageManager.getMembers().find(
        m => m.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (matchMem) {
        setMemberProfile(matchMem);
        
        // Find their active workout plan, diets, memberships
        const activeWorkout = StorageManager.getWorkoutPlans().find(w => w.memberId === matchMem.id);
        const activeDiet = StorageManager.getDietPlans().find(d => d.memberId === matchMem.id);
        const activeMS = StorageManager.getMemberships().find(mm => mm.memberId === matchMem.id && mm.status === "ACTIVE");
        const progHistory = StorageManager.getProgressRecords().filter(p => p.memberId === matchMem.id);

        setMemberWorkout(activeWorkout || null);
        setMemberDiet(activeDiet || null);
        setMemberMembership(activeMS || null);
        setMemberProgressHistory(progHistory);
      }
    }

    if (currentUser) {
      // Load notifications
      const inbox = StorageManager.getNotifications().filter(
        n => n.userId === currentUser.id || n.userId === "u-admin"
      );
      setNotifications(inbox);
    }
  }, [currentUser, refreshTrigger]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setAppState("CONSOLE");
    setRefreshTrigger(prev => prev + 1);

    if (user.role === UserRole.RECEPTIONIST) {
      setActiveTab("reception");
    } else if (user.role === UserRole.TRAINER) {
      setActiveTab("members");
    } else if (user.role === UserRole.MEMBER) {
      setActiveTab("memberProfile");
    } else {
      setActiveTab("dashboard");
    }
  };

  const handleLogout = () => {
    StorageManager.setCurrentUser(null);
    setCurrentUser(null);
    setMemberProfile(null);
    setAppState("WEBSITE");
  };

  const handleBranchChange = (bid: string) => {
    setCurrentBranchId(bid);
    StorageManager.setCurrentBranchId(bid);
    StorageManager.logAction(`Switched active environment branch context to ${bid}`, "Branch Settings");
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAddMemberProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberProfile) return;
    
    // Retrieve input values dynamically from simple form prompt
    const weightVal = parseFloat(prompt("Enter current weight in KG:", memberProfile.weight.toString()) || "");
    const bodyFatVal = parseFloat(prompt("Enter estimated body fat %:", "18") || "");
    
    if (weightVal > 0) {
      StorageManager.addProgressRecord({
        memberId: memberProfile.id,
        date: new Date().toISOString().substring(0, 10),
        weight: weightVal,
        bodyFatPct: bodyFatVal || 18,
        measurements: {
          chest: 104,
          waist: 88,
          arms: 38,
          neck: 40,
          thigh: 56
        }
      });
      alert("Metrics successfully recorded into clinical files!");
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const activeBranch = StorageManager.getBranches().find(b => b.id === currentBranchId) || {name: "Vikings Aurangabad"};

  // Define sidebar navigation tabs strictly by RBAC roles
  const getSidebarTabs = () => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.GYM_OWNER:
        return [
          { key: "dashboard", label: "Dashboard Metrics", icon: LayoutDashboard },
          { key: "reception", label: "Reception desk", icon: Clock },
          { key: "members", label: "Member directory", icon: Users },
          { key: "plans", label: "Subscriptions Assign", icon: Award },
          { key: "trainers", label: "Coaching Ledgers", icon: Sliders },
          { key: "leads", label: "Leads CRM Kanban", icon: Briefcase },
          { key: "workouts", label: "Diets & exercises", icon: Activity },
          { key: "storepos", label: "Supplement POS Cafe", icon: ShoppingBag },
          { key: "lockers", label: "Lockers & Assets", icon: FolderLock },
          { key: "finance", label: "Operating Finances", icon: DollarSign },
          { key: "logs", label: "Security Audit logs", icon: Cpu },
        ];
      case UserRole.RECEPTIONIST:
        return [
          { key: "reception", label: "Reception desk", icon: Clock },
          { key: "members", label: "Member directory", icon: Users },
          { key: "plans", label: "Subscriptions Assign", icon: Award },
          { key: "leads", label: "Leads CRM Kanban", icon: Briefcase },
          { key: "storepos", label: "Supplement POS Cafe", icon: ShoppingBag },
          { key: "lockers", label: "Lockers & Assets", icon: FolderLock },
          { key: "finance", label: "Operating Finances", icon: DollarSign },
        ];
      case UserRole.TRAINER:
        return [
          { key: "members", label: "Member directory", icon: Users },
          { key: "leads", label: "Leads CRM Kanban", icon: Briefcase },
          { key: "workouts", label: "Diets & exercises", icon: Activity },
          { key: "lockers", label: "Lockers & Assets", icon: FolderLock },
        ];
      case UserRole.MEMBER:
        return [
          { key: "memberProfile", label: "My Warrior Profile", icon: Users },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-black text-gray-200 min-h-screen font-sans antialiased select-none">
      <AnimatePresence mode="wait">
        
        {/* WEBSITES LANDING FRAME */}
        {appState === "WEBSITE" && (
          <motion.div 
            key="website"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PublicWebsite 
              onJoinNow={() => setAppState("AUTH")} 
              onLoginClick={() => setAppState("AUTH")} 
            />
          </motion.div>
        )}

        {/* AUTH FORMS LANDING FRAME */}
        {appState === "AUTH" && (
          <motion.div 
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuthGateway 
              onLoginSuccess={handleLoginSuccess}
              onBackToWebsite={() => setAppState("WEBSITE")}
            />
          </motion.div>
        )}

        {/* SECURE CORE ERP APPLICATION FRAME */}
        {appState === "CONSOLE" && currentUser && (
          <motion.div 
            key="console"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-screen"
          >
            {/* Left Sidebar Layout */}
            <aside className="w-64 bg-[#0a0a0a] border-r border-red-950/20 shrink-0 hidden md:flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-red-950/30 flex items-center gap-3">
                  <div className="bg-red-600 p-1.5 rounded">
                    <img src={logoPremium} alt="Vikings Logo" className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-sm font-black tracking-widest text-white block">
                    VIKINGS <span className="text-red-500 block text-[10px] tracking-normal -mt-0.5">ERP MANAGER</span>
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <span className="text-[9px] font-mono text-gray-500 uppercase px-3 block mb-2 tracking-wider">COMMAND SYSTEMS</span>
                  {getSidebarTabs().map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-semibold cursor-pointer tracking-wide font-mono transition-all uppercase ${
                          isActive 
                            ? "bg-red-600 font-bold text-black shadow shadow-red-900/10" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 transition-transform" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logged in footer card info */}
              <div className="p-4 border-t border-red-950/35 bg-neutral-950/40">
                <div className="flex items-center gap-3.5 mb-3 text-xs">
                  <div className="bg-red-600/10 p-2 rounded text-red-500 font-mono font-black border border-red-900/35">
                    {currentUser.role.substring(0, 5)}
                  </div>
                  <div>
                    <span className="font-bold text-white block truncate max-w-[120px]" title={currentUser.name}>{currentUser.name}</span>
                    <span className="text-[10px] text-gray-500 truncate block max-w-[120px]" title={currentUser.email}>{currentUser.email}</span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full bg-[#121212] hover:bg-neutral-900 border border-neutral-850 hover:border-red-950 text-gray-400 hover:text-red-500 py-2 rounded text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> SECURE EXIT
                </button>
              </div>
            </aside>

            {/* Right main panel viewport */}
            <main className="flex-1 bg-black flex flex-col justify-between overflow-y-auto max-h-screen">
              
              {/* Main ERP Header Block */}
              <header className="bg-[#0b0b0b]/90 border-b border-red-950/20 px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-0 z-40 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="md:hidden bg-red-650 p-2 rounded mr-2">
                    <img src={logoPremium} alt="Vikings Logo" className="w-5 h-5" />
                  </div>
                  <MapPin className="text-red-500 w-4 h-4" />
                  <span className="font-mono text-xs font-bold text-gray-300">BRANCH CONTEXT:</span>
                  
                  {currentUser.role === UserRole.SUPER_ADMIN || currentUser.role === UserRole.GYM_OWNER ? (
                    <select
                      value={currentBranchId}
                      onChange={(e) => handleBranchChange(e.target.value)}
                      className="bg-[#121212] border border-neutral-850 text-xs text-white px-3.5 py-1.5 rounded focus:border-red-650 focus:outline-none"
                    >
                      <option value="b-aurangabad">Aurangabad (Default HQ)</option>
                      <option value="b-pune">Pune Franchise Hub</option>
                    </select>
                  ) : (
                    <span className="text-white text-xs font-mono font-black">{activeBranch.name}</span>
                  )}
                </div>

                {/* Notifications & Action controls */}
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setNotifBoxOpen(true)}
                    className="relative p-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 rounded text-gray-400 hover:text-white cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-black font-mono font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>

                  <div className="bg-[#121212] border border-neutral-850 rounded px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5">
                    <ShieldCheck className="text-red-500 w-3.5 h-3.5" />
                    <span className="text-gray-400">ROLE:</span>
                    <span className="text-white text-[10px] uppercase">{currentUser.role}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="md:hidden bg-red-600 p-2 rounded text-black hover:bg-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </header>

              {/* Viewport Core content switcher router */}
              <div className="flex-1">
                {activeTab === "memberProfile" && currentUser.role === UserRole.MEMBER ? (
                  /* ======================= EXPERT: SELF SERVICE PORTAL FRONTEND ======================= */
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Member Identity QR code and balance credit */}
                      <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850 space-y-6 flex flex-col justify-between">
                        <div>
                          <div className="flex gap-4 items-center mb-6">
                            <div className="bg-rose-500/10 p-3 rounded-full text-rose-500 shrink-0">
                              <Smile className="w-8 h-8" />
                            </div>
                            <div>
                              <span className="text-lg font-black text-white block">Welcome back,</span>
                              <span className="text-sm font-mono text-red-500 font-bold uppercase block">{currentUser.name}</span>
                            </div>
                          </div>

                          <div className="bg-black/60 border border-neutral-850 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Wallet className="text-amber-500 w-5 h-5 shrink-0" />
                              <div>
                                <span className="text-[10px] text-gray-500 uppercase block font-mono">VIKINGS WALLET METRIC:</span>
                                <strong className="text-sm text-white">₹{memberProfile?.walletCredits || 0} credits</strong>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-950">
                              ACTIVE REWARDS
                            </span>
                          </div>
                        </div>

                        {/* Virtual Identification QR Code */}
                        <div className="border border-neutral-850/60 p-4 rounded-lg text-center bg-[#0a0a0a]">
                          <span className="text-[10px] font-mono text-gray-500 uppercase block mb-3">YOUR SCAN ENTRY RECEPTION TICKET</span>
                          <div className="w-36 h-36 bg-white mx-auto flex items-center justify-center p-2 rounded">
                            {/* SVG mockup of clean QR code */}
                            <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="square">
                              <rect x="5" y="5" width="25" height="25" fill="black" />
                              <rect x="5" y="70" width="25" height="25" fill="black" />
                              <rect x="70" y="5" width="25" height="25" fill="black" />
                              <path d="M 45,5 H 55 V 15 H 45 Z" fill="black" />
                              <path d="M 5,45 H 15 V 55 H 5 Z" fill="black" />
                              <path d="M 45,45 H 55 V 55 H 45 Z" fill="black" />
                              <path d="M 85,85 H 95 V 95 H 85 Z" fill="black" />
                              <path d="M 60,60 H 70 V 70 H 60 Z" fill="black" />
                              <path d="M 40,80 H 50 V 90 H 40 Z" fill="black" />
                            </svg>
                          </div>
                          <span className="text-[10px] font-mono text-gray-300 block mt-4 font-bold">MEMBER ID KEY: {memberProfile?.id}</span>
                          <span className="text-[9px] text-gray-500 block mt-1">Display this code to front-desk camera gate on arrival</span>
                        </div>
                      </div>

                      {/* Members active Sub and metrics progress */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">ACTIVE PASS CARD SUBSCRIPTION</h3>
                          {memberMembership ? (
                            <div className="p-4 bg-red-650/10 rounded border border-red-950 flex justify-between items-center flex-col sm:flex-row gap-4">
                              <div>
                                <strong className="text-white text-base block">{memberMembership.planName}</strong>
                                <span className="text-xs text-gray-400 font-mono">Validity: {memberMembership.startDate} to {memberMembership.endDate}</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full animate-pulse border border-emerald-900">
                                ACTIVE PASS LEVEL
                              </span>
                            </div>
                          ) : (
                            <div className="p-6 bg-red-500/15 border border-red-500/30 text-red-500 text-center rounded-lg">
                              No active membership registered! Access denied at receptionist counter. Please see Pooja Sharma at CIDCO office Town Center.
                            </div>
                          )}
                        </div>

                        {/* Workout assigned list */}
                        <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">YOUR COMBAT WORKOUT TEMPLATE</h3>
                          {memberWorkout ? (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-neutral-850 text-xs">
                                <span className="text-white font-mono font-bold">PROGRAM: {memberWorkout.name}</span>
                                <span className="text-rose-500 font-mono uppercase bg-red-500/10 px-2 py-0.5 rounded">Category: {memberWorkout.category}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                                {memberWorkout.exercises.map((ex, i) => (
                                  <div key={i} className="p-3 bg-neutral-950 rounded border border-neutral-850">
                                    <div className="flex justify-between items-start mb-1.5 text-[11px]">
                                      <strong className="text-white">{ex.name}</strong>
                                      <span className="text-red-500 text-[10px] font-black">{ex.sets}s × {ex.reps}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 leading-normal block italic">{ex.day} - {ex.notes}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-xs text-gray-500 font-mono">
                              [ No exercises routine compiled by Coach Thor yet. Visit direct coaching lounge to register ! ]
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Diet tracking section */}
                      <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850">
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">NUTRITIONAL DIET MACROS SHEETS</h3>
                        {memberDiet ? (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-neutral-850 text-xs font-mono">
                              <span className="text-white font-bold">TOTAL CALORIC BLUEPRINT:</span>
                              <span className="text-amber-500 font-black">{memberDiet.caloriesTarget} KCAL / DAY</span>
                            </div>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                              {memberDiet.meals.map((meal, index) => (
                                <div key={index} className="p-2.5 bg-neutral-950 rounded border border-neutral-900 flex justify-between items-center text-xs">
                                  <div>
                                    <span className="text-gray-300 font-mono block">{meal.time} - {meal.type}</span>
                                    <p className="text-[10px] text-gray-400 mt-1 leading-normal">{meal.description}</p>
                                  </div>
                                  <span className="text-rose-500 font-mono font-bold">{meal.caloriesEstimate} cal</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-xs text-gray-500 font-mono">
                            [ No customized macros specified. Standard active advice: consume 2.2g of protein per KG lean mass ]
                          </div>
                        )}
                      </div>

                      {/* Weight tracker logs */}
                      <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">HISTORICAL PHYSIOLOGY METRICS</h3>
                            <button
                              onClick={handleAddMemberProgress}
                              className="bg-red-650 hover:bg-red-700 text-black py-1 px-3 rounded font-mono font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" /> TRACK METRICS
                            </button>
                          </div>
                          <div className="space-y-2.5 max-h-[180px] overflow-y-auto font-mono text-[10pt] pr-2">
                            {memberProgressHistory.map((pr, idx) => (
                              <div key={idx} className="p-2 bg-neutral-950/60 rounded border border-neutral-900 flex justify-between text-xs">
                                <span className="text-white">{pr.date}</span>
                                <span className="text-rose-500">Weight: {pr.weight} kg</span>
                                <span className="text-amber-500">BMI Match: {pr.bmi}</span>
                              </div>
                            ))}
                            {memberProgressHistory.length === 0 && (
                              <div className="text-center py-6 text-gray-500 text-xs">No progress charts entered. Calculate BMI inside public homepage!</div>
                            )}
                          </div>
                        </div>

                        <div className="bg-[#050505] p-3 rounded-lg border border-neutral-900 mt-6">
                          <p className="text-[10px] text-gray-500 leading-normal">
                            *Note: Tracked physical entries compile weight levels and automatically synchronize your BMI index scales safely on live databases.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ======================= ENTERPRISE BACKEND CONNEL CHANNELS ======================= */
                  <ERPModules 
                    currentUser={currentUser}
                    activeTab={activeTab}
                    onLogAction={(act, mod) => {
                      StorageManager.logAction(act, mod);
                      setRefreshTrigger(prev => prev + 1);
                    }}
                  />
                )}
              </div>

              {/* Secure Footer credits in ERP console */}
              <footer className="bg-[#050505] border-t border-red-950/20 px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-mono shrink-0">
                <span>VIKINGS NETWORK SYSTEM: PORT 3000 ACTIVE</span>
                <span>REACTIVE ENCRYPTION SYSTEM DEPLOYED</span>
                <span>AUTHENTICATED USER ID: {currentUser.id}</span>
              </footer>

            </main>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ======================= NOTIFICATIONS INBOX DIALOG MODAL ======================= */}
      {notifBoxOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-neutral-950 border border-neutral-800 p-8 rounded-xl shadow-2xl relative"
          >
            <button 
              onClick={() => {
                setNotifBoxOpen(false);
                StorageManager.markNotificationsRead(currentUser.id);
                setRefreshTrigger(prev => prev + 1);
              }} 
              className="absolute right-4 top-4 text-xs font-mono text-gray-500 hover:text-white"
            >
              [ACKNOWLEDGE ALL]
            </button>

            <h3 className="text-lg font-mono font-black text-white uppercase tracking-tight mb-2">
              VIKINGS IN-APP NOTIFICATIONS ({notifications.filter(n => !n.read).length})
            </h3>
            <p className="text-[10px] text-gray-500 mb-6 font-mono uppercase">
              REAL-TIME BROADCAST SYSTEM
            </p>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {notifications.map(n => (
                <div key={n.id} className={`p-4 rounded border text-xs leading-normal ${n.read ? 'bg-neutral-900/30 border-neutral-900 text-gray-400' : 'bg-red-500/5 border-red-950/60 text-gray-200 font-medium'}`}>
                  <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
                    <span className="text-white font-mono">{n.title}</span>
                    <span className="text-[9px] text-gray-500">{n.date}</span>
                  </div>
                  <p>{n.message}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-12 text-xs text-gray-500 font-mono">
                  [ System inbox clean. No priority alerts found ]
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
