import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Phone, Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BookingStatus } from "../backend";
import { useBookingsByPhone } from "../hooks/useQueries";

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    [BookingStatus.pending]: "status-pending",
    [BookingStatus.confirmed]: "status-confirmed",
    [BookingStatus.completed]: "status-completed",
    [BookingStatus.cancelled]: "status-cancelled",
  };
  return <Badge className={`border ${map[status]} capitalize`}>{status}</Badge>;
}

export default function TrackBookingPage() {
  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState("");
  const {
    data: bookings,
    isLoading,
    isFetched,
  } = useBookingsByPhone(submittedPhone);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedPhone(phone.trim());
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Track Your Booking
          </h1>
          <p className="text-muted-foreground">
            Enter your phone number to view your bookings
          </p>
        </div>

        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-ocid="track.search_input"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="track.submit_button"
              >
                <Search className="w-4 h-4 mr-2" /> Search Bookings
              </Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-4" data-ocid="track.loading_state">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading &&
          isFetched &&
          submittedPhone &&
          bookings?.length === 0 && (
            <div className="text-center py-12" data-ocid="track.empty_state">
              <p className="text-muted-foreground">
                No bookings found for this phone number.
              </p>
            </div>
          )}

        {bookings && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking, i) => {
              const bookingDate = new Date(
                Number(booking.date),
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <motion.div
                  key={booking.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card
                    className="shadow-card hover:shadow-hero transition-shadow"
                    data-ocid={`track.item.${i + 1}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-semibold text-sm">
                            Booking{" "}
                            <span className="font-mono">
                              #{booking.id.toString()}
                            </span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {booking.customerName}
                          </p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                        <p>
                          📅 {bookingDate} at {booking.time}
                        </p>
                        <p>⏱ {Number(booking.durationHours)}h duration</p>
                        <p>📍 {booking.pickupAddress}</p>
                        <p>🧭 {booking.destination}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-display font-bold text-lg text-primary">
                          ₹{Number(booking.totalPrice)}
                        </p>
                        <Link
                          to="/confirmation/$bookingId"
                          params={{ bookingId: booking.id.toString() }}
                        >
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
