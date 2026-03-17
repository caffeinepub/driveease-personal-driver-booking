import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  Calendar,
  CalendarCheck,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Phone,
  Route,
  Shield,
  Star,
  Timer,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import LocationPicker from "../components/LocationPicker";
import {
  useAvailableDrivers,
  useCreateBooking,
  useDriver,
} from "../hooks/useQueries";

const GREEN = "oklch(0.50 0.18 145)";

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

function diffDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (e <= s) return 0;
  return Math.round((e - s) / (1000 * 60 * 60 * 24));
}

const CITY_COORDS: {
  keywords: string[];
  lat: number;
  lng: number;
  label: string;
}[] = [
  {
    keywords: ["delhi", "ncr", "new delhi"],
    lat: 28.6139,
    lng: 77.209,
    label: "Delhi",
  },
  {
    keywords: ["gurgaon", "gurugram"],
    lat: 28.4595,
    lng: 77.0266,
    label: "Gurgaon",
  },
  { keywords: ["noida"], lat: 28.5355, lng: 77.391, label: "Noida" },
  {
    keywords: ["mumbai", "bombay"],
    lat: 19.076,
    lng: 72.8777,
    label: "Mumbai",
  },
  {
    keywords: ["pune", "hinjewadi", "kothrud"],
    lat: 18.5204,
    lng: 73.8567,
    label: "Pune",
  },
  { keywords: ["nagpur"], lat: 21.1458, lng: 79.0882, label: "Nagpur" },
  { keywords: ["nashik"], lat: 20.0059, lng: 73.7797, label: "Nashik" },
  { keywords: ["aurangabad"], lat: 19.8762, lng: 75.3433, label: "Aurangabad" },
  {
    keywords: ["bangalore", "bengaluru"],
    lat: 12.9716,
    lng: 77.5946,
    label: "Bangalore",
  },
  {
    keywords: ["mysuru", "mysore"],
    lat: 12.2958,
    lng: 76.6394,
    label: "Mysuru",
  },
  { keywords: ["hubli"], lat: 15.3647, lng: 75.124, label: "Hubli" },
  { keywords: ["belgaum"], lat: 15.8497, lng: 74.4977, label: "Belgaum" },
  {
    keywords: ["chennai", "madras"],
    lat: 13.0827,
    lng: 80.2707,
    label: "Chennai",
  },
  { keywords: ["coimbatore"], lat: 11.0168, lng: 76.9558, label: "Coimbatore" },
  { keywords: ["madurai"], lat: 9.9252, lng: 78.1198, label: "Madurai" },
  {
    keywords: ["trichy", "tiruchirappalli"],
    lat: 10.7905,
    lng: 78.7047,
    label: "Trichy",
  },
  {
    keywords: ["kolkata", "calcutta"],
    lat: 22.5726,
    lng: 88.3639,
    label: "Kolkata",
  },
  { keywords: ["darjeeling"], lat: 27.036, lng: 88.2627, label: "Darjeeling" },
  { keywords: ["siliguri"], lat: 26.7271, lng: 88.3953, label: "Siliguri" },
  { keywords: ["hyderabad"], lat: 17.385, lng: 78.4867, label: "Hyderabad" },
  { keywords: ["vijayawada"], lat: 16.5062, lng: 80.648, label: "Vijayawada" },
  { keywords: ["jaipur"], lat: 26.9124, lng: 75.7873, label: "Jaipur" },
  { keywords: ["udaipur"], lat: 24.5854, lng: 73.7125, label: "Udaipur" },
  { keywords: ["jodhpur"], lat: 26.2389, lng: 73.0243, label: "Jodhpur" },
  { keywords: ["jaisalmer"], lat: 26.9157, lng: 70.9083, label: "Jaisalmer" },
  { keywords: ["ahmedabad"], lat: 23.0225, lng: 72.5714, label: "Ahmedabad" },
  { keywords: ["surat"], lat: 21.1702, lng: 72.8311, label: "Surat" },
  { keywords: ["vadodara"], lat: 22.3072, lng: 73.1812, label: "Vadodara" },
  { keywords: ["chandigarh"], lat: 30.7333, lng: 76.7794, label: "Chandigarh" },
  { keywords: ["amritsar"], lat: 31.634, lng: 74.8723, label: "Amritsar" },
  { keywords: ["ludhiana"], lat: 30.901, lng: 75.8573, label: "Ludhiana" },
  { keywords: ["lucknow"], lat: 26.8467, lng: 80.9462, label: "Lucknow" },
  { keywords: ["agra"], lat: 27.1767, lng: 78.0081, label: "Agra" },
  {
    keywords: ["varanasi", "banaras"],
    lat: 25.3176,
    lng: 82.9739,
    label: "Varanasi",
  },
  { keywords: ["kanpur"], lat: 26.4499, lng: 80.3319, label: "Kanpur" },
  { keywords: ["bhopal"], lat: 23.2599, lng: 77.4126, label: "Bhopal" },
  { keywords: ["indore"], lat: 22.7196, lng: 75.8577, label: "Indore" },
  { keywords: ["gwalior"], lat: 26.2183, lng: 78.1828, label: "Gwalior" },
  { keywords: ["kochi", "cochin"], lat: 9.9312, lng: 76.2673, label: "Kochi" },
  {
    keywords: ["thiruvananthapuram", "trivandrum"],
    lat: 8.5241,
    lng: 76.9366,
    label: "Thiruvananthapuram",
  },
  {
    keywords: ["kozhikode", "calicut"],
    lat: 11.2588,
    lng: 75.7804,
    label: "Kozhikode",
  },
  { keywords: ["guwahati"], lat: 26.1445, lng: 91.7362, label: "Guwahati" },
  { keywords: ["patna"], lat: 25.5941, lng: 85.1376, label: "Patna" },
  {
    keywords: ["bhubaneswar"],
    lat: 20.2961,
    lng: 85.8245,
    label: "Bhubaneswar",
  },
  { keywords: ["ranchi"], lat: 23.3441, lng: 85.3096, label: "Ranchi" },
  { keywords: ["raipur"], lat: 21.2514, lng: 81.6296, label: "Raipur" },
  { keywords: ["dehradun"], lat: 30.3165, lng: 78.0322, label: "Dehradun" },
  { keywords: ["shimla"], lat: 31.1048, lng: 77.1734, label: "Shimla" },
  { keywords: ["srinagar"], lat: 34.0837, lng: 74.7973, label: "Srinagar" },
  { keywords: ["leh", "ladakh"], lat: 34.1526, lng: 77.5771, label: "Leh" },
  {
    keywords: ["goa", "panaji", "margao"],
    lat: 15.2993,
    lng: 74.124,
    label: "Goa",
  },
  {
    keywords: ["aizawl", "mizoram"],
    lat: 23.7307,
    lng: 92.7173,
    label: "Aizawl",
  },
  {
    keywords: ["imphal", "manipur"],
    lat: 24.817,
    lng: 93.9368,
    label: "Imphal",
  },
  {
    keywords: ["agartala", "tripura"],
    lat: 23.8315,
    lng: 91.2868,
    label: "Agartala",
  },
  {
    keywords: ["kohima", "nagaland"],
    lat: 25.6751,
    lng: 94.1086,
    label: "Kohima",
  },
  {
    keywords: ["gangtok", "sikkim"],
    lat: 27.3389,
    lng: 88.6065,
    label: "Gangtok",
  },
  {
    keywords: ["manali", "rohtang"],
    lat: 32.2432,
    lng: 77.1892,
    label: "Manali",
  },
];

