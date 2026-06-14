import re

path = r"c:\Users\nihar\Downloads\vikings\src\components\ERPModules.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Imports
content = content.replace('import { StorageManager } from "../data/store";', 
'''import { membersAPI, membershipsAPI, attendanceAPI, paymentsAPI, leadsAPI } from "../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";''')

# Replace initial state loading
content = re.sub(
    r'const currentBranchId = StorageManager.getCurrentBranchId\(\);',
    'const currentBranchId = "b-aurangabad";\n  const queryClient = useQueryClient();',
    content
)

# We can replace the useEffect that loads everything:
use_effect_pattern = r'useEffect\(\(\) => \{[\s\S]*?\}, \[refreshTrigger, currentBranchId, currentUser\]\);'

use_query_replacement = '''
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
'''
content = re.sub(use_effect_pattern, use_query_replacement, content)

# Remove the state variables that we just replaced with useQuery
content = re.sub(r'const \[members, setMembers\] = useState<Member\[\]>\(\[\]\);\n', '', content)
content = re.sub(r'const \[trainers, setTrainers\] = useState<Trainer\[\]>\(\[\]\);\n', '', content)
content = re.sub(r'const \[plans, setPlans\] = useState<MembershipPlan\[\]>\(\[\]\);\n', '', content)
content = re.sub(r'const \[memberships, setMemberships\] = useState<MemberMembership\[\]>\(\[\]\);\n', '', content)
content = re.sub(r'const \[attendance, setAttendance\] = useState<Attendance\[\]>\(\[\]\);\n', '', content)
content = re.sub(r'const \[payments, setPayments\] = useState<Payment\[\]>\(\[\]\);\n', '', content)
content = re.sub(r'const \[leads, setLeads\] = useState<Lead\[\]>\(\[\]\);\n', '', content)

# Now we need to update the triggerRefresh to invalidate queries
content = content.replace(
'''  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };''',
'''  const triggerRefresh = () => {
    queryClient.invalidateQueries();
  };'''
)

# Fix mutations: StorageManager.checkInMember
content = re.sub(
    r'const res = StorageManager\.checkInMember\(([^,]+), "QR"\);',
    r'attendanceAPI.checkIn({ member_id: \1, method: "QR" }).then(() => { setReceptionMessage({ status: "success", text: "Checked in" }); triggerRefresh(); }).catch(e => setReceptionMessage({ status: "error", text: "Failed" })); const res = { success: false, message: "" };',
    content
)

content = re.sub(
    r'const res = StorageManager\.checkOutMember\(([^)]+)\);',
    r'attendanceAPI.checkOut({ member_id: \1 }).then(() => { setReceptionMessage({ status: "success", text: "Checked out" }); triggerRefresh(); }).catch(e => setReceptionMessage({ status: "error", text: "Failed" })); const res = { success: false, message: "" };',
    content
)

content = re.sub(
    r'StorageManager\.addLead\(\{',
    r'leadsAPI.create({',
    content
)

# And similarly for addMember:
content = re.sub(
    r'const newM = StorageManager\.addMember\(\{',
    r'membersAPI.create({',
    content
)

content = re.sub(
    r'StorageManager\.assignMembership\(([^,]+), ([^)]+)\);',
    r'membershipsAPI.assign({ member_id: \1, plan_id: \2 });',
    content
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
