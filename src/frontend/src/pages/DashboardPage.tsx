import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Car,
  Download,
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  LogOut,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GREEN = "oklch(0.50 0.18 145)";
const ADMIN_PASSWORD = "126312";

// ─── Types ─────────────────────────────────────────────────────────────────────

type InquiryStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  bookingId: string;
  pickup: string;
  dropoff: string;
  date: string;
  status: InquiryStatus;
}

interface Ride {
  id: string;
  driver: string;
  customer: string;
  pickup: string;
  dropoff: string;
  distance: string;
  duration: string;
  amount: number;
  status: InquiryStatus;
}

interface Driver {
  id: number;
  name: string;
  city: string;
  state: string;
  rating: number;
  trips: number;
  available: boolean;
  price: number;
}

// ─── Initial Data ──────────────────────────────────────────────────────────────

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 1,
    name: "Arjun Sharma",
    phone: "9876543210",
    bookingId: "BK-1001",
    pickup: "Connaught Place, Delhi",
    dropoff: "IGI Airport, Delhi",
    date: "2026-03-01",
    status: "Completed",
  },
  {
    id: 2,
    name: "Priya Mehta",
    phone: "9123456780",
    bookingId: "BK-1002",
    pickup: "Bandra, Mumbai",
    dropoff: "Andheri East, Mumbai",
    date: "2026-03-02",
    status: "Confirmed",
  },
  {
    id: 3,
    name: "Rahul Verma",
    phone: "9988776655",
    bookingId: "BK-1003",
    pickup: "MG Road, Bangalore",
    dropoff: "Whitefield, Bangalore",
    date: "2026-03-03",
    status: "Pending",
  },
  {
    id: 4,
    name: "Sneha Patel",
    phone: "9001234567",
    bookingId: "BK-1004",
    pickup: "Anna Nagar, Chennai",
    dropoff: "Chennai Airport",
    date: "2026-03-04",
    status: "Completed",
  },
  {
    id: 5,
    name: "Vikram Singh",
    phone: "8765432109",
    bookingId: "BK-1005",
    pickup: "Park Street, Kolkata",
    dropoff: "Howrah Station",
    date: "2026-03-05",
    status: "Cancelled",
  },
  {
    id: 6,
    name: "Ananya Reddy",
    phone: "7654321098",
    bookingId: "BK-1006",
    pickup: "Jubilee Hills, Hyderabad",
    dropoff: "Hyderabad Airport",
    date: "2026-03-06",
    status: "Confirmed",
  },
  {
    id: 7,
    name: "Karan Joshi",
    phone: "6543210987",
    bookingId: "BK-1007",
    pickup: "C-Scheme, Jaipur",
    dropoff: "Jaipur Airport",
    date: "2026-03-07",
    status: "Pending",
  },
  {
    id: 8,
    name: "Pooja Nair",
    phone: "9871234560",
    bookingId: "BK-1008",
    pickup: "Marine Drive, Kochi",
    dropoff: "Ernakulam Junction",
    date: "2026-03-08",
    status: "Completed",
  },
  {
    id: 9,
    name: "Deepak Kumar",
    phone: "9000123456",
    bookingId: "BK-1009",
    pickup: "Hazratganj, Lucknow",
    dropoff: "Lucknow Airport",
    date: "2026-03-09",
    status: "Confirmed",
  },
  {
    id: 10,
    name: "Meera Iyer",
    phone: "8900012345",
    bookingId: "BK-1010",
    pickup: "Koregaon Park, Pune",
    dropoff: "Pune Airport",
    date: "2026-03-10",
    status: "Pending",
  },
  {
    id: 11,
    name: "Suresh Yadav",
    phone: "8800012300",
    bookingId: "BK-1011",
    pickup: "Sector 17, Chandigarh",
    dropoff: "Chandigarh Airport",
    date: "2026-03-11",
    status: "Completed",
  },
  {
    id: 12,
    name: "Lakshmi Pillai",
    phone: "8700012299",
    bookingId: "BK-1012",
    pickup: "Lal Darwaja, Ahmedabad",
    dropoff: "Ahmedabad Airport",
    date: "2026-03-12",
    status: "Cancelled",
  },
  {
    id: 13,
    name: "Manish Gupta",
    phone: "8600012198",
    bookingId: "BK-1013",
    pickup: "Civil Lines, Nagpur",
    dropoff: "Nagpur Airport",
    date: "2026-03-13",
    status: "Confirmed",
  },
  {
    id: 14,
    name: "Ritika Kapoor",
    phone: "8500012097",
    bookingId: "BK-1014",
    pickup: "Sector 62, Noida",
    dropoff: "Greater Noida",
    date: "2026-03-14",
    status: "Pending",
  },
  {
    id: 15,
    name: "Anil Tiwari",
    phone: "8400011996",
    bookingId: "BK-1015",
    pickup: "Vijay Nagar, Indore",
    dropoff: "Indore Airport",
    date: "2026-03-15",
    status: "Completed",
  },
  {
    id: 16,
    name: "Geeta Mishra",
    phone: "8300011895",
    bookingId: "BK-1016",
    pickup: "Boring Road, Patna",
    dropoff: "Patna Junction",
    date: "2026-03-16",
    status: "Confirmed",
  },
  {
    id: 17,
    name: "Rohit Saxena",
    phone: "8200011794",
    bookingId: "BK-1017",
    pickup: "Lal Bagh, Lucknow",
    dropoff: "Lucknow Junction",
    date: "2026-03-16",
    status: "Pending",
  },
  {
    id: 18,
    name: "Divya Choudhary",
    phone: "8100011693",
    bookingId: "BK-1018",
    pickup: "Indiranagar, Bangalore",
    dropoff: "Electronic City",
    date: "2026-03-17",
    status: "Cancelled",
  },
  {
    id: 19,
    name: "Harsh Agarwal",
    phone: "9900011592",
    bookingId: "BK-1019",
    pickup: "Salt Lake, Kolkata",
    dropoff: "Kolkata Airport",
    date: "2026-03-17",
    status: "Completed",
  },
  {
    id: 20,
    name: "Neha Pandey",
    phone: "9800011491",
    bookingId: "BK-1020",
    pickup: "Gomti Nagar, Lucknow",
    dropoff: "Lucknow Airport",
    date: "2026-03-17",
    status: "Confirmed",
  },
];

