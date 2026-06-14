// StorageManager has been deprecated.
// All data is now fetched from the real MongoDB API using React Query.

export class StorageManager {
  static getCurrentUser() { return null; }
  static getCurrentBranchId() { return null; }
  static getMembers() { return []; }
  static getWorkoutPlans() { return []; }
  static getDietPlans() { return []; }
  static getMemberships() { return []; }
  static getProgressRecords() { return []; }
  static getTrainers() { return []; }
  static getPlans() { return []; }
  static getAttendance() { return []; }
  static getPayments() { return []; }
  static getLeads() { return []; }
  static getExpenses() { return []; }
  static getInventory() { return []; }
  static getLockers() { return []; }
  static getEquipment() { return []; }
  static getCoupons() { return []; }
  static getAuditLogs() { return []; }
  static getPtSessions() { return []; }
  static getUsers() { return []; }
  static getNotifications() { return []; }
  static getBranches() { return []; }

  // Dummy mutations to satisfy typescript until API integrations are complete
  static updateMembershipStatus(...args: any[]) {}
  static assignWorkoutPlan(...args: any[]) {}
  static assignDietPlan(...args: any[]) {}
  static checkoutPOS(...args: any[]) { return { success: true, invoice: "INV-001", discount: 0 }; }
  static assignLocker(...args: any[]) {}
  static releaseLocker(...args: any[]) {}
  static updateLeadStage(...args: any[]) {}
  static addExpense(...args: any[]) {}
  static addCoupon(...args: any[]) {}
  static deleteMember(...args: any[]) {}
  static logAction(...args: any[]) {}
  static addProgressRecord(...args: any[]) {}
  static setCurrentUser(...args: any[]) {}
  static setCurrentBranchId(...args: any[]) {}
  static checkInMember(...args: any[]) { return { success: true }; }
  static checkOutMember(...args: any[]) { return { success: true }; }
  static addLead(...args: any[]) {}
  static addMember(...args: any[]) { return { id: 'dummy' }; }
  static assignMembership(...args: any[]) {}
  static registerUser(...args: any[]) { return true; }
  static addNotification(...args: any[]) {}
}
