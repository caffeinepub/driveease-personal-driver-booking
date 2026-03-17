import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { BookingStatus } from "../backend";
import { useBooking, useDriver } from "../hooks/useQueries";

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    [BookingStatus.pending]: "status-pending",
    [BookingStatus.confirmed]: "status-confirmed",
    [BookingStatus.completed]: "status-completed",
    [BookingStatus.cancelled]: "status-cancelled",
  };
  return <Badge className={`border ${map[status]} capitalize`}>{status}</Badge>;
}

export default function ConfirmationPage() {
  const { bookingId } = useParams({ from: "/confirmation/$bookingId" });
  const bookingIdBig = BigInt(bookingId);
  const { data: booking, isLoading } = useBooking(bookingIdBig);
  const { data: driver } = useDriver(booking ? booking.driverId : null);

  // Read insurance opted from navigation state
  const insuranceOpted = sessionStorage.getItem("driveease_insurance") === "1";

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-12 max-w-2xl"
        data-ocid="confirmation.loading_state"
      >
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div
        className="container mx-auto px-4 py-12 text-center"
        data-ocid="confirmation.error_state"
      >
        <p className="text-muted-foreground text-lg">Booking not found.</p>
        <Link to="/track">
          <Button className="mt-4">Track a Booking</Button>
        </Link>
      </div>
    );
  }

  const bookingDate = new Date(Number(booking.date)).toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "oklch(0.26 0.07 255 / 0.1)" }}
          >
            <CheckCircle2
              className="w-10 h-10"
              style={{ color: "oklch(0.26 0.07 255)" }}
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your driver has been booked successfully.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Booking ID:{" "}
            <span className="font-mono font-semibold text-foreground">
              #{booking.id.toString()}
            </span>
          </p>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-display font-bold text-lg">
                Booking Details
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {insuranceOpted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-green-300 text-green-800 text-xs font-semibold"
                    data-ocid="confirmation.insurance.success_state"
                  >
                    <Shield className="w-3.5 h-3.5 text-green-700" />
                    Ride Insurance: Active — ₹49
                  </motion.div>
                )}
                <StatusBadge status={booking.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{booking.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{booking.customerPhone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Car className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Driver</p>
                  <p className="font-medium">
                    {driver?.name ?? `Driver #${booking.driverId.toString()}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{bookingDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Time & Duration
                  </p>
                  <p className="font-medium">
                    {booking.time} · {Number(booking.durationHours)}h
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Pickup</p>
                  <p className="font-medium">{booking.pickupAddress}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Navigation className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Destination</p>
                <p className="font-medium">{booking.destination}</p>
              </div>
            </div>

            <div
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: "oklch(0.26 0.07 255)" }}
            >
              <div>
                <p className="text-white/80 text-sm">Total Price</p>
                {insuranceOpted && (
                  <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Incl. ₹49 ride insurance
                  </p>
                )}
              </div>
              <p className="font-display font-bold text-2xl text-white">
                ₹{Number(booking.totalPrice) + (insuranceOpted ? 49 : 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link to="/track" className="flex-1">
            <Button
              variant="outline"
              className="w-full"
              data-ocid="confirmation.secondary_button"
            >
              Check Another Booking
            </Button>
          </Link>
          <Link to="/drivers" className="flex-1">
            <Button
              className="w-full bg-primary text-primary-foreground"
              data-ocid="confirmation.primary_button"
            >
              Book Another Driver
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