const INITIAL_RIDES: Ride[] = [
  {
    id: "RD-2001",
    driver: "Rajesh Kumar",
    customer: "Arjun Sharma",
    pickup: "Connaught Place, Delhi",
    dropoff: "IGI Airport",
    distance: "28 km",
    duration: "52 min",
    amount: 850,
    status: "Completed",
  },
  {
    id: "RD-2002",
    driver: "Sunil Tiwari",
    customer: "Priya Mehta",
    pickup: "Bandra West",
    dropoff: "Andheri East",
    distance: "12 km",
    duration: "35 min",
    amount: 420,
    status: "Confirmed",
  },
  {
    id: "RD-2003",
    driver: "Manoj Prasad",
    customer: "Rahul Verma",
    pickup: "MG Road",
    dropoff: "Whitefield",
    distance: "18 km",
    duration: "45 min",
    amount: 620,
    status: "Pending",
  },
  {
    id: "RD-2004",
    driver: "Venkat Rao",
    customer: "Sneha Patel",
    pickup: "Anna Nagar",
    dropoff: "Chennai Airport",
    distance: "22 km",
    duration: "40 min",
    amount: 700,
    status: "Completed",
  },
  {
    id: "RD-2005",
    driver: "Arun Ghosh",
    customer: "Vikram Singh",
    pickup: "Park Street",
    dropoff: "Howrah Station",
    distance: "8 km",
    duration: "25 min",
    amount: 310,
    status: "Cancelled",
  },
  {
    id: "RD-2006",
    driver: "Sanjay Reddy",
    customer: "Ananya Reddy",
    pickup: "Jubilee Hills",
    dropoff: "Hyderabad Airport",
    distance: "30 km",
    duration: "55 min",
    amount: 920,
    status: "Confirmed",
  },
  {
    id: "RD-2007",
    driver: "Pankaj Sharma",
    customer: "Karan Joshi",
    pickup: "C-Scheme",
    dropoff: "Jaipur Airport",
    distance: "15 km",
    duration: "30 min",
    amount: 480,
    status: "Pending",
  },
  {
    id: "RD-2008",
    driver: "Thomas Mathew",
    customer: "Pooja Nair",
    pickup: "Marine Drive",
    dropoff: "Ernakulam Junction",
    distance: "10 km",
    duration: "28 min",
    amount: 350,
    status: "Completed",
  },
  {
    id: "RD-2009",
    driver: "Ramesh Singh",
    customer: "Deepak Kumar",
    pickup: "Hazratganj",
    dropoff: "Lucknow Airport",
    distance: "20 km",
    duration: "38 min",
    amount: 640,
    status: "Confirmed",
  },
  {
    id: "RD-2010",
    driver: "Nitin Patil",
    customer: "Meera Iyer",
    pickup: "Koregaon Park",
    dropoff: "Pune Airport",
    distance: "17 km",
    duration: "35 min",
    amount: 550,
    status: "Pending",
  },
  {
    id: "RD-2011",
    driver: "Harpreet Singh",
    customer: "Suresh Yadav",
    pickup: "Sector 17",
    dropoff: "Chandigarh Airport",
    distance: "12 km",
    duration: "22 min",
    amount: 390,
    status: "Completed",
  },
  {
    id: "RD-2012",
    driver: "Dilip Patel",
    customer: "Lakshmi Pillai",
    pickup: "Lal Darwaja",
    dropoff: "Ahmedabad Airport",
    distance: "25 km",
    duration: "45 min",
    amount: 790,
    status: "Cancelled",
  },
  {
    id: "RD-2013",
    driver: "Gaurav Desai",
    customer: "Manish Gupta",
    pickup: "Civil Lines",
    dropoff: "Nagpur Airport",
    distance: "14 km",
    duration: "28 min",
    amount: 460,
    status: "Confirmed",
  },
  {
    id: "RD-2014",
    driver: "Ravi Malhotra",
    customer: "Ritika Kapoor",
    pickup: "Sector 62",
    dropoff: "Greater Noida",
    distance: "16 km",
    duration: "32 min",
    amount: 510,
    status: "Pending",
  },
  {
    id: "RD-2015",
    driver: "Ajay Shukla",
    customer: "Anil Tiwari",
    pickup: "Vijay Nagar",
    dropoff: "Indore Airport",
    distance: "11 km",
    duration: "24 min",
    amount: 360,
    status: "Completed",
  },
  {
    id: "RD-2016",
    driver: "Brijesh Yadav",
    customer: "Geeta Mishra",
    pickup: "Boring Road",
    dropoff: "Patna Junction",
    distance: "9 km",
    duration: "20 min",
    amount: 290,
    status: "Confirmed",
  },
  {
    id: "RD-2017",
    driver: "Amit Chauhan",
    customer: "Rohit Saxena",
    pickup: "Lal Bagh",
    dropoff: "Lucknow Junction",
    distance: "7 km",
    duration: "18 min",
    amount: 250,
    status: "Pending",
  },
  {
    id: "RD-2018",
    driver: "Naresh Gowda",
    customer: "Divya Choudhary",
    pickup: "Indiranagar",
    dropoff: "Electronic City",
    distance: "21 km",
    duration: "40 min",
    amount: 670,
    status: "Cancelled",
  },
  {
    id: "RD-2019",
    driver: "Bijoy Das",
    customer: "Harsh Agarwal",
    pickup: "Salt Lake",
    dropoff: "Kolkata Airport",
    distance: "23 km",
    duration: "42 min",
    amount: 730,
    status: "Completed",
  },
  {
    id: "RD-2020",
    driver: "Sandeep Mishra",
    customer: "Neha Pandey",
    pickup: "Gomti Nagar",
    dropoff: "Lucknow Airport",
    distance: "19 km",
    duration: "36 min",
    amount: 600,
    status: "Confirmed",
  },
];

