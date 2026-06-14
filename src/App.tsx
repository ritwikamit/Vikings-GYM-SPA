import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PublicWebsite from "./components/PublicWebsite";
import AuthGateway from "./components/AuthGateway";
import ERPModules from "./components/ERPModules";
import { UserRole } from "./types";

import { 
  MapPin, 
  Bell, 
  LogOut, 
  ShieldCheck,
  LayoutDashboard,
  Clock,
  Users,
  Award,
  Activity,
  ShoppingBag,
  FolderLock,
  DollarSign,
  Cpu,
  Briefcase,
  Smile,
  Wallet,
  QrCode,
  Menu,
  X
} from "lucide-react";
import logoPremium from "../assets/l.png";
import { membersAPI } from "./api";
import { useQuery } from "@tanstack/react-query";

const ProtectedRoute = ({ children, roles }: { children: any, roles?: string[] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500" />
    </div>
  );

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === UserRole.MEMBER ? "/member" : "/erp"} replace />;
  }

  return children;
};

// Console layout wrapper
const ConsoleLayout = ({ children, activeTab, setActiveTab }: any) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentBranchId, setCurrentBranchId] = useState("b-aurangabad");
  const [notifBoxOpen, setNotifBoxOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getSidebarTabs = () => {
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.GYM_OWNER:
        return [
          { key: "dashboard", label: "Dashboard Metrics", icon: LayoutDashboard },
          { key: "reception", label: "Reception desk", icon: Clock },
          { key: "members", label: "Member directory", icon: Users },
          { key: "plans", label: "Subscriptions Assign", icon: Award },
          { key: "trainers", label: "Coaching Ledgers", icon: Users },
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
    <div className="flex min-h-screen bg-black text-white font-sans antialiased relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`w-64 bg-[#0a0a0a] border-r border-red-950/20 shrink-0 flex-col justify-between fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 md:translate-x-0 ${isMobileSidebarOpen ? "translate-x-0 flex" : "-translate-x-full md:flex"}`}>
        <div>
          <div className="p-6 border-b border-red-950/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src={logoPremium} alt="Vikings Logo" className="h-8 w-auto" />
              <span className="font-mono text-sm font-black tracking-widest text-white block">
                VIKINGS <span className="text-red-500 block text-[10px] tracking-normal -mt-0.5">ERP MANAGER</span>
              </span>
            </div>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-[9px] font-mono text-gray-500 uppercase px-3 block mb-2 tracking-wider">COMMAND SYSTEMS</span>
            {getSidebarTabs().map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setIsMobileSidebarOpen(false);
                  }}
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

        <div className="p-4 border-t border-red-950/35 bg-neutral-950/40">
          <div className="flex items-center gap-3.5 mb-3 text-xs">
            <div className="bg-red-600/10 p-2 rounded text-red-500 font-mono font-black border border-red-900/35">
              {user.role.substring(0, 5)}
            </div>
            <div>
              <span className="font-bold text-white block truncate max-w-[120px]">{user.name}</span>
              <span className="text-[10px] text-gray-500 truncate block max-w-[120px]">{user.email}</span>
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

      <main className="flex-1 bg-black flex flex-col justify-between overflow-y-auto max-h-screen w-full overflow-x-hidden">
        <header className="bg-[#0b0b0b]/90 border-b border-red-950/20 px-4 sm:px-6 py-4 flex gap-4 justify-between items-center sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="md:hidden text-white mr-1" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <img src={logoPremium} alt="Vikings Logo" className="md:hidden h-8 w-auto hidden sm:block mr-2" />
            <MapPin className="text-red-500 w-4 h-4 hidden sm:block" />
            <span className="font-mono text-[10px] sm:text-xs font-bold text-gray-300 hidden sm:block">BRANCH CONTEXT:</span>
            
            {(user.role === UserRole.SUPER_ADMIN || user.role === UserRole.GYM_OWNER) ? (
              <select
                value={currentBranchId}
                onChange={(e) => setCurrentBranchId(e.target.value)}
                className="bg-[#121212] border border-neutral-850 text-xs text-white px-3.5 py-1.5 rounded focus:border-red-650 focus:outline-none"
              >
                <option value="b-aurangabad">Aurangabad (Default HQ)</option>
                <option value="b-pune">Pune Franchise Hub</option>
              </select>
            ) : (
              <span className="text-white text-xs font-mono font-black">Aurangabad</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setNotifBoxOpen(true)}
              className="relative p-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 rounded text-gray-400 hover:text-white cursor-pointer"
            >
              <Bell className="w-4 h-4" />
            </button>
            <div className="bg-[#121212] border border-neutral-850 rounded px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5">
              <ShieldCheck className="text-red-500 w-3.5 h-3.5" />
              <span className="text-gray-400">ROLE:</span>
              <span className="text-white text-[10px] uppercase">{user.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="md:hidden bg-red-600 p-2 rounded text-black hover:bg-red-700"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

// The Main App Routing Structure
export default function App() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // For the ERP layout
  const [activeTab, setActiveTab] = useState(() => {
    if (!user) return "dashboard";
    if (user.role === UserRole.RECEPTIONIST) return "reception";
    if (user.role === UserRole.TRAINER) return "members";
    return "dashboard";
  });

  // Automatically update active tab if user role doesn't support the current tab
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.RECEPTIONIST && activeTab === "dashboard") {
        setActiveTab("reception");
      } else if (user.role === UserRole.TRAINER && activeTab === "dashboard") {
        setActiveTab("members");
      }
    }
  }, [user]);

  // Auth Redirect Component for logged in users
  const AuthRedirect = ({ children }: { children: any }) => {
    if (isAuthenticated && user) {
      return <Navigate to={user.role === UserRole.MEMBER ? "/member" : "/erp"} replace />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicWebsite onJoinNow={() => navigate("/login")} onLoginClick={() => navigate("/login")} />} />
      <Route path="/login" element={
        <AuthRedirect>
          <AuthGateway onLoginSuccess={(role) => navigate(role === UserRole.MEMBER ? "/member" : "/erp")} onBackToWebsite={() => navigate("/")} />
        </AuthRedirect>
      } />

      {/* Secured Member Routes (For MEMBER Role) */}
      <Route 
        path="/member" 
        element={
          <ProtectedRoute roles={[UserRole.MEMBER]}>
            <ConsoleLayout activeTab="memberProfile" setActiveTab={() => {}}>
              <MemberSelfService />
            </ConsoleLayout>
          </ProtectedRoute>
        } 
      />

      {/* Secured Admin/ERP Routes (For Staff Roles) */}
      <Route 
        path="/erp" 
        element={
          <ProtectedRoute roles={[UserRole.SUPER_ADMIN, UserRole.GYM_OWNER, UserRole.RECEPTIONIST, UserRole.TRAINER]}>
            <ConsoleLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              <ERPModules currentUser={null as any} activeTab={activeTab} onLogAction={() => {}} />
            </ConsoleLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

// Minimal Member Self-Service UI Extracted here
const MemberSelfService = () => {
  const { user } = useAuth();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => membersAPI.getById("me").then(r => r.data.data),
    enabled: !!user
  });

  if (isLoading) return <div className="text-red-500 font-mono text-center mt-10">LOADING MEMBER DATA...</div>;
  if (!profile) return <div className="text-gray-400 font-mono text-center mt-10">NO DATA FOUND</div>;

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900/40 p-6 rounded-lg border border-neutral-850 space-y-6 max-w-md">
        <div>
          <div className="flex gap-4 items-center mb-6">
            <div className="bg-rose-500/10 p-3 rounded-full text-rose-500 shrink-0">
              <Smile className="w-8 h-8" />
            </div>
            <div>
              <span className="text-lg font-black text-white block">Welcome back,</span>
              <span className="text-sm font-mono text-red-500 font-bold uppercase block">{user?.name}</span>
            </div>
          </div>
          <div className="bg-black/60 border border-neutral-850 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="text-amber-500 w-5 h-5 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-mono">VIKINGS WALLET METRIC:</span>
                <strong className="text-sm text-white">₹{profile.wallet_balance || 0} credits</strong>
              </div>
            </div>
            <span className="text-[9px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-950">
              ACTIVE REWARDS
            </span>
          </div>
        </div>
        <div className="border border-neutral-850/60 p-4 rounded-lg text-center bg-[#0a0a0a]">
          <span className="text-[10px] font-mono font-bold text-gray-500 tracking-widest block mb-2 uppercase">VIRTUAL ACCESS KEY</span>
          <div className="bg-white p-3 rounded inline-block mx-auto">
            <QrCode className="w-24 h-24 text-black" />
          </div>
          <span className="block text-[9px] text-gray-600 mt-2 font-mono uppercase">ID: {user?.id}</span>
        </div>
      </div>
    </div>
  );
};
