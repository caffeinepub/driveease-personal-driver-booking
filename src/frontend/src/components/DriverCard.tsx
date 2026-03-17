import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Clock,
  Globe,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { Driver } from "../backend";

const GREEN = "oklch(0.50 0.18 145)";

interface DriverCardProps {
  driver: Driver;
  index: number;
}

const CITY_KEYWORDS: { keywords: string[]; city: string }[] = [
  {
    keywords: [
      "delhi",
      "ncr",
      "gurgaon",
      "noida",
      "agra",
      "mathura",
      "vrindavan",
    ],
    city: "Uttar Pradesh",
  },
  {
    keywords: ["mumbai", "maharashtra", "aurangabad", "nagpur", "nashik"],
    city: "Maharashtra",
  },
  { keywords: ["pune", "hinjewadi", "kothrud"], city: "Pune" },
  {
    keywords: [
      "bangalore",
      "bengaluru",
      "karnataka",
      "mysuru",
      "hubli",
      "hospet",
      "belgaum",
    ],
    city: "Karnataka",
  },
  {
    keywords: [
      "chennai",
      "tamil",
      "coimbatore",
      "madurai",
      "trichy",
      "tirunelveli",
    ],
    city: "Tamil Nadu",
  },
  {
    keywords: ["kolkata", "bengal", "calcutta", "darjeeling", "siliguri"],
    city: "West Bengal",
  },
  {
    keywords: ["hyderabad", "telangana", "andhra", "vijayawada", "amaravati"],
    city: "Telangana/AP",
  },
  {
    keywords: [
      "jaipur",
      "rajasthan",
      "udaipur",
      "jodhpur",
      "jaisalmer",
      "barmer",
    ],
    city: "Rajasthan",
  },
  { keywords: ["ahmedabad", "gujarat", "surat", "vadodara"], city: "Gujarat" },
  {
    keywords: [
      "chandigarh",
      "punjab",
      "haryana",
      "amritsar",
      "ludhiana",
      "jalandhar",
      "patiala",
    ],
    city: "Punjab",
  },
  {
    keywords: ["lucknow", "uttar pradesh", "kanpur", "varanasi", "muzaffarpur"],
    city: "Uttar Pradesh",
  },
  {
    keywords: ["bhopal", "madhya pradesh", "indore", "gwalior"],
    city: "Madhya Pradesh",
  },
  {
    keywords: [
      "kochi",
      "kerala",
      "thiruvananthapuram",
      "kozhikode",
      "wayanad",
      "calicut",
      "malabar",
    ],
    city: "Kerala",
  },
  {
    keywords: [
      "guwahati",
      "assam",
      "assamese",
      "jorhat",
      "dibrugarh",
      "kaziranga",
    ],
    city: "Assam",
  },
  {
    keywords: [
      "patna",
      "bihar",
      "bhojpuri",
      "darbhanga",
      "sitamarhi",
      "motihari",
    ],
    city: "Bihar",
  },
  {
    keywords: [
      "bhubaneswar",
      "odia",
      "odisha",
      "puri",
      "cuttack",
      "chilika",
      "sambalpur",
    ],
    city: "Odisha",
  },
  { keywords: ["ranchi", "jharkhand"], city: "Jharkhand" },
  {
    keywords: ["raipur", "chhattisgarh", "chhattisgarhi"],
    city: "Chhattisgarh",
  },
  {
    keywords: ["dehradun", "uttarakhand", "garhwali", "manali", "rohtang"],
    city: "Uttarakhand",
  },
  {
    keywords: ["shimla", "himachal", "himachali", "kullu"],
    city: "Himachal Pradesh",
  },
  {
    keywords: ["srinagar", "kashmir", "kashmiri", "gulmarg", "pahalgam"],
    city: "J&K",
  },
  {
    keywords: ["leh", "ladakh", "ladakhi", "khardung", "pangong", "nubra"],
    city: "Ladakh",
  },
  { keywords: ["goa", "panaji", "margao", "konkani", "dabolim"], city: "Goa" },
  { keywords: ["aizawl", "mizoram", "mizo"], city: "Mizoram" },
  {
    keywords: ["imphal", "manipur", "meitei", "loktak", "moreh"],
    city: "Manipur",
  },
  { keywords: ["agartala", "tripura"], city: "Tripura" },
  { keywords: ["kohima", "nagaland", "nagamese", "dimapur"], city: "Nagaland" },
  { keywords: ["gangtok", "sikkim", "nathu la", "tsomgo"], city: "Sikkim" },
];

