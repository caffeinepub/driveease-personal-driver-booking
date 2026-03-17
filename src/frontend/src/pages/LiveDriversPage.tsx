import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Clock, Gauge, MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

interface LiveDriver {
  id: number;
  name: string;
  city: string;
  state: string;
  route: string;
  speed: number;
  hoursOnRoad: number;
  tripType: string;
  vehicle: string;
  rating: number;
  phone: string;
  avatar: string;
  lat: string;
  lng: string;
}

const LIVE_DRIVERS: LiveDriver[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    city: "New Delhi",
    state: "Delhi",
    route: "Connaught Place → IGI Airport",
    speed: 62,
    hoursOnRoad: 2.5,
    tripType: "Airport Drop",
    vehicle: "Honda City",
    rating: 4.9,
    phone: "98100XXXXX",
    avatar: "RK",
    lat: "28.6139",
    lng: "77.2090",
  },
  {
    id: 2,
    name: "Suresh Patil",
    city: "Mumbai",
    state: "Maharashtra",
    route: "Bandra → BKC",
    speed: 38,
    hoursOnRoad: 1.2,
    tripType: "Office Ride",
    vehicle: "Maruti Swift",
    rating: 4.7,
    phone: "98200XXXXX",
    avatar: "SP",
    lat: "19.0596",
    lng: "72.8295",
  },
  {
    id: 3,
    name: "Venkat Rao",
    city: "Bengaluru",
    state: "Karnataka",
    route: "Whitefield → Electronic City",
    speed: 45,
    hoursOnRoad: 3.0,
    tripType: "Tech Park Shuttle",
    vehicle: "Toyota Innova",
    rating: 4.8,
    phone: "98400XXXXX",
    avatar: "VR",
    lat: "12.9716",
    lng: "77.5946",
  },
  {
    id: 4,
    name: "Pradeep Sharma",
    city: "Jaipur",
    state: "Rajasthan",
    route: "City Palace → Amber Fort",
    speed: 55,
    hoursOnRoad: 0.8,
    tripType: "Tourist Trip",
    vehicle: "Innova Crysta",
    rating: 4.9,
    phone: "94100XXXXX",
    avatar: "PS",
    lat: "26.9124",
    lng: "75.7873",
  },
  {
    id: 5,
    name: "Anand Krishnan",
    city: "Chennai",
    state: "Tamil Nadu",
    route: "Anna Nagar → Chennai Airport",
    speed: 70,
    hoursOnRoad: 1.5,
    tripType: "Airport Drop",
    vehicle: "Honda Amaze",
    rating: 4.6,
    phone: "98400XXXXX",
    avatar: "AK",
    lat: "13.0827",
    lng: "80.2707",
  },
  {
    id: 6,
    name: "Mohan Das",
    city: "Kolkata",
    state: "West Bengal",
    route: "Salt Lake → Howrah Station",
    speed: 42,
    hoursOnRoad: 2.0,
    tripType: "Station Drop",
    vehicle: "Hyundai i20",
    rating: 4.5,
    phone: "98300XXXXX",
    avatar: "MD",
    lat: "22.5726",
    lng: "88.3639",
  },
  {
    id: 7,
    name: "Ramesh Nair",
    city: "Kochi",
    state: "Kerala",
    route: "MG Road → Cochin Port",
    speed: 50,
    hoursOnRoad: 1.0,
    tripType: "Port Transfer",
    vehicle: "Tata Nexon",
    rating: 4.8,
    phone: "98800XXXXX",
    avatar: "RN",
    lat: "9.9312",
    lng: "76.2673",
  },
  {
    id: 8,
    name: "Amit Singh",
    city: "Lucknow",
    state: "Uttar Pradesh",
    route: "Hazratganj → Charbagh",
    speed: 48,
    hoursOnRoad: 0.5,
    tripType: "Local Ride",
    vehicle: "Maruti Ertiga",
    rating: 4.7,
    phone: "98700XXXXX",
    avatar: "AS",
    lat: "26.8467",
    lng: "80.9462",
  },
  {
    id: 9,
    name: "Deepak Verma",
    city: "Hyderabad",
    state: "Telangana",
    route: "HITEC City → Shamshabad Airport",
    speed: 80,
    hoursOnRoad: 1.8,
    tripType: "Airport Run",
    vehicle: "Toyota Camry",
    rating: 4.9,
    phone: "98500XXXXX",
    avatar: "DV",
    lat: "17.3850",
    lng: "78.4867",
  },
  {
    id: 10,
    name: "Gurpreet Singh",
    city: "Amritsar",
    state: "Punjab",
    route: "Golden Temple → Raja Sansi Airport",
    speed: 60,
    hoursOnRoad: 0.7,
    tripType: "Airport Drop",
    vehicle: "Fortuner",
    rating: 4.8,
    phone: "98140XXXXX",
    avatar: "GS",
    lat: "31.6340",
    lng: "74.8723",
  },
  {
    id: 11,
    name: "Bikash Gogoi",
    city: "Guwahati",
    state: "Assam",
    route: "Paltan Bazar → Lokpriya Airport",
    speed: 55,
    hoursOnRoad: 1.3,
    tripType: "Airport Drop",
    vehicle: "Hyundai Creta",
    rating: 4.6,
    phone: "98640XXXXX",
    avatar: "BG",
    lat: "26.1445",
    lng: "91.7362",
  },
  {
    id: 12,
    name: "Rakesh Mishra",
    city: "Varanasi",
    state: "Uttar Pradesh",
    route: "Dashashwamedh Ghat → Lal Bahadur Airport",
    speed: 50,
    hoursOnRoad: 2.2,
    tripType: "Temple Tour",
    vehicle: "Innova",
    rating: 4.7,
    phone: "98970XXXXX",
    avatar: "RM",
    lat: "25.3176",
    lng: "82.9739",
  },
  {
    id: 13,
    name: "Sunil Bhatia",
    city: "Chandigarh",
    state: "Punjab",
    route: "Sector 17 → Chandigarh Airport",
    speed: 65,
    hoursOnRoad: 0.4,
    tripType: "Airport Drop",
    vehicle: "Honda Jazz",
    rating: 4.5,
    phone: "98160XXXXX",
    avatar: "SB",
    lat: "30.7333",
    lng: "76.7794",
  },
  {
    id: 14,
    name: "Nikhil Joshi",
    city: "Pune",
    state: "Maharashtra",
    route: "Hinjewadi IT Park → Pune Junction",
    speed: 44,
    hoursOnRoad: 1.6,
    tripType: "Corporate",
    vehicle: "Maruti Ciaz",
    rating: 4.8,
    phone: "98220XXXXX",
    avatar: "NJ",
    lat: "18.5204",
    lng: "73.8567",
  },
  {
    id: 15,
    name: "Sanjay Mehta",
    city: "Ahmedabad",
    state: "Gujarat",
    route: "Naroda → Sardar Patel Airport",
    speed: 72,
    hoursOnRoad: 0.9,
    tripType: "Airport Run",
    vehicle: "Kia Seltos",
    rating: 4.9,
    phone: "98790XXXXX",
    avatar: "SM",
    lat: "23.0225",
    lng: "72.5714",
  },
  {
    id: 16,
    name: "Arjun Pillai",
    city: "Thiruvananthapuram",
    state: "Kerala",
    route: "Technopark → TRV Airport",
    speed: 58,
    hoursOnRoad: 1.1,
    tripType: "IT Commute",
    vehicle: "Volkswagen Vento",
    rating: 4.7,
    phone: "98470XXXXX",
    avatar: "AP",
    lat: "8.5241",
    lng: "76.9366",
  },
  {
    id: 17,
    name: "Manoj Tiwari",
    city: "Bhopal",
    state: "Madhya Pradesh",
    route: "DB City Mall → Raja Bhoj Airport",
    speed: 60,
    hoursOnRoad: 0.6,
    tripType: "Airport Drop",
    vehicle: "Maruti Brezza",
    rating: 4.6,
    phone: "98930XXXXX",
    avatar: "MT",
    lat: "23.2599",
    lng: "77.4126",
  },
  {
    id: 18,
    name: "Kiran Reddy",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    route: "Beach Road → Visakha Airport",
    speed: 55,
    hoursOnRoad: 2.4,
    tripType: "Airport Run",
    vehicle: "Toyota Etios",
    rating: 4.5,
    phone: "98490XXXXX",
    avatar: "KR",
    lat: "17.6868",
    lng: "83.2185",
  },
  {
    id: 19,
    name: "Hemant Sahu",
    city: "Raipur",
    state: "Chhattisgarh",
    route: "Telibandha → Raipur Airport",
    speed: 62,
    hoursOnRoad: 0.3,
    tripType: "Airport Drop",
    vehicle: "Suzuki Dzire",
    rating: 4.6,
    phone: "98930XXXXX",
    avatar: "HS",
    lat: "21.2514",
    lng: "81.6296",
  },
  {
    id: 20,
    name: "Tapan Banik",
    city: "Agartala",
    state: "Tripura",
    route: "City Center → Agartala Airport",
    speed: 45,
    hoursOnRoad: 0.5,
    tripType: "Airport Drop",
    vehicle: "WagonR",
    rating: 4.4,
    phone: "98620XXXXX",
    avatar: "TB",
    lat: "23.8315",
    lng: "91.2868",
  },
];

