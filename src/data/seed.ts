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
  Notification,
  PtPackage,
  PtSession,
  Equipment,
  Locker,
  Referral,
  AuditLog
} from "../types";

export const SEED_BRANCHES: Branch[] = [
  {
    id: "b-aurangabad",
    name: "Vikings Aurangabad",
    location: "Cidco Cannought, Aurangabad",
    manager: "Karan Singh",
    phone: "+91 98765 12345",
    gym_id: "vikings-gyms"
  },
  {
    id: "b-pune",
    name: "Vikings Pune",
    location: "Koregaon Park, Pune",
    manager: "Vikram Rathore",
    phone: "+91 98765 54321",
    gym_id: "vikings-gyms"
  }
];

export const SEED_USERS: User[] = [
  {
    id: "u-admin",
    email: "ritwik014017@gmail.com", // owner's registered email
    name: "Ritwik Singh (Super Owner)",
    role: UserRole.GYM_OWNER,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    phone: "+91 99999 88888"
  },
  {
    id: "u-receptionist",
    email: "reception@vikings.com",
    name: "Pooja Sharma",
    role: UserRole.RECEPTIONIST,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    phone: "+91 88888 77777"
  },
  {
    id: "u-trainer-1",
    email: "thor@vikings.com",
    name: "Thor Odinson",
    role: UserRole.TRAINER,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    phone: "+91 77777 66666"
  },
  {
    id: "u-trainer-2",
    email: "valkyrie@vikings.com",
    name: "Valkyrie Brunnhilde",
    role: UserRole.TRAINER,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    phone: "+91 77777 55555"
  },
  {
    id: "u-member-1",
    email: "ragnar@gmail.com",
    name: "Ragnar Lothbrok",
    role: UserRole.MEMBER,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    phone: "+91 12345 67890"
  },
  {
    id: "u-member-2",
    email: "lagertha@gmail.com",
    name: "Lagertha Shields",
    role: UserRole.MEMBER,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    phone: "+91 12345 11111"
  }
];