function detectCity(text: string): string {
  const lower = text.toLowerCase();
  for (const entry of CITY_KEYWORDS) {
    if (entry.keywords.some((k) => lower.includes(k))) return entry.city;
  }
  return "India";
}

export default function DriverCard({ driver, index }: DriverCardProps) {
  const initials = driver.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stars = [1, 2, 3, 4, 5];
  const city = detectCity(driver.description);

  return (
    <div
      className="uber-card overflow-hidden transition-all duration-300 hover:shadow-md"
      style={{
        borderColor: driver.available ? "oklch(0.88 0 0)" : "oklch(0.90 0 0)",
      }}
      data-ocid={`drivers.item.${index}`}
    >
      <div className="relative">
        {driver.photo ? (
          <img
            src={driver.photo}
            alt={driver.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div
            className="w-full h-48 flex items-center justify-center text-4xl font-display font-bold"
            style={{ background: "oklch(0.96 0.03 145)", color: GREEN }}
          >
            {initials}
          </div>
        )}
        {driver.available ? (
          <Badge
            className="absolute top-3 right-3 border font-semibold"
            style={{
              background: "oklch(0.50 0.18 145 / 0.12)",
              color: GREEN,
              borderColor: "oklch(0.50 0.18 145 / 0.35)",
            }}
          >
            Available
          </Badge>
        ) : (
          <Badge
            className="absolute top-3 right-3 border"
            style={{
              background: "oklch(0.94 0 0 / 0.9)",
              color: "oklch(0.50 0 0)",
              borderColor: "oklch(0.85 0 0)",
            }}
          >
            Unavailable
          </Badge>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">
              {driver.name}
            </h3>
            {/* Verified Badge */}
            <div
              className="flex items-center gap-1 mt-0.5"
              style={{ color: GREEN }}
            >
              <BadgeCheck className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">Verified</span>
            </div>
          </div>
          <div
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "oklch(0.95 0.02 145)",
              color: "oklch(0.40 0.12 145)",
              border: "1px solid oklch(0.88 0.04 145)",
            }}
          >
            <MapPin className="w-3 h-3" />
            <span>🇮🇳 {city}</span>
          </div>
        </div>

        {/* Behavior Rating — priority */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {stars.map((s) => (
              <Star
                key={s}
                className="w-4 h-4"
                style={{
                  fill: s <= Math.round(driver.rating) ? GREEN : "transparent",
                  color:
                    s <= Math.round(driver.rating) ? GREEN : "oklch(0.80 0 0)",
                }}
              />
            ))}
          </div>
          <span className="text-sm font-semibold" style={{ color: GREEN }}>
            Behavior: {driver.rating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            (Priority Rating)
          </span>
        </div>

        {/* Trust Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <div
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "oklch(0.96 0.03 145)",
              color: GREEN,
              border: "1px solid oklch(0.88 0.04 145)",
            }}
          >
            <ShieldCheck className="w-3 h-3" />
            Background Check
          </div>
          <div
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: "oklch(0.96 0.03 145)",
              color: GREEN,
              border: "1px solid oklch(0.88 0.04 145)",
            }}
          >
            <BadgeCheck className="w-3 h-3" />
            Grooming Trained
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{Number(driver.experienceYears)} yrs exp</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Globe className="w-3.5 h-3.5" />
            <span>{driver.languages.join(", ")}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {driver.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-2xl font-display font-bold"
              style={{ color: GREEN }}
            >
              ₹{Number(driver.pricePerHour)}
            </span>
            <span className="text-sm text-muted-foreground">/hr</span>
          </div>
          {driver.available ? (
            <Link
              to="/book/$driverId"
              params={{ driverId: driver.id.toString() }}
            >
              <Button
                size="sm"
                className="font-semibold rounded-full px-5 text-white"
                style={{ background: GREEN }}
                data-ocid={`drivers.book_button.${index}`}
              >
                Book Now
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              disabled
              className="rounded-full"
              data-ocid={`drivers.book_button.${index}`}
            >
              Unavailable
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