function PulseDot() {
  return (
    <span className="relative flex h-3 w-3">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: "oklch(0.70 0.20 145)" }}
      />
      <span
        className="relative inline-flex rounded-full h-3 w-3"
        style={{ background: "oklch(0.70 0.20 145)" }}
      />
    </span>
  );
}

function LiveDriverCard({
  driver,
  index,
}: { driver: LiveDriver; index: number }) {
  const [speed, setSpeed] = useState(driver.speed);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(driver.speed + Math.floor(Math.random() * 10 - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, [driver.speed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-xl border overflow-hidden"
      style={{
        background: "oklch(0.94 0 0)",
        borderColor: "oklch(0.22 0.06 255)",
        boxShadow: "0 0 20px oklch(0.65 0.18 255 / 0.06)",
      }}
      data-ocid={`live.driver.item.${index}`}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid oklch(0.88 0 0)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.18 145), oklch(0.42 0.16 145))",
              color: "oklch(0.70 0.18 255)",
              border: "1px solid oklch(0.30 0.10 255 / 0.5)",
            }}
          >
            {driver.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">
              {driver.name}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {driver.city}, {driver.state}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PulseDot />
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: "oklch(0.50 0.18 145)",
              color: "oklch(0.70 0.20 145)",
              border: "1px solid oklch(0.35 0.12 145 / 0.4)",
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <Navigation
            className="w-4 h-4 mt-0.5 shrink-0"
            style={{ color: "oklch(0.65 0.18 255)" }}
          />
          <p className="text-sm text-muted-foreground">{driver.route}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div
            className="rounded-lg p-2 text-center"
            style={{ background: "oklch(1.0 0 0)" }}
          >
            <Gauge
              className="w-4 h-4 mx-auto mb-1"
              style={{ color: "oklch(0.72 0.16 75)" }}
            />
            <p
              className="text-xs font-bold"
              style={{ color: "oklch(0.72 0.16 75)" }}
            >
              {speed} km/h
            </p>
            <p className="text-xs text-muted-foreground">Speed</p>
          </div>
          <div
            className="rounded-lg p-2 text-center"
            style={{ background: "oklch(1.0 0 0)" }}
          >
            <Clock
              className="w-4 h-4 mx-auto mb-1"
              style={{ color: "oklch(0.65 0.18 255)" }}
            />
            <p
              className="text-xs font-bold"
              style={{ color: "oklch(0.65 0.18 255)" }}
            >
              {driver.hoursOnRoad}h
            </p>
            <p className="text-xs text-muted-foreground">On Road</p>
          </div>
          <div
            className="rounded-lg p-2 text-center"
            style={{ background: "oklch(1.0 0 0)" }}
          >
            <Car
              className="w-4 h-4 mx-auto mb-1"
              style={{ color: "oklch(0.70 0.20 145)" }}
            />
            <p
              className="text-xs font-bold"
              style={{ color: "oklch(0.70 0.20 145)" }}
            >
              ⭐ {driver.rating}
            </p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            className="text-xs"
            style={{
              background: "oklch(0.88 0 0)",
              color: "oklch(0.70 0.18 255)",
              border: "1px solid oklch(0.30 0.10 255 / 0.4)",
            }}
          >
            {driver.tripType}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {driver.vehicle}
          </span>
        </div>

        <div
          className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-2"
          style={{ background: "oklch(1.0 0 0)" }}
        >
          <span className="text-muted-foreground">GPS:</span>
          <span className="font-mono" style={{ color: "oklch(0.55 0.10 255)" }}>
            {driver.lat}°N, {driver.lng}°E
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveDriversPage() {
  const [tick, setTick] = useState(0);
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const uniqueStates = useMemo(() => {
    return [...new Set(LIVE_DRIVERS.map((d) => d.state))].sort();
  }, []);

  const filteredCities = useMemo(() => {
    const source = stateFilter
      ? LIVE_DRIVERS.filter((d) => d.state === stateFilter)
      : LIVE_DRIVERS;
    return [...new Set(source.map((d) => d.city))].sort();
  }, [stateFilter]);

  const handleStateChange = (value: string) => {
    setStateFilter(value);
    setCityFilter("");
  };

  const visibleDrivers = useMemo(() => {
    return LIVE_DRIVERS.filter((d) => {
      const matchesState = !stateFilter || d.state === stateFilter;
      const matchesCity = !cityFilter || d.city === cityFilter;
      return matchesState && matchesCity;
    });
  }, [stateFilter, cityFilter]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Live Drivers on Road
                </h1>
                <PulseDot />
              </div>
              <p className="text-muted-foreground">
                {visibleDrivers.length} driver
                {visibleDrivers.length !== 1 ? "s" : ""} currently active
                {stateFilter ? ` in ${stateFilter}` : " across India"}
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm self-start sm:self-auto"
              style={{
                background: "oklch(0.94 0 0)",
                border: "1px solid oklch(0.22 0.06 255)",
                color: "oklch(0.65 0.18 255)",
              }}
            >
              <span className="text-muted-foreground text-xs">IST</span>
              <span className="font-bold" key={tick}>
                {timeStr}
              </span>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <Select value={stateFilter} onValueChange={handleStateChange}>
              <SelectTrigger className="w-44" data-ocid="live.state.select">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All States</SelectItem>
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={cityFilter}
              onValueChange={setCityFilter}
              disabled={!stateFilter}
            >
              <SelectTrigger className="w-40" data-ocid="live.city.select">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Cities</SelectItem>
                {filteredCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(stateFilter || cityFilter) && (
              <button
                type="button"
                onClick={() => {
                  setStateFilter("");
                  setCityFilter("");
                }}
                className="text-sm text-primary underline hover:no-underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 rounded-xl"
          style={{
            background: "oklch(0.94 0 0)",
            border: "1px solid oklch(0.22 0.06 255)",
          }}
          data-ocid="live.stats.panel"
        >
          {[
            {
              label: "Drivers Online",
              value: visibleDrivers.length.toString(),
              color: "oklch(0.70 0.20 145)",
            },
            {
              label: "States Covered",
              value: [
                ...new Set(visibleDrivers.map((d) => d.state)),
              ].length.toString(),
              color: "oklch(0.65 0.18 255)",
            },
            { label: "Avg Rating", value: "4.7", color: "oklch(0.72 0.16 75)" },
            {
              label: "Trips Today",
              value: "138",
              color: "oklch(0.70 0.15 320)",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-2xl font-display font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Driver Grid */}
        {visibleDrivers.length === 0 ? (
          <div
            className="text-center py-24"
            data-ocid="live.drivers.empty_state"
          >
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground text-lg">
              No live drivers in this region right now.
            </p>
            <button
              type="button"
              onClick={() => {
                setStateFilter("");
                setCityFilter("");
              }}
              className="mt-4 text-sm text-primary underline hover:no-underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-ocid="live.drivers.list"
          >
            {visibleDrivers.map((driver, i) => (
              <LiveDriverCard key={driver.id} driver={driver} index={i + 1} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
