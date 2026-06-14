export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  GYM_OWNER = "GYM_OWNER",
  RECEPTIONIST = "RECEPTIONIST",
  TRAINER = "TRAINER",
  MEMBER = "MEMBER",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  gym_id: string;
  branch_id: string;
  profilePhoto?: string;
  phone?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  gym_id: string;
}

export interface Member {
  id: string;
  userId?: string; // Link to user account if they sign up/login
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  bloodGroup: string;
  medicalConditions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  photoUrl: string;
  fitnessGoal: string;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  referralCode: string;
  referredBy?: string; // code
  referredById?: string; // member id
  walletCredits: number;
  gym_id: string;
  branch_id: string;
  joinedDate: string;
}

export interface MembershipPlan {
  id: string;
  name: string; // e.g. "Monthly Black Card", "Annual VIP"
  durationMonths: number;
  price: number;
  description: string;
  gym_id: string;
  branch_id: string;
}

export interface MemberMembership {
  id: string;
  memberId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  status: "ACTIVE" | "EXPIRED" | "FREEZED" | "CANCELLED";
  frozenDays?: number;
  gym_id: string;
  branch_id: string;
}

export interface Trainer {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  email: string;
  experienceYears: number;
  certifications: string[];
  specializations: string[];
  salary: number;
  commissionRate: number; // percentage on PT sessions
  assignedClientsCount: number;
  rating: number;
  gym_id: string;
  branch_id: string;
}

export interface Attendance {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  durationMinutes?: number;
  method: "QR" | "MANUAL" | "RFID";
  gym_id: string;
  branch_id: string;
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  paymentMethod: "Razorpay" | "UPI" | "Cash" | "Card";
  paymentType: "Membership" | "POS" | "PT_Package" | "Locker";
  status: "PAID" | "PENDING" | "FAILED";
  invoiceNumber: string;
  notes?: string;
  couponApplied?: string;
  discountAmount?: number;
  gym_id: string;
  branch_id: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: "Instagram" | "Facebook" | "Google" | "Website" | "Referral" | "Walk-In";
  stage: "New" | "Contacted" | "Trial" | "Negotiation" | "Converted" | "Lost";
  notes: string;
  followUpDate?: string;
  assignedTrainerId?: string;
  gym_id: string;
  branch_id: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: "Rent" | "Electricity" | "Internet" | "Salary" | "Marketing" | "Maintenance" | "Equipment" | "Other";
  description: string;
  date: string;
  paidTo: string;
  gym_id: string;
  branch_id: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Supplements" | "Merchandise" | "Equipment Parts" | "Other";
  stockLevel: number;
  minAlertLevel: number;
  price: number;
  costPrice: number;
  gym_id: string;
  branch_id: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  category: "Weight Loss" | "Muscle Gain" | "Fat Loss" | "Strength" | "Beginner" | "Advanced";
  exercises: {
    day: string; // e.g. "Monday"
    name: string;
    sets: number;
    reps: string;
    notes?: string;
  }[];
  startFrom: string;
  endAt: string;
  gym_id: string;
  branch_id: string;
}

export interface DietPlan {
  id: string;
  name: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  caloriesTarget: number;
  meals: {
    time: string; // e.g., "08:00 AM"
    type: "Breakfast" | "Snack" | "Lunch" | "Pre-Workout" | "Post-Workout" | "Dinner";
    description: string;
    caloriesEstimate: number;
  }[];
  notes?: string;
  gym_id: string;
  branch_id: string;
}

export interface ProgressRecord {
  id: string;
  memberId: string;
  date: string;
  weight: number; // kg
  bmi: number;
  bodyFatPct: number;
  measurements: {
    chest: number; // cm
    waist: number;
    arms: number;
    neck: number;
    thigh: number;
  };
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  gym_id: string;
  branch_id: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  scheduledTime?: string;
  pushed: boolean;
  targetRole: "ALL" | "MEMBER" | "TRAINER";
  gym_id: string;
  branch_id: string;
}

export interface Notification {
  id: string;
  userId: string; // recipient
  title: string;
  message: string;
  type: "Expiry" | "Birthday" | "Payment" | "Attendance" | "Announcement";
  date: string;
  read: boolean;
  gym_id: string;
  branch_id: string;
}

export interface Referral {
  id: string;
  referrerId: string; // member who referred
  referrerName: string;
  refereeName: string; // the new member
  refereeId?: string;
  referralCode: string;
  status: "PENDING" | "CONVERTED" | "REWARDED";
  rewardCredits: number;
  date: string;
  gym_id: string;
  branch_id: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "FLAT" | "PERCENTAGE";
  value: number; // flat cash or %
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  gym_id: string;
  branch_id: string;
}

export interface PtPackage {
  id: string;
  name: string;
  sessionsCount: number;
  price: number;
  trainerId: string;
  trainerName: string;
  gym_id: string;
  branch_id: string;
}

export interface PtSession {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  packageId: string;
  totalSessions: number;
  completedSessions: number;
  scheduledDate?: string;
  scheduledTime?: string;
  gym_id: string;
  branch_id: string;
}

export interface Equipment {
  id: string;
  name: string;
  purchaseDate: string;
  lastServiceDate: string;
  nextServiceDate: string;
  status: "Operational" | "Under Maintenance" | "Needs Service" | "Retired";
  notes?: string;
  gym_id: string;
  branch_id: string;
}

export interface Locker {
  id: string;
  number: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  startDate?: string;
  endDate?: string;
  rentAmount: number;
  status: "Available" | "Occupied" | "Maintenance";
  gym_id: string;
  branch_id: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userEmail: string;
  role: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  gym_id: string;
  branch_id: string;
}