function getDriverCoords(
  description: string,
): { lat: number; lng: number; label: string } | null {
  const lower = description.toLowerCase();
  for (const entry of CITY_COORDS) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return { lat: entry.lat, lng: entry.lng, label: entry.label };
    }
  }
  return null;
}

export default function BookingPage() {
  const { driverId } = useParams({ from: "/book/$driverId" });
  const navigate = useNavigate();
  const driverIdBig = BigInt(driverId);
  const { data: driver, isLoading } = useDriver(driverIdBig);
  const createBooking = useCreateBooking();
  const { data: availableDrivers = [] } = useAvailableDrivers();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    pickupAddress: "",
    destination: "",
    startDate: "",
    endDate: "",
    time: "",
    durationHours: "8",
  });

  const [pickupLatLng, setPickupLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [dropLatLng, setDropLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [insuranceOpted, setInsuranceOpted] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const numberOfDays = diffDays(form.startDate, form.endDate);

  // biome-ignore lint/correctness/useExhaustiveDependencies: setForm is stable
  useEffect(() => {
    if (numberOfDays > 0) {
      setForm((prev) => ({ ...prev, durationHours: String(numberOfDays * 8) }));
    }
  }, [numberOfDays]);

  const handleStartDateChange = (val: string) => {
    update("startDate", val);
    if (!form.endDate || form.endDate < val) {
      update("endDate", val);
    }
  };

  const totalPricePerDay = driver ? Number(driver.pricePerHour) * 8 : 0;
  const basePrice = driver
    ? numberOfDays > 0
      ? totalPricePerDay * numberOfDays
      : Number(driver.pricePerHour) * Number(form.durationHours)
    : 0;
  const totalPrice = basePrice + (insuranceOpted ? 49 : 0);

  const estimatedDistance =
    pickupLatLng && dropLatLng
      ? haversineKm(
          pickupLatLng.lat,
          pickupLatLng.lng,
          dropLatLng.lat,
          dropLatLng.lng,
        ).toFixed(1)
      : null;

  const nearbyDrivers = useMemo(() => {
    if (!pickupLatLng || availableDrivers.length === 0) return [];
    const withDist = availableDrivers
      .filter((d) => d.id !== driverIdBig)
      .map((d) => {
        const coords = getDriverCoords(d.description);
        if (!coords) return null;
        const dist = haversineKm(
          pickupLatLng.lat,
          pickupLatLng.lng,
          coords.lat,
          coords.lng,
        );
        return { driver: d, dist, cityLabel: coords.label };
      })
      .filter(Boolean) as {
      driver: (typeof availableDrivers)[0];
      dist: number;
      cityLabel: string;
    }[];
    withDist.sort((a, b) => a.dist - b.dist);
    return withDist.slice(0, 4);
  }, [pickupLatLng, availableDrivers, driverIdBig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver) return;

    if (
      !form.customerName ||
      !form.customerPhone ||
      !form.pickupAddress ||
      !form.destination ||
      !form.startDate ||
      !form.time
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (form.endDate && form.endDate < form.startDate) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      const dateMs = BigInt(Date.parse(form.startDate));
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
      sessionStorage.setItem("driveease_insurance", insuranceOpted ? "1" : "0");
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
        {/* Emergency & Insurance Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mb-6 rounded-xl border-2 border-green-300 bg-green-50 overflow-hidden"
          data-ocid="booking.insurance.panel"
        >
          <div className="flex items-center gap-2.5 px-4 py-3 bg-green-700">
            <Shield className="w-5 h-5 text-white shrink-0" />
            <h3 className="font-display font-bold text-white text-base">
              Ride Protection & Emergency Help
            </h3>
          </div>
          <div className="px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  In case of an accident, call <strong>112</strong> immediately
                  or visit the insurance portal.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Emergency Helpline (Ambulance / Police / Fire)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:112"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "oklch(0.50 0.18 145)" }}
                data-ocid="booking.emergency.button"
              >
                <Phone className="w-4 h-4" />
                Call 112
              </a>
              <a
                href="https://www.policybazaar.com/motor-insurance/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 border-green-600 text-green-700 bg-white transition-colors hover:bg-green-50"
                data-ocid="booking.insurance.link"
              >
                <ExternalLink className="w-4 h-4" />
                View Insurance Portal
              </a>
            </div>
          </div>
        </motion.div>

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
                  style={{ background: GREEN }}
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
                <p
                  className="text-2xl font-display font-bold"
                  style={{ color: GREEN }}
                >
                  ₹{Number(driver.pricePerHour)}
                </p>
                <p className="text-sm text-muted-foreground">per hour</p>
                <p className="text-sm font-semibold" style={{ color: GREEN }}>
                  ₹{totalPricePerDay}/day
                </p>
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

              {/* Nearby Drivers Section */}
              <AnimatePresence>
                {pickupLatLng && nearbyDrivers.length > 0 && (
                  <motion.div
                    key="nearby"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-xl border border-green-200 bg-green-50 overflow-hidden"
                    data-ocid="booking.nearby_drivers.panel"
                  >
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-green-200 bg-green-100">
                      <Navigation className="w-4 h-4 text-green-700" />
                      <span className="font-semibold text-sm text-green-800">
                        Nearby Available Drivers
                      </span>
                      <span className="ml-auto text-xs text-green-600 font-medium">
                        Close to your pickup
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                      {nearbyDrivers.map(
                        ({ driver: nd, dist, cityLabel }, i) => {
                          const initials = nd.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2);
                          return (
                            <motion.div
                              key={nd.id.toString()}
                              initial={{ opacity: 0, scale: 0.97 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.06 }}
                              className="flex items-center gap-3 bg-white rounded-lg border border-green-100 p-3 shadow-sm"
                              data-ocid={`booking.nearby_drivers.item.${i + 1}`}
                            >
                              {nd.photo ? (
                                <img
                                  src={nd.photo}
                                  alt={nd.name}
                                  className="w-11 h-11 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div
                                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                                  style={{ background: GREEN }}
                                >
                                  {initials}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                  {nd.name}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-green-600 shrink-0" />
                                  <span className="text-xs text-gray-500 truncate">
                                    {cityLabel}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-1">
                                    ·
                                  </span>
                                  <span className="text-xs font-medium text-green-700">
                                    ~
                                    {dist < 10
                                      ? dist.toFixed(1)
                                      : Math.round(dist)}{" "}
                                    km
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-xs text-gray-600">
                                    {nd.rating.toFixed(1)}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-1">
                                    ·
                                  </span>
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color: GREEN }}
                                  >
                                    ₹{Number(nd.pricePerHour)}/hr
                                  </span>
                                </div>
                              </div>
                              <Link
                                to="/book/$driverId"
                                params={{ driverId: nd.id.toString() }}
                                data-ocid={`booking.nearby_drivers.book_button.${i + 1}`}
                              >
                                <button
                                  type="button"
                                  className="text-xs font-semibold px-3 py-1.5 rounded-full text-white transition-opacity hover:opacity-90 shrink-0"
                                  style={{ background: GREEN }}
                                >
                                  Switch
                                </button>
                              </Link>
                            </motion.div>
                          );
                        },
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

              {/* Booking Dates & Days */}
              <div className="rounded-xl border border-green-100 bg-green-50/50 p-4 space-y-4">
                <p className="text-sm font-semibold text-green-800 flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4" /> Booking Schedule
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="startDate"
                      className="flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" /> Booking Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      min={today}
                      data-ocid="booking.start_date.input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="endDate"
                      className="flex items-center gap-1.5"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" /> End Date
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => update("endDate", e.target.value)}
                      min={form.startDate || today}
                      data-ocid="booking.end_date.input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5" /> Number of Days
                    </Label>
                    <div
                      className="flex items-center justify-center h-10 rounded-md border font-bold text-lg"
                      style={{
                        background: "white",
                        borderColor: "oklch(0.88 0.05 145)",
                        color: GREEN,
                      }}
                      data-ocid="booking.days_count.panel"
                    >
                      {numberOfDays > 0
                        ? `${numberOfDays} day${numberOfDays > 1 ? "s" : ""}`
                        : "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Pickup Time
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
                    <Timer className="w-3.5 h-3.5" /> Hours per Day
                  </Label>
                  <Select
                    value={String(Math.min(Number(form.durationHours), 12))}
                    onValueChange={(v) =>
                      update(
                        "durationHours",
                        numberOfDays > 0 ? String(Number(v) * numberOfDays) : v,
                      )
                    }
                  >
                    <SelectTrigger id="duration" data-ocid="booking.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h} {h === 1 ? "hour" : "hours"}/day
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Insurance Opt-in */}
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="insurance"
                    checked={insuranceOpted}
                    onCheckedChange={(v) => setInsuranceOpted(Boolean(v))}
                    className="mt-0.5 border-green-600 data-[state=checked]:bg-green-700 data-[state=checked]:border-green-700"
                    data-ocid="booking.insurance.checkbox"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="insurance"
                      className="font-semibold text-gray-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-green-700" />
                      Accidental Ride Insurance —{" "}
                      <span className="text-green-700">₹49/ride</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Coverage active for the duration of this ride only. Plan
                      expires when ride is completed.
                    </p>
                    <a
                      href="https://www.policybazaar.com/motor-insurance/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-green-700 font-medium mt-1.5 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Learn more on
                      Insurance Portal
                    </a>
                  </div>
                  {insuranceOpted && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-700 text-white shrink-0"
                    >
                      +₹49
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Price Summary */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{
                  background: "oklch(0.95 0.03 145)",
                  border: "1px solid oklch(0.88 0.05 145)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    {numberOfDays > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        ₹{totalPricePerDay}/day × {numberOfDays} day
                        {numberOfDays > 1 ? "s" : ""}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        ₹{Number(driver.pricePerHour)} × {form.durationHours}{" "}
                        {Number(form.durationHours) === 1 ? "hour" : "hours"}
                      </p>
                    )}
                    {insuranceOpted && (
                      <p className="text-sm text-green-700 font-medium flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" /> Ride Insurance: +₹49
                      </p>
                    )}
                    <p className="font-display font-bold text-2xl text-foreground">
                      Total: ₹{totalPrice}
                    </p>
                    {estimatedDistance && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Route distance: ~{estimatedDistance} km
                      </p>
                    )}
                    {numberOfDays > 0 && form.startDate && form.endDate && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {form.startDate} to {form.endDate}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="font-semibold text-white"
                    style={{ background: GREEN }}
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
