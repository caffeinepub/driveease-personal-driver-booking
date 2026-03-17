import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Calendar,
  Clock,
  Loader2,
  Navigation,
  Phone,
  Route,
  Timer,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import LocationPicker from "../components/LocationPicker";
import { useCreateBooking, useDriver } from "../hooks/useQueries";

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function BookingPage() {
  const { driverId } = useParams({ from: "/book/$driverId" });
  const navigate = useNavigate();
  const driverIdBig = BigInt(driverId);
  const { data: driver, isLoading } = useDriver(driverIdBig);
  const createBooking = useCreateBooking();

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    pickupAddress: "",
    destination: "",
    date: "",
    time: "",
    durationHours: "1",
  });

  const [pickupLatLng, setPickupLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [dropLatLng, setDropLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const totalPrice = driver
    ? Number(driver.pricePerHour) * Number(form.durationHours)
    : 0;

  const estimatedDistance =
    pickupLatLng && dropLatLng
      ? haversineKm(
          pickupLatLng.lat,
          pickupLatLng.lng,
          dropLatLng.lat,
          dropLatLng.lng,
        ).toFixed(1)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver) return;

    if (
      !form.customerName ||
      !form.customerPhone ||
      !form.pickupAddress ||
      !form.destination ||
      !form.date ||
      !form.time
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const dateMs = BigInt(Date.parse(form.date));
      const bookingId = await createBooking.mutateAsync({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        pickupAddress: form.pickupAddress,
        destination: form.destination,
        date: dateMs,
        time: form.time,
        durationHours: BigInt(form.durationHours),
        driverId: driver.id,
      });
      toast.success("Booking created successfully!");
      navigate({
        to: "/confirmation/$bookingId",
        params: { bookingId: bookingId.toString() },
      });
    } catch {
      toast.error("Failed to create booking. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-12 max-w-4xl"
        data-ocid="booking.loading_state"
      >
        <Skeleton className="h-48 rounded-xl mb-8" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div
        className="container mx-auto px-4 py-12 text-center"
        data-ocid="booking.error_state"
      >
        <p className="text-muted-foreground text-lg">Driver not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Driver Summary */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {driver.photo ? (
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-display font-bold text-white"
                  style={{ background: "oklch(0.26 0.07 255)" }}
                >
                  {driver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <div className="flex-1">
                <h2 className="font-display font-bold text-xl">
                  {driver.name}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {Number(driver.experienceYears)} years experience · Rating:{" "}
                  {driver.rating.toFixed(1)}
                </p>
                <p className="text-muted-foreground text-sm">
                  {driver.languages.join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-display font-bold text-primary">
                  ₹{Number(driver.pricePerHour)}
                </p>
                <p className="text-sm text-muted-foreground">per hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Book Your Driver
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="customerName"
                    className="flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" /> Customer Name
                  </Label>
                  <Input
                    id="customerName"
                    placeholder="Your full name"
                    value={form.customerName}
                    onChange={(e) => update("customerName", e.target.value)}
                    data-ocid="booking.input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="customerPhone"
                    className="flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </Label>
                  <Input
                    id="customerPhone"
                    placeholder="+91 9876543210"
                    value={form.customerPhone}
                    onChange={(e) => update("customerPhone", e.target.value)}
                    data-ocid="booking.input"
                    required
                  />
                </div>
              </div>

              {/* Pickup Location with Map */}
              <LocationPicker
                label="Pickup Location"
                value={form.pickupAddress}
                onChange={(addr, lat, lng) => {
                  update("pickupAddress", addr);
                  if (lat && lng) setPickupLatLng({ lat, lng });
                  else setPickupLatLng(null);
                }}
                markerColor="green"
                showMyLocation
                ocidMap="booking.pickup_map"
                ocidSearch="booking.pickup_search_input"
              />

              {/* Drop-off Location with Map */}
              <LocationPicker
                label="Drop-off Location"
                value={form.destination}
                onChange={(addr, lat, lng) => {
                  update("destination", addr);
                  if (lat && lng) setDropLatLng({ lat, lng });
                  else setDropLatLng(null);
                }}
                markerColor="red"
                ocidMap="booking.dropoff_map"
                ocidSearch="booking.dropoff_search_input"
              />

              {/* Distance estimate */}
              {estimatedDistance && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/10 text-sm"
                >
                  <Route className="w-4 h-4 text-primary" />
                  <span className="text-foreground">
                    Est. distance:{" "}
                    <span className="font-semibold text-primary">
                      {estimatedDistance} km
                    </span>
                  </span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    data-ocid="booking.input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    data-ocid="booking.input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="duration"
                    className="flex items-center gap-1.5"
                  >
                    <Timer className="w-3.5 h-3.5" /> Duration (hours)
                  </Label>
                  <Select
                    value={form.durationHours}
                    onValueChange={(v) => update("durationHours", v)}
                  >
                    <SelectTrigger id="duration" data-ocid="booking.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h} {h === 1 ? "hour" : "hours"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Summary */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "oklch(0.94 0.01 255)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      ₹{Number(driver.pricePerHour)} × {form.durationHours}{" "}
                      {Number(form.durationHours) === 1 ? "hour" : "hours"}
                    </p>
                    <p className="font-display font-bold text-2xl text-foreground">
                      Total: ₹{totalPrice}
                    </p>
                    {estimatedDistance && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Route distance: ~{estimatedDistance} km
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    disabled={createBooking.isPending}
                    data-ocid="booking.submit_button"
                  >
                    {createBooking.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
