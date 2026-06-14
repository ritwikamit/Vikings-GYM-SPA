import {
  User,
  UserRole,
  Branch,
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
  PtPackage,
  PtSession,
  Equipment,
  Locker,
  Referral,
  AuditLog,
  Notification
} from "../types";
import {
  SEED_BRANCHES,
  SEED_USERS,
  SEED_MEMBERS,
  SEED_TRAINERS,
  SEED_PLANS,
  SEED_MEMBERSHIPS,
  SEED_ATTENDANCE,
  SEED_PAYMENTS,
  SEED_LEADS,
  SEED_EXPENSES,
  SEED_INVENTORY,
  SEED_WORKOUTS,
  SEED_DIETS,
  SEED_PROGRESS,
  SEED_ANNOUNCEMENTS,
  SEED_COUPONS,
  SEED_PT_PACKAGES,
  SEED_PT_SESSIONS,
  SEED_EQUIPMENT,
  SEED_LOCKERS,
  SEED_REFERRALS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS
} from "./seed";

// Unique keys for LocalStorage persistence
const KEYS = {
  CURRENT_USER: "vikings_user",
  CURRENT_BRANCH: "vikings_branch",
  BRANCHES: "vikings_branches",
  USERS: "vikings_users",
  MEMBERS: "vikings_members",
  TRAINERS: "vikings_trainers",
  PLANS: "vikings_plans",
  MEMBERSHIPS: "vikings_memberships",
  ATTENDANCE: "vikings_attendance",
  PAYMENTS: "vikings_payments",
  LEADS: "vikings_leads",
  EXPENSES: "vikings_expenses",
  INVENTORY: "vikings_inventory",
  WORKOUTS: "vikings_workouts",
  DIETS: "vikings_diets",
  PROGRESS: "vikings_progress",
  ANNOUNCEMENTS: "vikings_announcements",
  COUPONS: "vikings_coupons",
  PT_PACKAGES: "vikings_pt_packages",
  PT_SESSIONS: "vikings_pt_sessions",
  EQUIPMENT: "vikings_equipment",
  LOCKERS: "vikings_lockers",
  REFERRALS: "vikings_referrals",
  NOTIFICATIONS: "vikings_notifications",
  AUDIT_LOGS: "vikings_audit_logs"
};

// Standalone Type-Safe Database Utilities
function dbGet<T>(key: string): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : ([] as unknown as T);
  } catch {
    return [] as unknown as T;
  }
}

function dbSet<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function initItem<T>(key: string, seedData: T): void {
  if (!localStorage.getItem(key)) {
    dbSet(key, seedData);
  }
}

