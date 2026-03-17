import type { BookingStatus } from "@/backend";
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
import { Skeleton } from "@/components/ui/skeleton";
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
  useAllBookings,
  useAllDrivers,
  useDeleteDriver,
  useUpdateBookingStatus,
} from "@/hooks/useQueries";
import {
  Car,
  Download,
  Eye,
  EyeOff,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquare,
  Phone,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const GREEN = "oklch(0.50 0.18 145)";
const ADMIN_PASSWORD = "126312";

// ─── Types ─────────────────────────────────────────────────────────────────────

type StatusBadgeType =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

interface LocalEnquiry {
  id: number;
  name: string;
  phone: string;
  city: string;
  plan: string;
  message: string;
  date: string;
  status: "Pending" | "Confirmed";
  feedback?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function statusBadge(status: StatusBadgeType) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-300",
    confirmed: "bg-blue-50 text-blue-700 border border-blue-300",
    completed: "bg-green-50 text-green-700 border border-green-300",
    cancelled: "bg-red-50 text-red-700 border border-red-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${map[s] || map.pending}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
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

function SkeletonRow({ cols }: { cols: number }) {
  const cells: React.ReactNode[] = [];
  for (let j = 0; j < cols; j++) {
    cells.push(
      <TableCell key={`c${j}`}>
        <Skeleton className="h-4 w-full" />
      </TableCell>,
    );
  }
  return <TableRow>{cells}</TableRow>;
}

function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  const rowEls: React.ReactNode[] = [];
  for (let i = 0; i < rows; i++) {
    rowEls.push(<SkeletonRow key={`r${i}`} cols={cols} />);
  }
  return <>{rowEls}</>;
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

// ─── Phone Lookup Panel ────────────────────────────────────────────────────────

function PhoneLookup({
  bookings,
}: {
  bookings: Array<{
    id: bigint;
    customerName: string;
    customerPhone: string;
    pickupAddress: string;
    destination: string;
    date: bigint;
    durationHours: bigint;
    totalPrice: bigint;
    status: string;
  }>;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results =
    query.trim().length >= 3
      ? bookings.filter((b) =>
          b.customerPhone.replace(/\D/g, "").includes(query.replace(/\D/g, "")),
        )
      : [];

  const searched = query.trim().length >= 3;

  return (
    <Card className="shadow-sm border-2" style={{ borderColor: `${GREEN}40` }}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: GREEN }}
          >
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">
              Customer Phone Lookup
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Search any booking instantly by mobile number
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="tel"
            placeholder="Enter mobile number (e.g. 9876543210)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9 h-10 bg-white text-base tracking-wide"
            data-ocid="dashboard.phone_lookup.input"
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searched && (
          <div>
            {results.length === 0 ? (
              <div
                className="text-center py-6 rounded-lg"
                style={{ background: "oklch(0.97 0.02 145)" }}
                data-ocid="dashboard.phone_lookup.no_results"
              >
                <Phone className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm font-medium text-muted-foreground">
                  No bookings found for this number
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different mobile number
                </p>
              </div>
            ) : (
              <div
                className="space-y-2"
                data-ocid="dashboard.phone_lookup.results"
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {results.length} booking{results.length !== 1 ? "s" : ""}{" "}
                  found
                </p>
                {results.map((b) => (
                  <div
                    key={String(b.id)}
                    className="rounded-lg border bg-white p-4 space-y-3"
                    data-ocid={`dashboard.phone_lookup.result.${b.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">
                          {b.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {b.customerPhone}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {statusBadge(b.status as StatusBadgeType)}
                        <span className="text-xs font-mono font-semibold text-green-700">
                          BK-{String(b.id)}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="text-muted-foreground font-medium">
                          Pickup
                        </p>
                        <p className="text-foreground mt-0.5 line-clamp-2">
                          {b.pickupAddress}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">
                          Destination
                        </p>
                        <p className="text-foreground mt-0.5 line-clamp-2">
                          {b.destination}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">
                          Date
                        </p>
                        <p className="text-foreground mt-0.5">
                          {new Date(Number(b.date)).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">
                          Amount
                        </p>
                        <p className="text-foreground font-semibold mt-0.5">
                          ₹{Number(b.totalPrice).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!searched && (
          <p className="text-xs text-muted-foreground text-center pb-1">
            Type at least 3 digits to search
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);

  // Backend queries
  const {
    data: bookings,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useAllBookings();
  const {
    data: drivers,
    isLoading: driversLoading,
    refetch: refetchDrivers,
  } = useAllDrivers();

  // Backend mutations
  const updateStatus = useUpdateBookingStatus();
  const deleteDriverMutation = useDeleteDriver();

  // Enquiries from localStorage (subscription form submissions)
  const [enquiries, setEnquiries] = useState<LocalEnquiry[]>(() =>
    JSON.parse(localStorage.getItem("driveease_enquiries") || "[]"),
  );

  // Search state
  const [bookingSearch, setBookingSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [enquirySearch, setEnquirySearch] = useState("");

  // Feedback dialog state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<LocalEnquiry | null>(
    null,
  );
  const [feedbackText, setFeedbackText] = useState("");

  // Cancel booking dialog state
  const [cancelBookingOpen, setCancelBookingOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<bigint | null>(null);

  // Remove driver dialog state
  const [removeDriverOpen, setRemoveDriverOpen] = useState(false);
  const [removeDriverTarget, setRemoveDriverTarget] = useState<{
    id: bigint;
    name: string;
  } | null>(null);

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  // ── Filtered lists ──────────────────────────────────────────────────────────
  const filteredBookings = (bookings || []).filter(
    (b) =>
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.customerPhone.includes(bookingSearch) ||
      `BK-${b.id}`.toLowerCase().includes(bookingSearch.toLowerCase()),
  );

  const filteredDrivers = (drivers || []).filter((d) =>
    d.name.toLowerCase().includes(driverSearch.toLowerCase()),
  );

  const filteredEnquiries = enquiries.filter(
    (e) =>
      e.name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.phone.includes(enquirySearch) ||
      e.city.toLowerCase().includes(enquirySearch.toLowerCase()),
  );

  // ── Stats ───────────────────────────────────────────────────────────────────
  const totalBookings = bookings?.length || 0;
  const pendingBookings = (bookings || []).filter(
    (b) => b.status === "pending",
  ).length;
  const confirmedBookings = (bookings || []).filter(
    (b) => b.status === "confirmed",
  ).length;
  const totalDrivers = drivers?.length || 0;
  const totalEnquiries = enquiries.length;

  // ── Action handlers ─────────────────────────────────────────────────────────

  async function confirmBooking(id: bigint) {
    try {
      await updateStatus.mutateAsync({
        id,
        status: "confirmed" as BookingStatus,
      });
      await refetchBookings();
      toast.success(`Booking BK-${id} confirmed`);
    } catch {
      toast.error("Failed to confirm booking");
    }
  }

  function openCancelBooking(id: bigint) {
    setCancelBookingId(id);
    setCancelBookingOpen(true);
  }

  async function executeCancelBooking() {
    if (cancelBookingId === null) return;
    try {
      await updateStatus.mutateAsync({
        id: cancelBookingId,
        status: "cancelled" as BookingStatus,
      });
      await refetchBookings();
      toast.error(`Booking BK-${cancelBookingId} has been cancelled`);
    } catch {
      toast.error("Failed to cancel booking");
    }
    setCancelBookingOpen(false);
    setCancelBookingId(null);
  }

  function openRemoveDriver(id: bigint, name: string) {
    setRemoveDriverTarget({ id, name });
    setRemoveDriverOpen(true);
  }

  async function executeRemoveDriver() {
    if (!removeDriverTarget) return;
    try {
      await deleteDriverMutation.mutateAsync(removeDriverTarget.id);
      await refetchDrivers();
      toast.error(`${removeDriverTarget.name} has been removed`);
    } catch {
      toast.error("Failed to remove driver");
    }
    setRemoveDriverOpen(false);
    setRemoveDriverTarget(null);
  }

  function confirmEnquiry(id: number) {
    const updated = enquiries.map((e) =>
      e.id === id ? { ...e, status: "Confirmed" as const } : e,
    );
    setEnquiries(updated);
    localStorage.setItem("driveease_enquiries", JSON.stringify(updated));
    toast.success("Enquiry confirmed");
  }

  function dismissEnquiry(id: number) {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    localStorage.setItem("driveease_enquiries", JSON.stringify(updated));
    toast.success("Enquiry dismissed");
  }

  function openFeedback(enq: LocalEnquiry) {
    setFeedbackTarget(enq);
    setFeedbackText("");
    setFeedbackOpen(true);
  }

  function submitFeedback() {
    if (!feedbackTarget) return;
    const updated = enquiries.map((e) =>
      e.id === feedbackTarget.id ? { ...e, feedback: feedbackText } : e,
    );
    setEnquiries(updated);
    localStorage.setItem("driveease_enquiries", JSON.stringify(updated));
    setFeedbackOpen(false);
    toast.success(`Feedback saved for ${feedbackTarget.name}`);
    setFeedbackTarget(null);
    setFeedbackText("");
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
              — {feedbackTarget?.plan} plan
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

      {/* Cancel Booking AlertDialog */}
      <AlertDialog open={cancelBookingOpen} onOpenChange={setCancelBookingOpen}>
        <AlertDialogContent data-ocid="dashboard.booking.cancel.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Cancel Booking BK-{String(cancelBookingId)}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="dashboard.booking.cancel.cancel_button">
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeCancelBooking}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-ocid="dashboard.booking.cancel.confirm_button"
            >
              Yes, Cancel Booking
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
              <strong>{removeDriverTarget?.name}</strong> from the platform?
              This action cannot be undone.
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
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage bookings, enquiries &amp; drivers in real-time
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Total Bookings"
            value={String(totalBookings)}
            color="oklch(0.50 0.18 145)"
          />
          <StatCard
            icon={<Car className="w-5 h-5" />}
            label="Pending"
            value={String(pendingBookings)}
            color="oklch(0.65 0.18 80)"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Confirmed"
            value={String(confirmedBookings)}
            color="oklch(0.55 0.18 220)"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Drivers"
            value={String(totalDrivers)}
            color="oklch(0.55 0.18 30)"
          />
          <StatCard
            icon={<MessageSquare className="w-5 h-5" />}
            label="Enquiries"
            value={String(totalEnquiries)}
            color="oklch(0.50 0.18 290)"
          />
        </div>

        {/* Phone Lookup */}
        <PhoneLookup bookings={bookings || []} />

        {/* Tabs */}
        <Tabs defaultValue="bookings">
          <TabsList className="bg-white border h-10 p-1 rounded-lg">
            <TabsTrigger
              value="bookings"
              data-ocid="dashboard.bookings.tab"
              className="data-[state=active]:text-white rounded-md text-sm"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="enquiries"
              data-ocid="dashboard.enquiries.tab"
              className="data-[state=active]:text-white rounded-md text-sm"
            >
              Enquiries
            </TabsTrigger>
            <TabsTrigger
              value="drivers"
              data-ocid="dashboard.drivers.tab"
              className="data-[state=active]:text-white rounded-md text-sm"
            >
              Drivers
            </TabsTrigger>
          </TabsList>

          {/* ── Bookings Tab ──────────────────────────────────── */}
          <TabsContent value="bookings" className="mt-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">
                  All Bookings ({totalBookings})
                </CardTitle>
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search name, phone or ID..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="pl-8 h-9 bg-white"
                      data-ocid="dashboard.booking.search_input"
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
                          "Booking ID",
                          "Customer",
                          "Phone",
                          "Pickup",
                          "Destination",
                          "Date",
                          "Duration (hrs)",
                          "Amount",
                          "Status",
                        ],
                        filteredBookings.map((b) => [
                          `BK-${b.id}`,
                          b.customerName,
                          b.customerPhone,
                          b.pickupAddress,
                          b.destination,
                          new Date(Number(b.date)).toLocaleDateString("en-IN"),
                          String(b.durationHours),
                          `${Number(b.totalPrice).toLocaleString("en-IN")}`,
                          b.status,
                        ]),
                        "bookings.csv",
                      )
                    }
                    data-ocid="dashboard.booking.export.button"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-ocid="dashboard.booking.table">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Pickup</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingsLoading ? (
                        <TableSkeleton cols={10} />
                      ) : filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={10}
                            className="text-center py-10 text-muted-foreground"
                            data-ocid="dashboard.booking.empty_state"
                          >
                            No bookings found. Bookings from customers will
                            appear here.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookings.map((b, idx) => (
                          <TableRow
                            key={String(b.id)}
                            data-ocid={`dashboard.booking.row.${idx + 1}`}
                          >
                            <TableCell className="text-xs font-mono font-semibold text-green-700">
                              BK-{String(b.id)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {b.customerName}
                            </TableCell>
                            <TableCell className="text-sm">
                              {b.customerPhone}
                            </TableCell>
                            <TableCell className="text-sm max-w-[120px] truncate">
                              {b.pickupAddress}
                            </TableCell>
                            <TableCell className="text-sm max-w-[120px] truncate">
                              {b.destination}
                            </TableCell>
                            <TableCell className="text-sm">
                              {new Date(Number(b.date)).toLocaleDateString(
                                "en-IN",
                              )}
                            </TableCell>
                            <TableCell className="text-sm">
                              {String(b.durationHours)} hrs
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              ₹{Number(b.totalPrice).toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell>{statusBadge(b.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 flex-wrap">
                                {b.status === "pending" && (
                                  <Button
                                    size="sm"
                                    className="h-7 px-2.5 text-xs text-white"
                                    style={{ background: GREEN }}
                                    onClick={() => confirmBooking(b.id)}
                                    disabled={updateStatus.isPending}
                                    data-ocid={`dashboard.booking.confirm_button.${idx + 1}`}
                                  >
                                    Confirm
                                  </Button>
                                )}
                                {(b.status === "pending" ||
                                  b.status === "confirmed") && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2.5 text-xs border-red-300 text-red-600 hover:bg-red-50"
                                    onClick={() => openCancelBooking(b.id)}
                                    data-ocid={`dashboard.booking.delete_button.${idx + 1}`}
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

          {/* ── Enquiries Tab ──────────────────────────────────── */}
          <TabsContent value="enquiries" className="mt-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">
                  Subscription Enquiries ({totalEnquiries})
                </CardTitle>
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search name, phone or city..."
                      value={enquirySearch}
                      onChange={(e) => setEnquirySearch(e.target.value)}
                      className="pl-8 h-9 bg-white"
                      data-ocid="dashboard.enquiry.search_input"
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
                          "Phone",
                          "City",
                          "Plan",
                          "Message",
                          "Date",
                          "Status",
                        ],
                        filteredEnquiries.map((e) => [
                          e.name,
                          e.phone,
                          e.city,
                          e.plan,
                          e.message,
                          e.date,
                          e.status,
                        ]),
                        "enquiries.csv",
                      )
                    }
                    data-ocid="dashboard.enquiry.export.button"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table data-ocid="dashboard.enquiry.table">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEnquiries.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="text-center py-10 text-muted-foreground"
                            data-ocid="dashboard.enquiry.empty_state"
                          >
                            No enquiries yet. Subscription form submissions will
                            appear here.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEnquiries.map((enq, idx) => (
                          <TableRow
                            key={enq.id}
                            data-ocid={`dashboard.enquiry.row.${idx + 1}`}
                          >
                            <TableCell className="font-medium">
                              {enq.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {enq.phone}
                            </TableCell>
                            <TableCell className="text-sm">
                              {enq.city}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                {enq.plan}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm max-w-[150px] truncate">
                              {enq.message || "—"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {enq.date}
                            </TableCell>
                            <TableCell>{statusBadge(enq.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 flex-wrap">
                                {enq.status !== "Confirmed" && (
                                  <Button
                                    size="sm"
                                    className="h-7 px-2.5 text-xs text-white"
                                    style={{ background: GREEN }}
                                    onClick={() => confirmEnquiry(enq.id)}
                                    data-ocid={`dashboard.enquiry.confirm_button.${idx + 1}`}
                                  >
                                    Confirm
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2.5 text-xs"
                                  style={{ borderColor: GREEN, color: GREEN }}
                                  onClick={() => openFeedback(enq)}
                                  data-ocid={`dashboard.enquiry.secondary_button.${idx + 1}`}
                                >
                                  Feedback
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2.5 text-xs border-red-300 text-red-600 hover:bg-red-50"
                                  onClick={() => dismissEnquiry(enq.id)}
                                  data-ocid={`dashboard.enquiry.delete_button.${idx + 1}`}
                                >
                                  Dismiss
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

          {/* ── Drivers Tab ──────────────────────────────────────── */}
          <TabsContent value="drivers" className="mt-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
                <CardTitle className="text-base font-semibold">
                  Registered Drivers ({totalDrivers})
                </CardTitle>
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search driver name..."
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
                          "ID",
                          "Name",
                          "Experience (yrs)",
                          "Languages",
                          "Rating",
                          "Price/Hour",
                          "Available",
                        ],
                        filteredDrivers.map((d) => [
                          String(d.id),
                          d.name,
                          String(d.experienceYears),
                          d.languages.join(", "),
                          String(d.rating),
                          `₹${Number(d.pricePerHour)}`,
                          d.available ? "Yes" : "No",
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
                        <TableHead>Name</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Languages</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Price/Hour</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driversLoading ? (
                        <TableSkeleton cols={7} />
                      ) : filteredDrivers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-10 text-muted-foreground"
                            data-ocid="dashboard.driver.empty_state"
                          >
                            No drivers found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDrivers.map((drv, idx) => (
                          <TableRow
                            key={String(drv.id)}
                            data-ocid={`dashboard.driver.row.${idx + 1}`}
                          >
                            <TableCell className="font-medium">
                              {drv.name}
                            </TableCell>
                            <TableCell className="text-sm">
                              {String(drv.experienceYears)} yrs
                            </TableCell>
                            <TableCell className="text-sm">
                              {drv.languages.join(", ")}
                            </TableCell>
                            <TableCell className="text-sm">
                              <span className="text-yellow-600 font-semibold">
                                ★
                              </span>{" "}
                              {drv.rating.toFixed(1)}
                            </TableCell>
                            <TableCell className="text-sm font-medium">
                              ₹{Number(drv.pricePerHour)}/hr
                            </TableCell>
                            <TableCell>
                              {drv.available ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                  Available
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                                  Busy
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2.5 text-xs border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() =>
                                  openRemoveDriver(drv.id, drv.name)
                                }
                                disabled={deleteDriverMutation.isPending}
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

      {/* Footer */}
      <footer className="mt-12 py-6 border-t bg-white text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} DriveEase Admin Dashboard. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