const INITIAL_DRIVERS: Driver[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    city: "Delhi",
    state: "Delhi",
    rating: 4.9,
    trips: 312,
    available: true,
    price: 180,
  },
  {
    id: 2,
    name: "Sunil Tiwari",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.8,
    trips: 278,
    available: true,
    price: 200,
  },
  {
    id: 3,
    name: "Manoj Prasad",
    city: "Bangalore",
    state: "Karnataka",
    rating: 4.7,
    trips: 245,
    available: false,
    price: 190,
  },
  {
    id: 4,
    name: "Venkat Rao",
    city: "Chennai",
    state: "Tamil Nadu",
    rating: 4.9,
    trips: 301,
    available: true,
    price: 175,
  },
  {
    id: 5,
    name: "Arun Ghosh",
    city: "Kolkata",
    state: "West Bengal",
    rating: 4.6,
    trips: 198,
    available: true,
    price: 160,
  },
  {
    id: 6,
    name: "Sanjay Reddy",
    city: "Hyderabad",
    state: "Telangana",
    rating: 4.8,
    trips: 267,
    available: false,
    price: 185,
  },
  {
    id: 7,
    name: "Pankaj Sharma",
    city: "Jaipur",
    state: "Rajasthan",
    rating: 4.7,
    trips: 189,
    available: true,
    price: 155,
  },
  {
    id: 8,
    name: "Thomas Mathew",
    city: "Kochi",
    state: "Kerala",
    rating: 4.9,
    trips: 334,
    available: true,
    price: 170,
  },
  {
    id: 9,
    name: "Ramesh Singh",
    city: "Lucknow",
    state: "Uttar Pradesh",
    rating: 4.6,
    trips: 210,
    available: true,
    price: 150,
  },
  {
    id: 10,
    name: "Nitin Patil",
    city: "Pune",
    state: "Maharashtra",
    rating: 4.7,
    trips: 256,
    available: false,
    price: 195,
  },
  {
    id: 11,
    name: "Harpreet Singh",
    city: "Chandigarh",
    state: "Punjab",
    rating: 4.8,
    trips: 223,
    available: true,
    price: 165,
  },
  {
    id: 12,
    name: "Dilip Patel",
    city: "Ahmedabad",
    state: "Gujarat",
    rating: 4.5,
    trips: 178,
    available: true,
    price: 160,
  },
  {
    id: 13,
    name: "Gaurav Desai",
    city: "Nagpur",
    state: "Maharashtra",
    rating: 4.6,
    trips: 192,
    available: false,
    price: 155,
  },
  {
    id: 14,
    name: "Ravi Malhotra",
    city: "Noida",
    state: "Uttar Pradesh",
    rating: 4.7,
    trips: 234,
    available: true,
    price: 175,
  },
  {
    id: 15,
    name: "Ajay Shukla",
    city: "Indore",
    state: "Madhya Pradesh",
    rating: 4.8,
    trips: 201,
    available: true,
    price: 150,
  },
  {
    id: 16,
    name: "Brijesh Yadav",
    city: "Patna",
    state: "Bihar",
    rating: 4.5,
    trips: 165,
    available: false,
    price: 140,
  },
  {
    id: 17,
    name: "Amit Chauhan",
    city: "Lucknow",
    state: "Uttar Pradesh",
    rating: 4.6,
    trips: 187,
    available: true,
    price: 148,
  },
  {
    id: 18,
    name: "Naresh Gowda",
    city: "Bangalore",
    state: "Karnataka",
    rating: 4.8,
    trips: 289,
    available: true,
    price: 192,
  },
  {
    id: 19,
    name: "Bijoy Das",
    city: "Kolkata",
    state: "West Bengal",
    rating: 4.7,
    trips: 214,
    available: false,
    price: 158,
  },
  {
    id: 20,
    name: "Sandeep Mishra",
    city: "Lucknow",
    state: "Uttar Pradesh",
    rating: 4.9,
    trips: 320,
    available: true,
    price: 162,
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function statusBadge(status: InquiryStatus) {
  const map: Record<InquiryStatus, string> = {
    Pending: "bg-yellow-50 text-yellow-700 border border-yellow-300",
    Confirmed: "bg-blue-50 text-blue-700 border border-blue-300",
    Completed: "bg-green-50 text-green-700 border border-green-300",
    Cancelled: "bg-red-50 text-red-700 border border-red-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {status}
    </span>
  );
}

function downloadCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
}: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold text-foreground leading-none mt-0.5">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Admin Login Screen ────────────────────────────────────────────────────────

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Incorrect password. Access denied.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg border">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-3 mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: GREEN }}
              >
                <Lock className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold text-foreground">
                  Admin Access
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  DriveEase Dashboard — Restricted
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="admin-password"
                  className="text-sm font-medium text-foreground"
                >
                  Admin Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="pr-10 bg-white"
                    id="admin-password"
                    data-ocid="admin.password.input"
                    autoFocus
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <p
                    className="text-xs text-red-600 font-medium"
                    data-ocid="admin.login.error_state"
                  >
                    {error}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full font-semibold text-white"
                style={{ background: GREEN }}
                data-ocid="admin.login.submit_button"
              >
                Login to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);

  // Mutable state for all data
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);

  // Search state
  const [inquirySearch, setInquirySearch] = useState("");
  const [rideSearch, setRideSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");

  // Feedback dialog state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<Inquiry | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  // Cancel ride dialog state
  const [cancelRideOpen, setCancelRideOpen] = useState(false);
  const [cancelRideTarget, setCancelRideTarget] = useState<Ride | null>(null);

  // Remove driver dialog state
  const [removeDriverOpen, setRemoveDriverOpen] = useState(false);
  const [removeDriverTarget, setRemoveDriverTarget] = useState<Driver | null>(
    null,
  );

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  // ── Filtered lists ──────────────────────────────────────────────────────────
  const filteredInquiries = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      i.phone.includes(inquirySearch),
  );
  const filteredRides = rides.filter(
    (r) =>
      r.id.toLowerCase().includes(rideSearch.toLowerCase()) ||
      r.driver.toLowerCase().includes(rideSearch.toLowerCase()),
  );
  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
      d.city.toLowerCase().includes(driverSearch.toLowerCase()),
  );

  // ── Action handlers ─────────────────────────────────────────────────────────

  function confirmInquiry(id: number) {
    const inq = inquiries.find((i) => i.id === id);
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Confirmed" } : i)),
    );
    toast.success(`Booking confirmed for ${inq?.name}`);
  }

  function openFeedback(inq: Inquiry) {
    setFeedbackTarget(inq);
    setFeedbackText("");
    setFeedbackOpen(true);
  }

  function submitFeedback() {
    setFeedbackOpen(false);
    toast.success(`Feedback sent to ${feedbackTarget?.name}`);
    setFeedbackTarget(null);
    setFeedbackText("");
  }

  function confirmRide(id: string) {
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Confirmed" } : r)),
    );
    toast.success(`Ride ${id} confirmed`);
  }

  function openCancelRide(ride: Ride) {
    setCancelRideTarget(ride);
    setCancelRideOpen(true);
  }

  function executeCancelRide() {
    if (!cancelRideTarget) return;
    setRides((prev) =>
      prev.map((r) =>
        r.id === cancelRideTarget.id ? { ...r, status: "Cancelled" } : r,
      ),
    );
    toast.error(`Ride ${cancelRideTarget.id} has been cancelled`);
    setCancelRideOpen(false);
    setCancelRideTarget(null);
  }

  function openRemoveDriver(drv: Driver) {
    setRemoveDriverTarget(drv);
    setRemoveDriverOpen(true);
  }

  function executeRemoveDriver() {
    if (!removeDriverTarget) return;
    setDrivers((prev) => prev.filter((d) => d.id !== removeDriverTarget.id));
    toast.error(`${removeDriverTarget.name} has been removed`);
    setRemoveDriverOpen(false);
    setRemoveDriverTarget(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent
          data-ocid="dashboard.feedback.dialog"
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Send Feedback to {feedbackTarget?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Customer:{" "}
              <span className="font-medium text-foreground">
                {feedbackTarget?.name}
              </span>{" "}
              — Booking {feedbackTarget?.bookingId}
            </p>
            <Textarea
              placeholder="Type your feedback or response message here..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
              className="resize-none"
              data-ocid="dashboard.feedback.textarea"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setFeedbackOpen(false)}
              data-ocid="dashboard.feedback.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={submitFeedback}
              disabled={!feedbackText.trim()}
              className="text-white"
              style={{ background: GREEN }}
              data-ocid="dashboard.feedback.submit_button"
            >
              Send Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Ride AlertDialog */}
      <AlertDialog open={cancelRideOpen} onOpenChange={setCancelRideOpen}>
        <AlertDialogContent data-ocid="dashboard.ride.cancel.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cancel Ride {cancelRideTarget?.id}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel ride{" "}
              <strong>{cancelRideTarget?.id}</strong> for customer{" "}
              {cancelRideTarget?.customer}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="dashboard.ride.cancel.cancel_button">
              Keep Ride
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeCancelRide}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-ocid="dashboard.ride.cancel.confirm_button"
            >
              Yes, Cancel Ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Driver AlertDialog */}
      <AlertDialog open={removeDriverOpen} onOpenChange={setRemoveDriverOpen}>
        <AlertDialogContent data-ocid="dashboard.driver.remove.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove {removeDriverTarget?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove driver{" "}
              <strong>{removeDriverTarget?.name}</strong> from{" "}
              {removeDriverTarget?.city}? They will be removed from the platform
              immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="dashboard.driver.remove.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeRemoveDriver}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-ocid="dashboard.driver.remove.confirm_button"
            >
              Yes, Remove Driver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Page Header */}
      <div className="bg-white border-b px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: GREEN }}
            >
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Customer Inquiry Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage rides, customers & drivers from one place
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs font-medium text-muted-foreground"
            onClick={() => setAuthenticated(false)}
            data-ocid="admin.logout.button"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Inquiries"
            value={String(inquiries.length)}
            color="oklch(0.50 0.18 145)"
          />
          <StatCard
            icon={<Car className="w-5 h-5" />}
            label="Active Rides"
            value={String(
              rides.filter(
                (r) => r.status === "Confirmed" || r.status === "Pending",
              ).length,
            )}
            color="oklch(0.55 0.18 220)"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Customers"
            value={String(inquiries.length)}
            color="oklch(0.55 0.18 30)"
          />
          <StatCard
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Total Drivers"
            value={String(drivers.length)}
            color="oklch(0.50 0.18 290)"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inquiries">
          <TabsList className="bg-white border h-10 p-1 rounded-lg">
            <TabsTrigger
              value="inquiries"
              data-ocid="dashboard.inquiries.tab"
              className="data-[state=active]:text-white rounded-md text-sm"
            >
              Customer Inquiries
            </TabsTrigger>
            <TabsTrigger
              value="rides"
              data-ocid="dashboard.rides.tab"
              className="data-[state=active]:text-white rounded-md text-sm"
            >
              Ride Details
            </TabsTrigger>
            <TabsTrigger
              value="drivers"
              data-ocid="dashboard.drivers.tab"
              className="data-[state=active]:text-white rounded-md text-sm"
            >
              Driver Details
            </TabsTrigger>
          </TabsList>

          {/* ── Inquiries Tab ──────────────────────────────────── */}
          <TabsContent value="inquiries" className="mt-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">
                  Customer Inquiries
                </CardTitle>
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search name or phone..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="pl-8 h-9 bg-white"
                      data-ocid="dashboard.inquiry.search_input"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 gap-1.5 text-xs font-medium"
                    style={{ borderColor: GREEN, color: GREEN }}
                    onClick={() =>
                      downloadCSV(
                        [
                          "#",
                          "Name",
                          "Phone",
                          "Booking ID",
                          "Pickup",
                          "Drop-off",
                          "Date",
                          "Status",
                        ],
                        filteredInquiries.map((i) => [
                          String(i.id),
                          i.name,
                          i.phone,
                          i.bookingId,
                          i.pickup,
                          i.dropoff,
                          i.date,
                          i.status,
                        ]),
                        "inquiries.csv",
                      )
                    }
                    data-ocid="dashboard.inquiry.export.button"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-ocid="dashboard.inquiry.table">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-10">#</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Pickup</TableHead>
                        <TableHead>Drop-off</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInquiries.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center py-10 text-muted-foreground"
                            data-ocid="dashboard.inquiry.empty_state"
                          >
                            No inquiries found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInquiries.map((inq, idx) => (
                          <TableRow
                            key={inq.id}
                            data-ocid={`dashboard.inquiry.row.${idx + 1}`}
                          >
                            <TableCell className="text-muted-foreground text-xs">
                              {inq.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {inq.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {inq.phone}
                            </TableCell>
                            <TableCell className="text-xs font-mono text-muted-foreground">
                              {inq.bookingId}
                            </TableCell>
                            <TableCell className="text-sm max-w-[120px] truncate">
                              {inq.pickup}
                            </TableCell>
                            <TableCell className="text-sm max-w-[120px] truncate">
                              {inq.dropoff}
                            </TableCell>
                            <TableCell className="text-sm">
                              {inq.date}
                            </TableCell>
                            <TableCell>{statusBadge(inq.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 flex-wrap">
                                {inq.status !== "Confirmed" &&
                                  inq.status !== "Completed" &&
                                  inq.status !== "Cancelled" && (
                                    <Button
                                      size="sm"
                                      className="h-7 px-2.5 text-xs text-white"
                                      style={{ background: GREEN }}
                                      onClick={() => confirmInquiry(inq.id)}
                                      data-ocid={`dashboard.inquiry.confirm_button.${idx + 1}`}
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2.5 text-xs"
                                  style={{ borderColor: GREEN, color: GREEN }}
                                  onClick={() => openFeedback(inq)}
                                  data-ocid={`dashboard.inquiry.send_feedback_button.${idx + 1}`}
                                >
                                  Send Feedback
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Rides Tab ────────────────────────────────────────── */}
          <TabsContent value="rides" className="mt-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">
                  Ride Details
                </CardTitle>
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ride ID or driver..."
                      value={rideSearch}
                      onChange={(e) => setRideSearch(e.target.value)}
                      className="pl-8 h-9 bg-white"
                      data-ocid="dashboard.ride.search_input"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 gap-1.5 text-xs font-medium"
                    style={{ borderColor: GREEN, color: GREEN }}
                    onClick={() =>
                      downloadCSV(
                        [
                          "Ride ID",
                          "Driver",
                          "Customer",
                          "Pickup",
                          "Drop-off",
                          "Distance",
                          "Duration",
                          "Amount",
                          "Status",
                        ],
                        filteredRides.map((r) => [
                          r.id,
                          r.driver,
                          r.customer,
                          r.pickup,
                          r.dropoff,
                          r.distance,
                          r.duration,
                          String(r.amount),
                          r.status,
                        ]),
                        "rides.csv",
                      )
                    }
                    data-ocid="dashboard.ride.export.button"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-ocid="dashboard.ride.table">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Ride ID</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Pickup</TableHead>
                        <TableHead>Drop-off</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Amount (₹)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRides.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="text-center py-10 text-muted-foreground"
                            data-ocid="dashboard.ride.empty_state"
                          >
                            No rides found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRides.map((ride, idx) => (
                          <TableRow
                            key={ride.id}
                            data-ocid={`dashboard.ride.row.${idx + 1}`}
                          >
                            <TableCell className="font-mono text-xs text-muted-foreground">
                              {ride.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {ride.driver}
                            </TableCell>
                            <TableCell className="text-sm">
                              {ride.customer}
                            </TableCell>
                            <TableCell className="text-sm max-w-[110px] truncate">
                              {ride.pickup}
                            </TableCell>
                            <TableCell className="text-sm max-w-[110px] truncate">
                              {ride.dropoff}
                            </TableCell>
                            <TableCell className="text-sm">
                              {ride.distance}
                            </TableCell>
                            <TableCell className="font-semibold">
                              ₹{ride.amount}
                            </TableCell>
                            <TableCell>{statusBadge(ride.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {ride.status !== "Confirmed" &&
                                  ride.status !== "Completed" &&
                                  ride.status !== "Cancelled" && (
                                    <Button
                                      size="sm"
                                      className="h-7 px-2.5 text-xs text-white"
                                      style={{ background: GREEN }}
                                      onClick={() => confirmRide(ride.id)}
                                      data-ocid={`dashboard.ride.confirm_button.${idx + 1}`}
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                {ride.status !== "Cancelled" &&
                                  ride.status !== "Completed" && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="h-7 px-2.5 text-xs"
                                      onClick={() => openCancelRide(ride)}
                                      data-ocid={`dashboard.ride.cancel_button.${idx + 1}`}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Drivers Tab ──────────────────────────────────────── */}
          <TabsContent value="drivers" className="mt-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">
                  Driver Details
                </CardTitle>
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search driver or city..."
                      value={driverSearch}
                      onChange={(e) => setDriverSearch(e.target.value)}
                      className="pl-8 h-9 bg-white"
                      data-ocid="dashboard.driver.search_input"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 gap-1.5 text-xs font-medium"
                    style={{ borderColor: GREEN, color: GREEN }}
                    onClick={() =>
                      downloadCSV(
                        [
                          "Name",
                          "City",
                          "State",
                          "Rating",
                          "Total Trips",
                          "Available",
                          "Price/hr (₹)",
                        ],
                        filteredDrivers.map((d) => [
                          d.name,
                          d.city,
                          d.state,
                          String(d.rating),
                          String(d.trips),
                          d.available ? "Yes" : "No",
                          String(d.price),
                        ]),
                        "drivers.csv",
                      )
                    }
                    data-ocid="dashboard.driver.export.button"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-ocid="dashboard.driver.table">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Driver Name</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Trips</TableHead>
                        <TableHead>Availability</TableHead>
                        <TableHead>Price/hr (₹)</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrivers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-10 text-muted-foreground"
                            data-ocid="dashboard.driver.empty_state"
                          >
                            No drivers found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDrivers.map((drv, idx) => (
                          <TableRow
                            key={drv.id}
                            data-ocid={`dashboard.driver.row.${idx + 1}`}
                          >
                            <TableCell className="font-medium">
                              {drv.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {drv.city}
                            </TableCell>
                            <TableCell className="text-sm">
                              {drv.state}
                            </TableCell>
                            <TableCell>
                              <span className="flex items-center gap-1 text-sm font-semibold">
                                <span className="text-yellow-500">★</span>
                                {drv.rating}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">
                              {drv.trips}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                  drv.available
                                    ? "bg-green-50 text-green-700 border-green-300"
                                    : "bg-gray-50 text-gray-500 border-gray-300"
                                }`}
                              >
                                {drv.available ? "Available" : "Unavailable"}
                              </span>
                            </TableCell>
                            <TableCell className="font-semibold">
                              ₹{drv.price}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 px-2.5 text-xs"
                                onClick={() => openRemoveDriver(drv)}
                                data-ocid={`dashboard.driver.delete_button.${idx + 1}`}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