export const SEED_TRAINERS: Trainer[] = [
  {
    id: "t-1",
    userId: "u-trainer-1",
    name: "Thor Odinson",
    phone: "+91 77777 66666",
    email: "thor@vikings.com",
    experienceYears: 8,
    certifications: ["K11 Certified Master Trainer", "IPF Powerlifting Coach", "ISSA Nutritionist"],
    specializations: ["Strength & Conditioning", "Heavy Powerlifting", "Bulking Programs"],
    salary: 45000,
    commissionRate: 20,
    assignedClientsCount: 4,
    rating: 4.9,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "t-2",
    userId: "u-trainer-2",
    name: "Valkyrie Brunnhilde",
    phone: "+91 77777 55555",
    email: "valkyrie@vikings.com",
    experienceYears: 6,
    certifications: ["ACE Personal Trainer", "Reebok CrossFit Coach", "Certified Yoga Teacher"],
    specializations: ["HIIT / Functional Crossfit", "Fat Loss / Cardiorespiratory Conditioning", "Flexibility & Mobility"],
    salary: 40000,
    commissionRate: 15,
    assignedClientsCount: 3,
    rating: 4.8,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

export const SEED_MEMBERS: Member[] = [
  {
    id: "m-1",
    userId: "u-member-1",
    name: "Ragnar Lothbrok",
    phone: "+91 12345 67890",
    email: "ragnar@gmail.com",
    dob: "1994-04-12",
    gender: "Male",
    address: "Vikings Fjord Street, Aurangabad",
    bloodGroup: "O+",
    medicalConditions: "Left arm scars from conquest",
    emergencyContactName: "Bjorn Lothbrok",
    emergencyContactPhone: "+91 12345 99999",
    photoUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400",
    fitnessGoal: "Build maximum shield-wall strength & muscle gain",
    height: 188,
    weight: 92,
    bmi: 26.0,
    referralCode: "RAGNAR77",
    referredBy: undefined,
    walletCredits: 500,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    joinedDate: "2026-01-10"
  },
  {
    id: "m-2",
    userId: "u-member-2",
    name: "Lagertha Shields",
    phone: "+91 12345 11111",
    email: "lagertha@gmail.com",
    dob: "1996-08-24",
    gender: "Female",
    address: "Valhalla Castle, Cidco, Aurangabad",
    bloodGroup: "A-",
    medicalConditions: "None",
    emergencyContactName: "Ragnar Lothbrok",
    emergencyContactPhone: "+91 12345 67890",
    photoUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&q=80&w=400",
    fitnessGoal: "Functional power, core stability, cardio fitness",
    height: 172,
    weight: 62,
    bmi: 20.95,
    referralCode: "LAGERTHA8",
    referredBy: "RAGNAR77",
    referredById: "m-1",
    walletCredits: 200,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    joinedDate: "2026-02-15"
  },
  {
    id: "m-3",
    name: "Bjorn Ironside",
    phone: "+91 12345 22222",
    email: "bjorn@gmail.com",
    dob: "1998-11-05",
    gender: "Male",
    address: "C Cannought, Aurangabad",
    bloodGroup: "O+",
    medicalConditions: "None",
    emergencyContactName: "Lagertha Shields",
    emergencyContactPhone: "+91 12345 11111",
    photoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400",
    fitnessGoal: "Muscle Growth / Bodybuilding",
    height: 194,
    weight: 105,
    bmi: 27.9,
    referralCode: "BJORN99",
    walletCredits: 0,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    joinedDate: "2026-05-20"
  },
  {
    id: "m-4",
    name: "Floki Shipbuilder",
    phone: "+91 12345 33333",
    email: "floki@gmail.com",
    dob: "1990-01-01",
    gender: "Male",
    address: "Harsul Woods, Aurangabad",
    bloodGroup: "B+",
    medicalConditions: "Joint hypermobility",
    emergencyContactName: "Helga Floki",
    emergencyContactPhone: "+91 12345 88888",
    photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    fitnessGoal: "Agility & flexibility stamina conditioning",
    height: 178,
    weight: 64,
    bmi: 20.2,
    referralCode: "FLOKI11",
    walletCredits: 0,
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    joinedDate: "2026-03-01"
  }
];

export const SEED_PLANS: MembershipPlan[] = [
  {
    id: "p-monthly",
    name: "Vikings Monthly Recruit",
    durationMonths: 1,
    price: 2500,
    description: "Full Gym Access + Cardio Section + Spa Steam Bath (1 session/mo)",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "p-quarterly",
    name: "Shield-Wall Quarterly",
    durationMonths: 3,
    price: 6500,
    description: "Standard Access + Locker Benefit + Monthly Body Analytics Assessment",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "p-halfyearly",
    name: "Berserker Half-Yearly",
    durationMonths: 6,
    price: 11000,
    description: "All access + Locker + Diet Guide + Custom Spa Steam (3 sessions/mo)",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "p-annual",
    name: "Valhalla Annual Champion",
    durationMonths: 12,
    price: 18000,
    description: "Full Year Access + Free Uniform + Premium Locker Slot + Unlimited Spa Bath + Trainer Audit sessions",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

export const SEED_MEMBERSHIPS: MemberMembership[] = [
  {
    id: "mm-1",
    memberId: "m-1",
    planId: "p-annual",
    planName: "Valhalla Annual Champion",
    startDate: "2026-01-10",
    endDate: "2027-01-09",
    price: 18000,
    status: "ACTIVE",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "mm-2",
    memberId: "m-2",
    planId: "p-halfyearly",
    planName: "Berserker Half-Yearly",
    startDate: "2026-02-15",
    endDate: "2026-08-14",
    price: 11000,
    status: "ACTIVE",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "mm-3",
    memberId: "m-3",
    planId: "p-monthly",
    planName: "Vikings Monthly Recruit",
    startDate: "2026-05-20",
    endDate: "2026-06-19", // Expiring very soon! (relative to current date 2026-06-14)
    price: 2500,
    status: "ACTIVE",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "mm-4",
    memberId: "m-4",
    planId: "p-monthly",
    planName: "Vikings Monthly Recruit",
    startDate: "2026-04-01",
    endDate: "2026-05-01", // Already expired!
    price: 2500,
    status: "EXPIRED",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

// Rich set of attendance entries to build beautiful charts
export const SEED_ATTENDANCE: Attendance[] = [
  // Ragnar Lothbrok past 5 days
  { id: "a-1", memberId: "m-1", memberName: "Ragnar Lothbrok", memberEmail: "ragnar@gmail.com", date: "2026-06-09", checkInTime: "06:12 AM", checkOutTime: "07:45 AM", durationMinutes: 93, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-2", memberId: "m-1", memberName: "Ragnar Lothbrok", memberEmail: "ragnar@gmail.com", date: "2026-06-10", checkInTime: "06:05 AM", checkOutTime: "07:30 AM", durationMinutes: 85, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-3", memberId: "m-1", memberName: "Ragnar Lothbrok", memberEmail: "ragnar@gmail.com", date: "2026-06-11", checkInTime: "06:15 AM", checkOutTime: "07:50 AM", durationMinutes: 95, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-4", memberId: "m-1", memberName: "Ragnar Lothbrok", memberEmail: "ragnar@gmail.com", date: "2026-06-12", checkInTime: "06:00 AM", checkOutTime: "07:20 AM", durationMinutes: 80, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-5", memberId: "m-1", memberName: "Ragnar Lothbrok", memberEmail: "ragnar@gmail.com", date: "2026-06-13", checkInTime: "06:10 AM", checkOutTime: "07:40 AM", durationMinutes: 90, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-5b", memberId: "m-1", memberName: "Ragnar Lothbrok", memberEmail: "ragnar@gmail.com", date: "2026-06-14", checkInTime: "06:00 AM", checkOutTime: undefined, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }, // Checked In Today!

  // Lagertha past 5 days
  { id: "a-6", memberId: "m-2", memberName: "Lagertha Shields", memberEmail: "lagertha@gmail.com", date: "2026-06-09", checkInTime: "07:30 AM", checkOutTime: "08:45 AM", durationMinutes: 75, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-7", memberId: "m-2", memberName: "Lagertha Shields", memberEmail: "lagertha@gmail.com", date: "2026-06-10", checkInTime: "07:40 AM", checkOutTime: "08:50 AM", durationMinutes: 70, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-8", memberId: "m-2", memberName: "Lagertha Shields", memberEmail: "lagertha@gmail.com", date: "2026-06-12", checkInTime: "07:35 AM", checkOutTime: "08:55 AM", durationMinutes: 80, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-9", memberId: "m-2", memberName: "Lagertha Shields", memberEmail: "lagertha@gmail.com", date: "2026-06-13", checkInTime: "07:45 AM", checkOutTime: "09:00 AM", durationMinutes: 75, method: "QR", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },

  // Bjorn past few days
  { id: "a-10", memberId: "m-3", memberName: "Bjorn Ironside", memberEmail: "bjorn@gmail.com", date: "2026-06-11", checkInTime: "05:30 PM", checkOutTime: "07:15 PM", durationMinutes: 105, method: "MANUAL", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-11", memberId: "m-3", memberName: "Bjorn Ironside", memberEmail: "bjorn@gmail.com", date: "2026-06-12", checkInTime: "05:15 PM", checkOutTime: "07:00 PM", durationMinutes: 105, method: "MANUAL", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "a-12", memberId: "m-3", memberName: "Bjorn Ironside", memberEmail: "bjorn@gmail.com", date: "2026-06-13", checkInTime: "05:20 PM", checkOutTime: "07:22 PM", durationMinutes: 122, method: "MANUAL", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];

export const SEED_PAYMENTS: Payment[] = [
  {
    id: "pay-1",
    memberId: "m-1",
    memberName: "Ragnar Lothbrok",
    amount: 18000,
    date: "2026-01-10",
    paymentMethod: "Razorpay",
    paymentType: "Membership",
    status: "PAID",
    invoiceNumber: "INV-2026-001",
    notes: "Annual membership plan assignment",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "pay-2",
    memberId: "m-2",
    memberName: "Lagertha Shields",
    amount: 11000,
    date: "2026-02-15",
    paymentMethod: "UPI",
    paymentType: "Membership",
    status: "PAID",
    invoiceNumber: "INV-2026-014",
    notes: "Half-yearly subscription",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "pay-3",
    memberId: "m-3",
    memberName: "Bjorn Ironside",
    amount: 2500,
    date: "2026-05-20",
    paymentMethod: "Cash",
    paymentType: "Membership",
    status: "PAID",
    invoiceNumber: "INV-2026-089",
    notes: "First month entrance payment",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "pay-4",
    memberId: "m-1",
    memberName: "Ragnar Lothbrok",
    amount: 4500,
    date: "2026-06-05",
    paymentMethod: "Card",
    paymentType: "POS",
    status: "PAID",
    invoiceNumber: "POS-2026-210",
    notes: "Whey Protein Isolate - Triple Chocolate",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

export const SEED_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Ivar Bone",
    phone: "+91 99111 22233",
    email: "ivar@outlook.com",
    source: "Instagram",
    stage: "New",
    notes: "Inquired about accessibility / physical conditioning therapy support",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    createdAt: "2026-06-11"
  },
  {
    id: "lead-2",
    name: "Ubbe Ragnarsson",
    phone: "+91 99111 44455",
    email: "ubbe@gmail.com",
    source: "Google",
    stage: "Contacted",
    notes: "Spoke regarding powerlifting and weight training package details. Looking for slot availability.",
    followUpDate: "2026-06-15",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    createdAt: "2026-06-11"
  },
  {
    id: "lead-3",
    name: "Hvitserk White",
    phone: "+91 99111 66677",
    email: "hvitserk@live.com",
    source: "Website",
    stage: "Trial",
    notes: "Completed physical test trial session with trainer Valkyrie. Positive response.",
    followUpDate: "2026-06-14",
    assignedTrainerId: "t-2",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    createdAt: "2026-06-08"
  },
  {
    id: "lead-4",
    name: "Alfred Wessex",
    phone: "+91 99111 88899",
    email: "alfred@royal.uk",
    source: "Facebook",
    stage: "Negotiation",
    notes: "Wants premium Spa & Fitness combined annual. Offered 10% coupon promo, considering.",
    followUpDate: "2026-06-16",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad",
    createdAt: "2026-06-05"
  }
];

export const SEED_EXPENSES: Expense[] = [
  { id: "exp-1", amount: 45000, category: "Rent", description: "Premises rent Cannought CIDCO Aurangabad Branch", date: "2026-06-01", paidTo: "CIDCO Realities Pvt Ltd", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "exp-2", amount: 15300, category: "Electricity", description: "MSEDCL Gym Commercial power bill", date: "2026-06-05", paidTo: "MSEDCL Electric", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "exp-3", amount: 2400, category: "Internet", description: "Leased broadband line 500Mbps speed", date: "2026-06-02", paidTo: "Jio Fiber Commercial", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "exp-4", amount: 85000, category: "Salary", description: "Staff Payroll payout June - trainers & reception", date: "2026-06-10", paidTo: "Multiple Employees (Thor, etc.)", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "exp-5", amount: 5000, category: "Marketing", description: "Instagram & Meta Local Ad targeting campaigns", date: "2026-06-08", paidTo: "Meta Ads Platform", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "exp-6", amount: 3500, category: "Maintenance", description: "Cable adjustments for Lat Pull-Down and Leg Press lubrication", date: "2026-06-11", paidTo: "Sai Fitness Techs", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];

export const SEED_INVENTORY: InventoryItem[] = [
  { id: "inv-1", name: "Vikings Gold Iso Whey (1kg)", category: "Supplements", stockLevel: 25, minAlertLevel: 5, price: 4500, costPrice: 3100, gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "inv-2", name: "Ragnar Creapure Creatine (250g)", category: "Supplements", stockLevel: 4, minAlertLevel: 10, price: 1200, costPrice: 750, gym_id: "vikings-gyms", branch_id: "b-aurangabad" }, // Low Stock Alert Triggered!
  { id: "inv-3", name: "Premium Vikings Shaker Lite", category: "Merchandise", stockLevel: 50, minAlertLevel: 15, price: 500, costPrice: 220, gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "inv-4", name: "Vikings Berserker Gym T-Shirt", category: "Merchandise", stockLevel: 3, minAlertLevel: 5, price: 800, costPrice: 350, gym_id: "vikings-gyms", branch_id: "b-aurangabad" } // Low Stock!
];

export const SEED_WORKOUTS: WorkoutPlan[] = [
  {
    id: "w-1",
    name: "Ragnar's Power Routine",
    memberId: "m-1",
    memberName: "Ragnar Lothbrok",
    trainerId: "t-1",
    trainerName: "Thor Odinson",
    category: "Muscle Gain",
    exercises: [
      { day: "Monday", name: "Heavy Barbell Squats", sets: 5, reps: "5/5/4/3/2", notes: "Focus on deep range of motion and core bracing" },
      { day: "Monday", name: "Bench Press", sets: 5, reps: "5/5/5/3/1", notes: "Warm up with 60kg, target set 110kg limit" },
      { day: "Wednesday", name: "Conventional Deadlifts", sets: 4, reps: "5/5/3/1", notes: "Avoid lower back rounding. Use chalk." },
      { day: "Wednesday", name: "Standing Overhead Press", sets: 4, reps: "8/8/6/6", notes: "Strict form, squeeze glutes" },
      { day: "Friday", name: "Pull-Ups & Weighted Dips", sets: 4, reps: "10-12 reps", notes: "Bodyweight or +15kg plates if easy" }
    ],
    startFrom: "2026-06-01",
    endAt: "2026-08-01",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "w-2",
    name: "Lagertha Athletic Conditioning",
    memberId: "m-2",
    memberName: "Lagertha Shields",
    trainerId: "t-2",
    trainerName: "Valkyrie Brunnhilde",
    category: "Fat Loss",
    exercises: [
      { day: "Monday", name: "Kettlebell Swings", sets: 4, reps: "25 reps, 16kg", notes: "Explosive hip hinge" },
      { day: "Monday", name: "Dumbbell Thrusters", sets: 4, reps: "15 reps", notes: "Hold overhead" },
      { day: "Tuesday", name: "Burpees Over Barbell", sets: 5, reps: "15 reps", notes: "High intensity cardiovascular push" },
      { day: "Thursday", name: "Assault Bike Intervals", sets: 6, reps: "30s sprint / 30s manual rest", notes: "Exhaustive scale" }
    ],
    startFrom: "2026-06-05",
    endAt: "2026-08-01",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

export const SEED_DIETS: DietPlan[] = [
  {
    id: "d-1",
    name: "Ragnar Massive Bulk Plan",
    memberId: "m-1",
    memberName: "Ragnar Lothbrok",
    trainerId: "t-1",
    trainerName: "Thor Odinson",
    caloriesTarget: 3400,
    meals: [
      { time: "07:30 AM", type: "Breakfast", description: "6 Scrambled Egg whites + 2 whole eggs, 100g Rolled Oats with 1 Banana and Almonds", caloriesEstimate: 800 },
      { time: "11:00 AM", type: "Snack", description: "2 Scoop Whey Protein in whole milk, 20g Peanut Butter with Brown Bread slices", caloriesEstimate: 600 },
      { time: "01:30 PM", type: "Lunch", description: "250g grilled chicken breast, 200g white rice basmati, sautéed broccoli & carrots", caloriesEstimate: 950 },
      { time: "05:00 PM", type: "Pre-Workout", description: "150g sweet potato mash, black coffee (no sugar)", caloriesEstimate: 200 },
      { time: "07:30 PM", type: "Post-Workout", description: "1.5 Scoop ISO Whey Protein + 5g Creapure with 1 Apple", caloriesEstimate: 350 },
      { time: "09:30 PM", type: "Dinner", description: "180g Baked Salmon/Paneer, 1 cup cooked Quinoa, Avocado side salad", caloriesEstimate: 500 }
    ],
    notes: "Consume at least 4.5 liters of clean water daily.",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

export const SEED_PROGRESS: ProgressRecord[] = [
  {
    id: "pr-1",
    memberId: "m-1",
    date: "2026-01-11",
    weight: 96,
    bmi: 27.15,
    bodyFatPct: 22,
    measurements: { chest: 108, waist: 96, arms: 40, neck: 41, thigh: 62 },
    beforePhotoUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=300",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "pr-2",
    memberId: "m-1",
    date: "2026-06-12",
    weight: 92,
    bmi: 26.0,
    bodyFatPct: 15,
    measurements: { chest: 112, waist: 86, arms: 43, neck: 41, thigh: 60 },
    afterPhotoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Heavy Metal Night - Shield Wall Event",
    content: "Prepare your axes! This coming Friday evening we are hosting the Powerlifting Heavy Metal DJ session at our Cidco branch. Exciting PR attempts lined up.",
    date: "2026-06-13",
    pushed: true,
    targetRole: "ALL",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  },
  {
    id: "ann-2",
    title: "Aurangabad Branch Maintenance Closure",
    content: "The Spa Steam Rooms will undergo regular scheduled annual maintenance on Sunday, 21st June from 06:00 AM to 02:00 PM. Other areas will function of course.",
    date: "2026-06-14",
    pushed: false,
    targetRole: "ALL",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

export const SEED_COUPONS: Coupon[] = [
  { id: "c-1", code: "VALHALLA15", type: "PERCENTAGE", value: 15, expiryDate: "2026-07-31", usageLimit: 100, timesUsed: 8, gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "c-2", code: "VIKINGCASH", type: "FLAT", value: 500, expiryDate: "2026-11-30", usageLimit: 50, timesUsed: 2, gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];

export const SEED_PT_PACKAGES: PtPackage[] = [
  { id: "pt-p1", name: "12 Sessions Warrior PT", sessionsCount: 12, price: 6000, trainerId: "t-1", trainerName: "Thor Odinson", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "pt-p2", name: "24 Sessions Berserker VIP PT", sessionsCount: 24, price: 10000, trainerId: "t-1", trainerName: "Thor Odinson", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];

export const SEED_PT_SESSIONS: PtSession[] = [
  {
    id: "pt-s1",
    memberId: "m-1",
    memberName: "Ragnar Lothbrok",
    trainerId: "t-1",
    trainerName: "Thor Odinson",
    packageId: "pt-p1",
    totalSessions: 12,
    completedSessions: 8,
    scheduledDate: "2026-06-15",
    scheduledTime: "06:00 AM",
    gym_id: "vikings-gyms",
    branch_id: "b-aurangabad"
  }
];

export const SEED_EQUIPMENT: Equipment[] = [
  { id: "eq-1", name: "Commercial Incline Bench Hammer Strength Group", purchaseDate: "2024-03-12", lastServiceDate: "2026-03-10", nextServiceDate: "2026-09-10", status: "Operational", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "eq-2", name: "Premium Cardio Treadmill Matrix T7xe v2", purchaseDate: "2025-01-08", lastServiceDate: "2026-05-02", nextServiceDate: "2026-06-18", status: "Needs Service", notes: "Belt has occasional slippage on high velocity. Matrix tech booked.", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }, // Needs Service Triggered!
  { id: "eq-3", name: "Vikings Custom Cable Crossover 4-Station", purchaseDate: "2024-11-20", lastServiceDate: "2026-04-15", nextServiceDate: "2026-10-15", status: "Operational", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];

export const SEED_LOCKERS: Locker[] = [
  { id: "lk-1", number: "LCK-01", assignedMemberId: "m-1", assignedMemberName: "Ragnar Lothbrok", startDate: "2026-01-10", endDate: "2027-01-09", rentAmount: 1200, status: "Occupied", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "lk-2", number: "LCK-02", assignedMemberId: "m-2", assignedMemberName: "Lagertha Shields", startDate: "2026-02-15", endDate: "2026-08-14", rentAmount: 600, status: "Occupied", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "lk-3", number: "LCK-03", rentAmount: 600, status: "Available", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "lk-4", number: "LCK-04", rentAmount: 600, status: "Available", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "lk-5", number: "LCK-05", rentAmount: 1000, status: "Maintenance", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];

export const SEED_REFERRALS: Referral[] = [
  { id: "ref-1", referrerId: "m-1", referrerName: "Ragnar Lothbrok", refereeName: "Lagertha Shields", refereeId: "m-2", referralCode: "RAGNAR77", status: "CONVERTED", rewardCredits: 200, date: "2026-02-15", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "ref-2", referrerId: "m-1", referrerName: "Ragnar Lothbrok", refereeName: "Ubbe Ragnarsson", referralCode: "RAGNAR77", status: "PENDING", rewardCredits: 200, date: "2026-06-11", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "not-1", userId: "u-admin", title: "Low Stock Alert", message: "Ragnar Creapure Creatine is below 10 units! Current level: 4 units left.", type: "Expiry", date: "2026-06-14", read: false, gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "not-2", userId: "u-admin", title: "Equipment Service Due", message: "Matrix Treadmill T7xe is due for service on 2026-06-18.", type: "Attendance", date: "2026-06-13", read: false, gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "not-3", userId: "u-member-1", title: "Workout Plan Assigned", message: "Thor Odinson updated your Power Lifting muscle routine plan! Log in to view.", type: "Payment", date: "2026-06-12", read: true, gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  { id: "log-1", userName: "Pooja Sharma", userEmail: "reception@vikings.com", role: "RECEPTIONIST", action: "Checked in Member Ragnar Lothbrok via QR", module: "Attendance", timestamp: "2026-06-14 06:12:00", ipAddress: "192.168.1.102", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "log-2", userName: "Ritwik Singh", userEmail: "ritwik014017@gmail.com", role: "GYM_OWNER", action: "Created New Discount Coupon VALHALLA15", module: "Coupons", timestamp: "2026-06-13 11:22:15", ipAddress: "157.32.221.11", gym_id: "vikings-gyms", branch_id: "b-aurangabad" },
  { id: "log-3", userName: "Thor Odinson", userEmail: "thor@vikings.com", role: "TRAINER", action: "Allocated Massive Bulk Diet Chart to Ragnar", module: "Diet Management", timestamp: "2026-06-12 05:40:11", ipAddress: "192.168.1.189", gym_id: "vikings-gyms", branch_id: "b-aurangabad" }
];