// Initial seeding setup
export function initStorage() {
  initItem(KEYS.BRANCHES, SEED_BRANCHES);
  initItem(KEYS.USERS, SEED_USERS);
  initItem(KEYS.MEMBERS, SEED_MEMBERS);
  initItem(KEYS.TRAINERS, SEED_TRAINERS);
  initItem(KEYS.PLANS, SEED_PLANS);
  initItem(KEYS.MEMBERSHIPS, SEED_MEMBERSHIPS);
  initItem(KEYS.ATTENDANCE, SEED_ATTENDANCE);
  initItem(KEYS.PAYMENTS, SEED_PAYMENTS);
  initItem(KEYS.LEADS, SEED_LEADS);
  initItem(KEYS.EXPENSES, SEED_EXPENSES);
  initItem(KEYS.INVENTORY, SEED_INVENTORY);
  initItem(KEYS.WORKOUTS, SEED_WORKOUTS);
  initItem(KEYS.DIETS, SEED_DIETS);
  initItem(KEYS.PROGRESS, SEED_PROGRESS);
  initItem(KEYS.ANNOUNCEMENTS, SEED_ANNOUNCEMENTS);
  initItem(KEYS.COUPONS, SEED_COUPONS);
  initItem(KEYS.PT_PACKAGES, SEED_PT_PACKAGES);
  initItem(KEYS.PT_SESSIONS, SEED_PT_SESSIONS);
  initItem(KEYS.EQUIPMENT, SEED_EQUIPMENT);
  initItem(KEYS.LOCKERS, SEED_LOCKERS);
  initItem(KEYS.REFERRALS, SEED_REFERRALS);
  initItem(KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  initItem(KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);

  if (!localStorage.getItem(KEYS.CURRENT_BRANCH)) {
    localStorage.setItem(KEYS.CURRENT_BRANCH, "b-aurangabad");
  }
}

initStorage();

// Strict external interface definitions
export interface IStorageManager {
  get<T>(key: string): T;
  set<T>(key: string, value: any): void;
  getCurrentUser(): User | null;
  setCurrentUser(user: User | null): void;
  getCurrentBranchId(): string;
  setCurrentBranchId(bid: string): void;
  writeLog(userName: string, userEmail: string, role: string, action: string, module: string): void;
  logAction(action: string, module: string): void;
  getBranches(): Branch[];
  getUsers(): User[];
  registerUser(user: User): boolean;
  getMembers(): Member[];
  addMember(member: any): Member;
  updateMember(id: string, updated: Partial<Member>): void;
  deleteMember(id: string): void;
  assignMembership(memberId: string, planId: string): void;
  updateMembershipStatus(membershipId: string, status: any, freezeDays?: number): void;
  getPlans(): MembershipPlan[];
  getMemberships(): MemberMembership[];
  getAttendance(): Attendance[];
  checkInMember(memberId: string, method?: "QR" | "MANUAL" | "RFID"): { success: boolean; message: string };
  checkOutMember(memberId: string): { success: boolean; message: string };
  getTrainers(): Trainer[];
  getPayments(): Payment[];
  getLeads(): Lead[];
  addLead(lead: Omit<Lead, "id" | "createdAt" | "gym_id" | "branch_id">): Lead;
  updateLeadStage(id: string, stage: any): void;
  getExpenses(): Expense[];
  addExpense(expense: any): Expense;
  getInventory(): InventoryItem[];
  addCoupon(coupon: any): Coupon;
  getCoupons(): Coupon[];
  assignWorkoutPlan(plan: any): WorkoutPlan;
  getWorkoutPlans(): WorkoutPlan[];
  assignDietPlan(plan: any): DietPlan;
  getDietPlans(): DietPlan[];
  addProgressRecord(record: any): ProgressRecord;
  getProgressRecords(): ProgressRecord[];
  getNotifications(): Notification[];
  markNotificationsRead(userId: string): void;
  checkoutPOS(memberId: string, items: any[], couponCode?: string): { success: boolean; discount?: number; invoice?: string };
  getLockers(): Locker[];
  assignLocker(id: string, memberId: string, rent: number, months: number): void;
  releaseLocker(id: string): void;
  getEquipment(): Equipment[];
  getPtSessions(): PtSession[];
  getPtPackages(): PtPackage[];
  getAuditLogs(): AuditLog[];
  addNotification(userId: string, title: string, message: string, type: any): void;
  getAnnouncements(): Announcement[];
  addAnnouncement(ann: Omit<Announcement, "id" | "pushed" | "gym_id" | "branch_id">): Announcement;
}

export const StorageManager: IStorageManager = {
  get<T>(key: string): T {
    return dbGet<T>(key);
  },

  set<T>(key: string, value: T): void {
    dbSet<T>(key, value);
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      this.writeLog(
        user.name,
        user.email,
        user.role,
        "User logged in successfully",
        "Authentication"
      );
    } else {
      const current = this.getCurrentUser();
      if (current) {
        this.writeLog(
          current.name,
          current.email,
          current.role,
          "User logged out",
          "Authentication"
        );
      }
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  getCurrentBranchId(): string {
    return localStorage.getItem(KEYS.CURRENT_BRANCH) || "b-aurangabad";
  },

  setCurrentBranchId(bid: string): void {
    localStorage.setItem(KEYS.CURRENT_BRANCH, bid);
  },

  writeLog(userName: string, userEmail: string, role: string, action: string, module: string) {
    const logs = dbGet<AuditLog[]>(KEYS.AUDIT_LOGS);
    const newLog: AuditLog = {
      id: "log-" + Date.now(),
      userName,
      userEmail,
      role,
      action,
      module,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      ipAddress: "127.0.0.1",
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    logs.unshift(newLog);
    dbSet(KEYS.AUDIT_LOGS, logs.slice(0, 500));
  },

  logAction(action: string, module: string) {
    const u = this.getCurrentUser();
    if (u) {
      this.writeLog(u.name, u.email, u.role, action, module);
    } else {
      this.writeLog("Unauthenticated Visitor", "visitor@vikings.com", "GUEST", action, module);
    }
  },

  getBranches(): Branch[] {
    return dbGet<Branch[]>(KEYS.BRANCHES);
  },

  getUsers(): User[] {
    return dbGet<User[]>(KEYS.USERS);
  },

  registerUser(user: User): boolean {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return false;
    }
    users.push(user);
    dbSet(KEYS.USERS, users);
    this.logAction(`Registered user ${user.name} with email ${user.email}`, "Authentication");
    return true;
  },

  getMembers(): Member[] {
    return dbGet<Member[]>(KEYS.MEMBERS);
  },

  addMember(member: Omit<Member, "id" | "bmi" | "gym_id" | "branch_id" | "joinedDate">): Member {
    const members = this.getMembers();
    const heightMeters = member.height / 100;
    const bmiVal = heightMeters > 0 ? Number((member.weight / (heightMeters * heightMeters)).toFixed(2)) : 0;
    const newMember: Member = {
      ...member,
      id: "m-" + Date.now(),
      bmi: bmiVal,
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId(),
      joinedDate: new Date().toISOString().substring(0, 10),
    };
    members.push(newMember);
    dbSet(KEYS.MEMBERS, members);
    this.logAction(`Created Member profile for ${member.name}`, "Members Module");
    return newMember;
  },

  updateMember(id: string, updated: Partial<Member>): void {
    const members = this.getMembers();
    const idx = members.findIndex(m => m.id === id);
    if (idx !== -1) {
      const merged = { ...members[idx], ...updated };
      const heightMeters = merged.height / 100;
      merged.bmi = heightMeters > 0 ? Number((merged.weight / (heightMeters * heightMeters)).toFixed(2)) : 0;
      members[idx] = merged;
      dbSet(KEYS.MEMBERS, members);
      this.logAction(`Updated Member profile metadata for ${merged.name}`, "Members Module");
    }
  },

  deleteMember(id: string): void {
    const members = this.getMembers();
    const filtered = members.filter(m => m.id !== id);
    dbSet(KEYS.MEMBERS, filtered);
    this.logAction(`Deleted Member ID: ${id} from directory`, "Members Module");
  },

  getTrainers(): Trainer[] {
    return dbGet<Trainer[]>(KEYS.TRAINERS);
  },

  getPlans(): MembershipPlan[] {
    return dbGet<MembershipPlan[]>(KEYS.PLANS);
  },

  getMemberships(): MemberMembership[] {
    return dbGet<MemberMembership[]>(KEYS.MEMBERSHIPS);
  },

  assignMembership(memberId: string, planId: string): void {
    const memberships = this.getMemberships();
    const plans = this.getPlans();
    const plan = plans.find(p => p.id === planId);
    const members = this.getMembers();
    const member = members.find(m => m.id === memberId);

    if (!plan || !member) throw new Error("Plan or Member record matches are stale!");

    const durationMonths = plan.durationMonths;
    const start = new Date();
    const end = new Date();
    end.setMonth(start.getMonth() + durationMonths);

    const newMembership: MemberMembership = {
      id: "ms-" + Date.now(),
      memberId,
      planId,
      planName: plan.name,
      startDate: start.toISOString().substring(0, 10),
      endDate: end.toISOString().substring(0, 10),
      price: plan.price,
      status: "ACTIVE",
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };

    memberships.push(newMembership);
    dbSet(KEYS.MEMBERSHIPS, memberships);

    // Create payment transaction
    const payments = this.getPayments();
    const newPayment: Payment = {
      id: "pay-" + Date.now(),
      memberId,
      memberName: member.name,
      amount: plan.price,
      paymentType: "Membership",
      paymentMethod: "UPI",
      status: "PAID",
      date: new Date().toISOString().substring(0, 10),
      invoiceNumber: "INV-" + Date.now().toString().substring(5, 13),
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    payments.unshift(newPayment);
    dbSet(KEYS.PAYMENTS, payments);

    this.addNotification(
      memberId,
      "Subscription Activated!",
      `Your plan ${plan.name} has been synchronized. Expired on ${newMembership.endDate}`,
      "Payment"
    );

    this.logAction(`Assigned Plan ${plan.name} to member ${member.name}, generated invoice`, "Billing System");
  },

  updateMembershipStatus(id: string, status: "ACTIVE" | "EXPIRED" | "FREEZED" | "CANCELLED", frozenDays?: number): void {
    const memberships = this.getMemberships();
    const idx = memberships.findIndex(m => m.id === id);
    if (idx !== -1) {
      memberships[idx].status = status;
      if (status === "FREEZED" && frozenDays) {
        const curEnd = new Date(memberships[idx].endDate);
        curEnd.setDate(curEnd.getDate() + frozenDays);
        memberships[idx].endDate = curEnd.toISOString().substring(0, 10);
      }
      dbSet(KEYS.MEMBERSHIPS, memberships);
      this.logAction(`Configured Subscription status to ${status} on record ${memberships[idx].memberName}`, "Billing System");
    }
  },

  getPayments(): Payment[] {
    return dbGet<Payment[]>(KEYS.PAYMENTS);
  },

  getAttendance(): Attendance[] {
    return dbGet<Attendance[]>(KEYS.ATTENDANCE);
  },

  checkInMember(memberId: string, method: "QR" | "MANUAL" | "RFID" = "QR"): { success: boolean; message: string } {
    const list = this.getMemberships();
    const activeSub = list.find(m => m.memberId === memberId && m.status === "ACTIVE");
    if (!activeSub) {
      return { success: false, message: "No active membership! Access locked at front counter." };
    }

    const members = this.getMembers();
    const mem = members.find(m => m.id === memberId);
    if (!mem) return { success: false, message: "Member matches are stale" };

    const attendance = this.getAttendance();
    const todayStr = new Date().toISOString().substring(0, 10);

    const alreadyCheckedIn = attendance.some(a => a.memberId === memberId && a.date === todayStr && !a.checkOutTime);
    if (alreadyCheckedIn) {
      return { success: false, message: "Already checked in today on gym floor!" };
    }

    const newCheckIn: Attendance = {
      id: "att-" + Date.now(),
      memberId,
      memberName: mem.name,
      memberEmail: mem.email,
      date: todayStr,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method,
      branch_id: this.getCurrentBranchId(),
      gym_id: "vikings-gyms"
    };

    attendance.unshift(newCheckIn);
    dbSet(KEYS.ATTENDANCE, attendance);

    this.logAction(`Logged CheckIn on visitor ${mem.name}`, "Attendance");
    return { success: true, message: `Access granted! Welcome ${mem.name}` };
  },

  checkOutMember(memberId: string): { success: boolean; message: string } {
    const attendance = this.getAttendance();
    const todayStr = new Date().toISOString().substring(0, 10);
    const log = attendance.find(a => a.memberId === memberId && a.date === todayStr && !a.checkOutTime);

    if (!log) {
      return { success: false, message: "Active check-in session matches are absent." };
    }

    log.checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dbSet(KEYS.ATTENDANCE, attendance);

    this.logAction(`Logged floor exit check-out for member ${log.memberName}`, "Attendance");
    return { success: true, message: `Gate unlocked. See you next workout!` };
  },

  getLeads(): Lead[] {
    return dbGet<Lead[]>(KEYS.LEADS);
  },

  addLead(lead: Omit<Lead, "id" | "createdAt" | "gym_id" | "branch_id">): Lead {
    const list = this.getLeads();
    const newLead: Lead = {
      ...lead,
      id: "ld-" + Date.now(),
      createdAt: new Date().toISOString().substring(0, 10),
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    list.unshift(newLead);
    dbSet(KEYS.LEADS, list);
    this.logAction(`Logged lead prospecting card for ${lead.name}`, "CRM Module");
    return newLead;
  },

  updateLeadStage(id: string, stage: Lead["stage"]): void {
    const list = this.getLeads();
    const idx = list.findIndex(l => l.id === id);
    if (idx !== -1) {
      list[idx].stage = stage;
      dbSet(KEYS.LEADS, list);
      this.logAction(`Transitioned lead ${list[idx].name} to stage: ${stage}`, "CRM Module");
    }
  },

  getExpenses(): Expense[] {
    return dbGet<Expense[]>(KEYS.EXPENSES);
  },

  addExpense(expense: Omit<Expense, "id" | "gym_id" | "branch_id">): Expense {
    const list = this.getExpenses();
    const newExp: Expense = {
      ...expense,
      id: "exp-" + Date.now(),
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    list.unshift(newExp);
    dbSet(KEYS.EXPENSES, list);
    this.logAction(`Logged brand debit transaction ₹${expense.amount} for ${expense.category}`, "Finances ledger");
    return newExp;
  },

  getInventory(): InventoryItem[] {
    return dbGet<InventoryItem[]>(KEYS.INVENTORY);
  },

  checkoutPOS(memberId: string, items: { id: string; qty: number }[], couponCode?: string): { success: boolean; discount?: number; invoice?: string } {
    const list = this.getInventory();
    let subtotal = 0;
    
    // Calculate POS totals catalog
    for (const item of items) {
      const match = list.find(i => i.id === item.id);
      if (!match || match.stockLevel < item.qty) {
        return { success: false };
      }
      subtotal += match.price * item.qty;
    }

    // Deduct inventory physical stock levels
    for (const item of items) {
      const idx = list.findIndex(i => i.id === item.id);
      list[idx].stockLevel -= item.qty;
      if (list[idx].stockLevel < list[idx].minAlertLevel) {
        this.addNotification("u-admin", "Low Stock Alert!", `${list[idx].name} is running low! Current Level: ${list[idx].stockLevel} units.`, "Expiry");
      }
    }
    dbSet(KEYS.INVENTORY, list);

    // Apply promo coupons code
    let discount = 0;
    if (couponCode) {
      const coupons = this.getCoupons();
      const coup = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
      if (coup && coup.timesUsed < coup.usageLimit) {
        if (coup.type === "PERCENTAGE") {
          discount = (subtotal * coup.value) / 100;
        } else {
          discount = coup.value;
        }
        coup.timesUsed += 1;
        dbSet(KEYS.COUPONS, coupons);
      }
    }

    const netTotal = Math.max(0, subtotal - discount);
    const invoiceNum = "INV-SHP-" + Date.now().toString().substring(6);

    // Register active revenue ledger payment
    const payments = this.getPayments();
    const newPayment: Payment = {
      id: "pay-" + Date.now(),
      memberId,
      memberName: memberId === "walkin" ? "Walk-in Guest Visitor" : (this.getMembers().find(m => m.id === memberId)?.name || "Gym Visitor"),
      amount: netTotal,
      paymentType: "POS",
      paymentMethod: "Card",
      status: "PAID",
      date: new Date().toISOString().substring(0, 10),
      invoiceNumber: invoiceNum,
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    payments.unshift(newPayment);
    dbSet(KEYS.PAYMENTS, payments);

    this.logAction(`Finalized supplement retail shop order net total ₹${netTotal}`, "Store POS");
    return { success: true, discount, invoice: invoiceNum };
  },

  getLockers(): Locker[] {
    return dbGet<Locker[]>(KEYS.LOCKERS);
  },

  assignLocker(id: string, memberId: string, rent: number, months: number): void {
    const list = this.getLockers();
    const idx = list.findIndex(l => l.id === id);
    const memName = this.getMembers().find(m => m.id === memberId)?.name || "Warrior Recruit";
    
    if (idx !== -1) {
      const start = new Date();
      const end = new Date();
      end.setMonth(start.getMonth() + months);

      list[idx].status = "Occupied";
      list[idx].assignedMemberId = memberId;
      list[idx].assignedMemberName = memName;
      list[idx].startDate = start.toISOString().substring(0, 10);
      list[idx].endDate = end.toISOString().substring(0, 10);
      list[idx].rentAmount = rent;

      dbSet(KEYS.LOCKERS, list);
      this.logAction(`Allocated Physical Locker ${list[idx].number} key code directly to member ${memName}`, "Facilities");
    }
  },

  releaseLocker(id: string): void {
    const list = this.getLockers();
    const idx = list.findIndex(l => l.id === id);
    if (idx !== -1) {
      list[idx].status = "Available";
      list[idx].assignedMemberId = undefined;
      list[idx].assignedMemberName = undefined;
      list[idx].startDate = undefined;
      list[idx].endDate = undefined;
      dbSet(KEYS.LOCKERS, list);
      this.logAction(`Released locker key code slot ${list[idx].number} directly into pool`, "Facilities");
    }
  },

  getEquipment(): Equipment[] {
    return dbGet<Equipment[]>(KEYS.EQUIPMENT);
  },

  getPtSessions(): PtSession[] {
    return dbGet<PtSession[]>(KEYS.PT_SESSIONS);
  },

  getPtPackages(): PtPackage[] {
    return dbGet<PtPackage[]>(KEYS.PT_PACKAGES);
  },

  assignWorkoutPlan(plan: Omit<WorkoutPlan, "id" | "gym_id" | "branch_id">): WorkoutPlan {
    const list = this.getWorkoutPlans();
    const newPlan: WorkoutPlan = {
      ...plan,
      id: "wk-" + Date.now(),
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    list.push(newPlan);
    dbSet(KEYS.WORKOUTS, list);

    this.addNotification(
      plan.memberId,
      "New Workout Routine",
      `Trainer ${plan.trainerName} assigned a new '${plan.category}' workout plan is ready!`,
      "Announcement"
    );

    this.logAction(`Assigned training routine chart for member ${plan.memberName}`, "Workouts Module");
    return newPlan;
  },

  getWorkoutPlans(): WorkoutPlan[] {
    return dbGet<WorkoutPlan[]>(KEYS.WORKOUTS);
  },

  assignDietPlan(plan: Omit<DietPlan, "id" | "gym_id" | "branch_id">): DietPlan {
    const list = this.getDietPlans();
    const newPlan: DietPlan = {
      ...plan,
      id: "dt-" + Date.now(),
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    list.push(newPlan);
    dbSet(KEYS.DIETS, list);

    this.addNotification(
      plan.memberId,
      "New Nutritional Plan",
      `Daily macro and nutrition list assigned: Target ${plan.caloriesTarget} kcal.`,
      "Announcement"
    );

    this.logAction(`Assigned tailored diet plan of ${plan.caloriesTarget} kcal directly to ${plan.memberName}`, "Diet Module");
    return newPlan;
  },

  getDietPlans(): DietPlan[] {
    return dbGet<DietPlan[]>(KEYS.DIETS);
  },

  getProgressRecords(): ProgressRecord[] {
    return dbGet<ProgressRecord[]>(KEYS.PROGRESS);
  },

  addProgressRecord(record: Omit<ProgressRecord, "id" | "bmi" | "gym_id" | "branch_id">): ProgressRecord {
    const list = this.getProgressRecords();
    const member = this.getMembers().find(m => m.id === record.memberId);
    let bmiVal = 21;
    if (member) {
      const heightMeters = member.height / 100;
      bmiVal = heightMeters > 0 ? Number((record.weight / (heightMeters * heightMeters)).toFixed(2)) : 0;
      this.updateMember(member.id, { weight: record.weight, bmi: bmiVal });
    }

    const newRecord: ProgressRecord = {
      ...record,
      id: "prog-" + Date.now(),
      bmi: bmiVal,
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    list.push(newRecord);
    dbSet(KEYS.PROGRESS, list);

    this.logAction(`Logged fitness progress tracking diagnostics entry`, "Health Metrics");
    return newRecord;
  },

  getCoupons(): Coupon[] {
    return dbGet<Coupon[]>(KEYS.COUPONS);
  },

  addCoupon(coupon: Omit<Coupon, "id" | "timesUsed" | "gym_id" | "branch_id">): Coupon {
    const list = this.getCoupons();
    const newCoup: Coupon = {
      ...coupon,
      id: "cp-" + Date.now(),
      timesUsed: 0,
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    list.push(newCoup);
    dbSet(KEYS.COUPONS, list);
    this.logAction(`Published coupon code ${coupon.code} inside active retail billing systems`, "Coupons Module");
    return newCoup;
  },

  getNotifications(): Notification[] {
    return dbGet<Notification[]>(KEYS.NOTIFICATIONS);
  },

  addNotification(userId: string, title: string, message: string, type: any): void {
    const list = this.getNotifications();
    const newNotif: Notification = {
      id: "not-" + Date.now(),
      userId,
      title,
      message,
      type,
      date: new Date().toISOString().substring(0, 10),
      read: false,
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    list.unshift(newNotif);
    dbSet(KEYS.NOTIFICATIONS, list.slice(0, 100)); // limit notifications buffer count
  },

  markNotificationsRead(userId: string): void {
    const list = this.getNotifications();
    list.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    dbSet(KEYS.NOTIFICATIONS, list);
  },

  getAnnouncements(): Announcement[] {
    return dbGet<Announcement[]>(KEYS.ANNOUNCEMENTS);
  },

  addAnnouncement(ann: Omit<Announcement, "id" | "pushed" | "gym_id" | "branch_id">): Announcement {
    const list = this.getAnnouncements();
    const newAnn: Announcement = {
      ...ann,
      id: "ann-" + Date.now(),
      pushed: true,
      gym_id: "vikings-gyms",
      branch_id: this.getCurrentBranchId()
    };
    list.unshift(newAnn);
    dbSet(KEYS.ANNOUNCEMENTS, list);

    // Broadcast in-app alerts
    const target = ann.targetRole;
    const users = this.getUsers();
    users.forEach(u => {
      if (target === "ALL" || u.role.toString() === target) {
        this.addNotification(u.id, `Announcement: ${ann.title}`, ann.content, "Announcement");
      }
    });

    this.logAction(`Broadcast New Announcement: ${ann.title}`, "Announcement System");
    return newAnn;
  },

  getAuditLogs(): AuditLog[] {
    return dbGet<AuditLog[]>(KEYS.AUDIT_LOGS);
  }
};
