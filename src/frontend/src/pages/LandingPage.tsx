import { Button } from "@/components/ui/button";
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
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Calculator,
  CalendarCheck,
  Car,
  CheckCircle,
  ChevronRight,
  CreditCard,
  Heart,
  MapPin,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import DriverCard from "../components/DriverCard";
import { useAvailableDrivers } from "../hooks/useQueries";

const GREEN = "oklch(0.50 0.18 145)";
const GREEN_TINT = "oklch(0.97 0.02 145)";
const GREEN_BORDER = "oklch(0.88 0.05 145)";
const GREEN_ICON_BG = "oklch(0.95 0.05 145)";

const _trustBadges = [
  { label: "Police Verified" },
  { label: "Grooming Trained" },
  { label: "Assigned Driver" },
  { label: "Family Safe" },
];

const heroTrustIndicators = [
  { icon: "⭐", value: "4.8 Rating" },
  { icon: "🚗", value: "5000+ Drivers" },
  { icon: "👥", value: "10,000+ Customers" },
  { icon: "✅", value: "Aadhaar Verified" },
];

const differenceCards = [
  {
    icon: UserCheck,
    title: "Assigned Driver System",
    desc: "Same driver for office, school, parents, medical. Build trust, not just trips.",
  },
  {
    icon: Users,
    title: "Family Account",
    desc: "Son pays from Delhi, parents ride in Pune. Full family control with SOS, tracking, and spending limits.",
  },
  {
    icon: RefreshCw,
    title: "Subscription Plans",
    desc: "Monthly plans from ₹4,999. Office commute, school runs, senior care — all covered.",
  },
  {
    icon: ShieldCheck,
    title: "Trust Transparency",
    desc: "See police verification %, training badges, languages, years of experience. Know exactly who's driving your family.",
  },
];

const steps = [
  {
    icon: CreditCard,
    title: "Choose a Subscription or Driver",
    desc: "Browse monthly plans or pick a verified driver for a one-time trip.",
    step: "01",
  },
  {
    icon: UserCheck,
    title: "Get Your Assigned Driver",
    desc: "We assign you a dedicated, trained driver who learns your preferences.",
    step: "02",
  },
  {
    icon: Heart,
    title: "Build a Trusted Relationship",
    desc: "Same face every day. Your family trusts them. You depend on them.",
    step: "03",
  },
];

const miniPlans = [
  {
    name: "Daily Commute",
    price: "₹4,999",
    period: "/mo",
    icon: CreditCard,
    desc: "2 hrs daily, assigned driver",
  },
  {
    name: "Family Care",
    price: "₹6,999",
    period: "/mo",
    icon: Users,
    desc: "4 hrs, family account, SOS",
  },
  {
    name: "Senior Care",
    price: "₹7,999",
    period: "/mo",
    icon: Heart,
    desc: "All-day, medical visits, care",
  },
];

const ambassadorStats = [
  { label: "Trips Endorsed", value: "10,000+" },
  { label: "Cities Covered", value: "100+" },
  { label: "Customer Trust", value: "98%" },
  { label: "Years with Us", value: "3+" },
];

const BASE_RATES: Record<string, number> = {
  Hatchback: 120,
  Sedan: 150,
  SUV: 200,
  Luxury: 350,
  Electric: 180,
};

const DURATION_HOURS: Record<string, number> = {
  "1 Hour": 1,
  "2 Hours": 2,
  "3 Hours": 3,
  "Half Day (4 hrs)": 4,
  "Full Day (8 hrs)": 8,
};

const CITY_MULTIPLIER: Record<string, number> = {
  Mumbai: 1.3,
  Delhi: 1.3,
  Bangalore: 1.15,
  Hyderabad: 1.15,
  Chennai: 1.15,
  Pune: 1.15,
};

function getCityMultiplier(city: string): number {
  return CITY_MULTIPLIER[city] ?? 1.0;
}

function roundToNearest10(n: number): number {
  return Math.round(n / 10) * 10;
}

interface EstimateResult {
  low: number;
  high: number;
  base: number;
  hours: number;
  multiplier: number;
  carType: string;
  duration: string;
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg"
      style={{ background: "#25D366" }}
      aria-label="Chat on WhatsApp"
      data-ocid="whatsapp.button"
    >
      {/* Pulse ring */}
      <span
        className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping"
        style={{ background: "#25D366" }}
      />
      <MessageCircle className="w-7 h-7 relative z-10" />
    </a>
  );
}

export default function LandingPage() {
  const { data: drivers, isLoading } = useAvailableDrivers();
  const featuredDrivers = drivers?.slice(0, 3) ?? [];

  const [pickupAddress, setPickupAddress] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [journeyTime, setJourneyTime] = useState("");
  const [duration, setDuration] = useState("");
  const [carType, setCarType] = useState("");
  const [city, setCity] = useState("");
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const [estimateError, setEstimateError] = useState("");

  function handleCheckEstimate() {
    if (
      !pickupAddress ||
      !journeyDate ||
      !journeyTime ||
      !duration ||
      !carType ||
      !city
    ) {
      setEstimateError("Please fill in all fields to get an estimate.");
      return;
    }
    setEstimateError("");
    const base = BASE_RATES[carType];
    const hours = DURATION_HOURS[duration];
    const multiplier = getCityMultiplier(city);
    const price = base * hours * multiplier;
    setEstimate({
      low: roundToNearest10(price * 0.9),
      high: roundToNearest10(price * 1.1),
      base,
      hours,
      multiplier,
      carType,
      duration,
    });
  }

  return (
    <div>
      {/* ═══ HERO ═══ */}
      <section
        className="relative overflow-hidden min-h-[90vh] flex items-center"
        style={{ background: "oklch(0.12 0.04 145)" }}
        data-ocid="hero.section"
      >
        {/* Full-width background image (mobile) */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-driver.dim_1200x800.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px)",
          }}
        />
        {/* Dark overlay on mobile */}
        <div
          className="absolute inset-0 md:hidden"
          style={{ background: "rgba(0,0,0,0.55)" }}
        />

        {/* Desktop: right-side image panel */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 hidden md:block"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-driver.dim_1200x800.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          {/* Gradient overlay on image */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, oklch(0.12 0.04 145) 0%, oklch(0.12 0.04 145 / 0.5) 40%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 50%, oklch(0.12 0.04 145 / 0.4) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-20 md:py-28">
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6"
                style={{
                  background: "oklch(0.50 0.18 145 / 0.25)",
                  color: "oklch(0.88 0.12 145)",
                  border: "1px solid oklch(0.50 0.18 145 / 0.40)",
                }}
              >
                <Star className="w-3.5 h-3.5" fill="currentColor" />
                India's First Personal Driver Network
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Book a Professional Driver
              <br />
              <span style={{ color: "oklch(0.75 0.16 145)" }}>
                Anytime, Anywhere
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-lg md:text-xl max-w-lg mb-8"
              style={{ color: "oklch(0.85 0.04 145)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Verified drivers across India. Safe, reliable, and affordable
              rides at your fingertips.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 mb-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link to="/drivers">
                <Button
                  size="lg"
                  className="font-bold text-base px-8 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  style={{ background: GREEN }}
                  data-ocid="hero.primary_button"
                >
                  Book a Driver Now <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link to="/subscriptions">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold text-base px-8 rounded-full transition-all duration-200 hover:scale-105"
                  style={{
                    borderColor: "oklch(0.60 0.15 145)",
                    color: "oklch(0.88 0.12 145)",
                    background: "rgba(255,255,255,0.08)",
                  }}
                  data-ocid="hero.plans_button"
                >
                  View Plans →
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              {heroTrustIndicators.map((item) => (
                <div
                  key={item.value}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "white",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* The DriveEase Difference */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              The DriveEase Difference
            </h2>
            <p className="text-muted-foreground text-lg">
              We don't just book drivers. We build relationships.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differenceCards.map((f, i) => (
              <motion.div
                key={f.title}
                className="uber-card p-6 transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: GREEN_ICON_BG,
                    border: `1px solid ${GREEN_BORDER}`,
                  }}
                >
                  <f.icon className="w-6 h-6" style={{ color: GREEN }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2 text-foreground">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Transparency */}
      <section className="py-20" style={{ background: GREEN_TINT }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Know Your Driver Before They Arrive
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              We believe emotional safety is as important as physical safety.
            </p>
          </motion.div>

          <motion.div
            className="max-w-2xl mx-auto rounded-2xl overflow-hidden"
            style={{
              background: "white",
              border: `2px solid ${GREEN_BORDER}`,
              boxShadow: "0 8px 40px oklch(0.50 0.18 145 / 0.10)",
            }}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="px-6 py-4 flex items-center gap-4"
              style={{ background: GREEN }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-display font-bold text-white"
                style={{ background: "oklch(0.42 0.15 145)" }}
              >
                RS
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Ramesh Sharma
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.88 0.05 145)" }}
                >
                  Senior Driver · 8 Years Experience
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Star
                  className="w-4 h-4"
                  fill="oklch(0.78 0.18 75)"
                  color="oklch(0.78 0.18 75)"
                />
                <span className="text-white font-bold">4.9</span>
                <span
                  className="text-xs ml-1"
                  style={{ color: "oklch(0.88 0.05 145)" }}
                >
                  (Priority Rating)
                </span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  label: "Police Verification",
                  value: "✓ Verified",
                  ok: true,
                },
                {
                  icon: BadgeCheck,
                  label: "Background Check",
                  value: "✓ Complete",
                  ok: true,
                },
                {
                  icon: Star,
                  label: "Grooming Training",
                  value: "✓ Certified — Jan 2024",
                  ok: true,
                },
                {
                  icon: Heart,
                  label: "Medical Fitness",
                  value: "✓ Fit",
                  ok: true,
                },
                {
                  icon: MapPin,
                  label: "Languages",
                  value: "Hindi, English, Marathi",
                  ok: null,
                },
                {
                  icon: CalendarCheck,
                  label: "Experience",
                  value: "8 Years",
                  ok: null,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{
                    background: item.ok
                      ? "oklch(0.97 0.03 145)"
                      : "oklch(0.97 0 0)",
                    border: `1px solid ${item.ok ? GREEN_BORDER : "oklch(0.90 0 0)"}`,
                  }}
                >
                  <item.icon
                    className="w-5 h-5 mt-0.5 shrink-0"
                    style={{ color: item.ok ? GREEN : "oklch(0.50 0 0)" }}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: item.ok ? GREEN : "oklch(0.20 0 0)" }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex flex-wrap gap-2">
              {["Etiquette Pro", "Senior Care", "Family Driver"].map(
                (badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: GREEN_ICON_BG,
                      color: GREEN,
                      border: `1px solid ${GREEN_BORDER}`,
                    }}
                  >
                    <BadgeCheck className="w-3.5 h-3.5" />
                    {badge}
                  </div>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subscription Teaser */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Stop Booking. Start Subscribing.
            </h2>
            <p className="text-muted-foreground text-lg">
              Monthly plans designed for every family need.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            {miniPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className="uber-card p-6 text-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: GREEN_ICON_BG,
                    border: `1px solid ${GREEN_BORDER}`,
                  }}
                >
                  <plan.icon className="w-6 h-6" style={{ color: GREEN }} />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {plan.desc}
                </p>
                <p
                  className="font-display font-bold text-2xl"
                  style={{ color: GREEN }}
                >
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/subscriptions">
              <Button
                size="lg"
                className="font-semibold rounded-full px-10 text-white"
                style={{ background: GREEN }}
                data-ocid="landing.subscriptions.primary_button"
              >
                See All Plans <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Family Account */}
      <section className="py-20" style={{ background: GREEN_TINT }}>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "white",
                  border: `2px solid ${GREEN_BORDER}`,
                  boxShadow: "0 8px 32px oklch(0.50 0.18 145 / 0.10)",
                }}
              >
                <div
                  className="px-5 py-3 flex items-center gap-2"
                  style={{ background: GREEN }}
                >
                  <Users className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-sm">
                    Family Dashboard
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    {
                      name: "Arjun (Son)",
                      role: "Admin",
                      can: "Pay + Book + Track",
                      color: GREEN,
                    },
                    {
                      name: "Savita (Mother)",
                      role: "Member",
                      can: "Can Book",
                      color: "oklch(0.50 0.15 200)",
                    },
                    {
                      name: "Ramesh (Father)",
                      role: "Member",
                      can: "Can Book",
                      color: "oklch(0.50 0.15 200)",
                    },
                  ].map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center justify-between rounded-xl p-3"
                      style={{
                        background: GREEN_TINT,
                        border: `1px solid ${GREEN_BORDER}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: member.color }}
                        >
                          {member.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.can}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          background:
                            member.color === GREEN
                              ? "oklch(0.50 0.18 145 / 0.12)"
                              : "oklch(0.50 0.15 200 / 0.12)",
                          color: member.color,
                        }}
                      >
                        {member.role}
                      </span>
                    </div>
                  ))}
                  <div
                    className="rounded-xl p-3 flex items-center gap-2"
                    style={{
                      background: "oklch(0.55 0.22 25 / 0.08)",
                      border: "1px solid oklch(0.55 0.22 25 / 0.25)",
                    }}
                  >
                    <ShieldCheck
                      className="w-4 h-4"
                      style={{ color: "oklch(0.55 0.22 25)" }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "oklch(0.45 0.18 25)" }}
                    >
                      SOS Alert → Goes to family, not support
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 space-y-6"
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                One Family. One Account.
                <br />
                <span style={{ color: GREEN }}>Total Peace of Mind.</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Son in Delhi, parents in Pune? Manage everything from one family
                account.
              </p>
              <ul className="space-y-4">
                {[
                  {
                    icon: Users,
                    text: "Set who can book and who can only track",
                  },
                  {
                    icon: CreditCard,
                    text: "Spending limits per family member",
                  },
                  {
                    icon: ShieldCheck,
                    text: "SOS alert goes directly to family",
                  },
                  {
                    icon: MapPin,
                    text: "Real-time location sharing for all members",
                  },
                  {
                    icon: UserCheck,
                    text: "One trusted driver for the entire family",
                  },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: GREEN_ICON_BG,
                        border: `1px solid ${GREEN_BORDER}`,
                      }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: GREEN }} />
                    </div>
                    <span className="text-sm text-foreground font-medium pt-2">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/drivers">
                <Button
                  size="lg"
                  className="font-semibold rounded-full px-8 text-white mt-4"
                  style={{ background: GREEN }}
                  data-ocid="landing.family.primary_button"
                >
                  Set Up Family Account →
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to your trusted driver
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative text-center"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div
                  className="text-7xl font-display font-bold mb-4"
                  style={{ color: "oklch(0.92 0.04 145)" }}
                >
                  {step.step}
                </div>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: GREEN_ICON_BG,
                    border: `1px solid ${GREEN_BORDER}`,
                  }}
                >
                  <step.icon className="w-7 h-7" style={{ color: GREEN }} />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Price Estimate ─── */}
      <section
        className="py-20"
        style={{ background: GREEN_TINT }}
        data-ocid="estimate.section"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                background: "oklch(0.50 0.18 145 / 0.12)",
                color: GREEN,
                border: "1px solid oklch(0.50 0.18 145 / 0.25)",
              }}
            >
              <Calculator className="w-4 h-4" />
              Instant Fare Calculator
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Price Estimate
            </h2>
            <p className="text-muted-foreground text-lg">
              Get an instant fare estimate for your journey
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div
              className="rounded-2xl p-8"
              style={{
                background: "white",
                border: `2px solid ${GREEN_BORDER}`,
                boxShadow: "0 8px 40px oklch(0.50 0.18 145 / 0.10)",
              }}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="pickup"
                    className="text-sm font-semibold text-foreground"
                  >
                    From
                  </Label>
                  <Input
                    id="pickup"
                    placeholder="Pickup Address"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    data-ocid="estimate.input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="journey-date"
                      className="text-sm font-semibold text-foreground"
                    >
                      Date of Journey
                    </Label>
                    <Input
                      id="journey-date"
                      type="date"
                      value={journeyDate}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      data-ocid="estimate.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="journey-time"
                      className="text-sm font-semibold text-foreground"
                    >
                      Time of Journey
                    </Label>
                    <Input
                      id="journey-time"
                      type="time"
                      value={journeyTime}
                      onChange={(e) => setJourneyTime(e.target.value)}
                      data-ocid="estimate.input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">
                    Duration
                  </Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger data-ocid="estimate.select">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(DURATION_HOURS).map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">
                    Car Type
                  </Label>
                  <Select value={carType} onValueChange={setCarType}>
                    <SelectTrigger data-ocid="estimate.select">
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(BASE_RATES).map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-foreground">
                    City
                  </Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger data-ocid="estimate.select">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Delhi",
                        "Mumbai",
                        "Bangalore",
                        "Kolkata",
                        "Hyderabad",
                        "Chennai",
                        "Pune",
                        "Jaipur",
                        "Ahmedabad",
                        "Surat",
                        "Lucknow",
                        "Kanpur",
                        "Nagpur",
                        "Indore",
                        "Thane",
                      ].map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {estimateError && (
                  <p
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.55 0.22 25)" }}
                    data-ocid="estimate.error_state"
                  >
                    {estimateError}
                  </p>
                )}

                <Button
                  size="lg"
                  className="w-full font-semibold text-base rounded-xl text-white"
                  style={{ background: GREEN }}
                  onClick={handleCheckEstimate}
                  data-ocid="estimate.primary_button"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Check Estimate
                </Button>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6">
              {estimate ? (
                <motion.div
                  key="result"
                  className="rounded-2xl p-8"
                  style={{
                    background: "white",
                    borderLeft: `6px solid ${GREEN}`,
                    border: `2px solid ${GREEN_BORDER}`,
                    borderLeftWidth: 6,
                    boxShadow: "0 8px 40px oklch(0.50 0.18 145 / 0.12)",
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  data-ocid="estimate.success_state"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: GREEN_ICON_BG,
                        border: `1px solid ${GREEN_BORDER}`,
                      }}
                    >
                      <Car className="w-6 h-6" style={{ color: GREEN }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        Estimated Fare
                      </p>
                      <p
                        className="font-display text-3xl font-bold"
                        style={{ color: GREEN }}
                      >
                        ₹{estimate.low.toLocaleString("en-IN")} – ₹
                        {estimate.high.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-xl p-4 mb-5 space-y-2"
                    style={{
                      background: GREEN_TINT,
                      border: `1px solid ${GREEN_BORDER}`,
                    }}
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Breakdown
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Car Type</span>
                      <span className="font-semibold text-foreground">
                        {estimate.carType}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Base Rate</span>
                      <span className="font-semibold text-foreground">
                        ₹{estimate.base}/hr
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold text-foreground">
                        {estimate.duration} ({estimate.hours} hr
                        {estimate.hours > 1 ? "s" : ""})
                      </span>
                    </div>
                    {estimate.multiplier > 1 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          City Surcharge
                        </span>
                        <span className="font-semibold text-foreground">
                          ×{estimate.multiplier}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-5">
                    Final price may vary based on traffic and wait time. No
                    hidden charges.
                  </p>

                  <Link to="/drivers">
                    <Button
                      size="lg"
                      className="w-full font-semibold rounded-xl text-white"
                      style={{ background: GREEN }}
                      data-ocid="estimate.primary_button"
                    >
                      Book This Driver →
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="rounded-2xl p-10 flex flex-col items-center justify-center text-center"
                  style={{
                    background: "white",
                    border: `2px dashed ${GREEN_BORDER}`,
                    minHeight: 340,
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                    style={{
                      background: GREEN_ICON_BG,
                      border: `2px solid ${GREEN_BORDER}`,
                    }}
                  >
                    <Calculator
                      className="w-10 h-10"
                      style={{ color: GREEN }}
                    />
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">
                    Your estimate appears here
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Fill in the form and click "Check Estimate" to see an
                    instant fare range for your journey.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {["Transparent", "No Hidden Charges", "Instant"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="text-xs font-semibold px-3 py-1 rounded-full"
                          style={{
                            background: GREEN_ICON_BG,
                            color: GREEN,
                            border: `1px solid ${GREEN_BORDER}`,
                          }}
                        >
                          ✓ {tag}
                        </span>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Ambassador */}
      <section
        className="py-20 bg-background overflow-hidden"
        data-ocid="ambassador.section"
        style={{ background: GREEN_TINT }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                background: "oklch(0.50 0.18 145 / 0.10)",
                color: GREEN,
                border: "1px solid oklch(0.50 0.18 145 / 0.25)",
              }}
            >
              ⭐ Official Brand Ambassador
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              The Face of DriveEase
            </h2>
          </motion.div>

          <div
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
            style={{
              border: `2px solid ${GREEN_BORDER}`,
              background: "white",
              boxShadow: "0 8px 48px oklch(0.50 0.18 145 / 0.10)",
            }}
          >
            <div className="flex flex-col md:flex-row">
              <motion.div
                className="md:w-2/5 relative"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div
                  className="h-80 md:h-full min-h-[340px] relative overflow-hidden"
                  style={{ background: "oklch(0.94 0.06 145)" }}
                >
                  <img
                    src="/assets/uploads/image-1.png"
                    alt="Himanshu Singh – Brand Ambassador DriveEase"
                    className="w-full h-full object-cover object-top"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20"
                    style={{
                      background:
                        "linear-gradient(to top, oklch(0.50 0.18 145 / 0.55), transparent)",
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center">
                    <span
                      className="text-xs font-bold tracking-widest uppercase text-white px-4 py-1.5 rounded-full"
                      style={{ background: "oklch(0.50 0.18 145 / 0.85)" }}
                    >
                      Brand Ambassador
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <div className="flex items-center gap-1 mb-5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.div
                      key={s}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + s * 0.07 }}
                    >
                      <Star
                        className="w-7 h-7"
                        fill="oklch(0.78 0.18 75)"
                        color="oklch(0.78 0.18 75)"
                      />
                    </motion.div>
                  ))}
                  <span
                    className="ml-2 text-sm font-semibold"
                    style={{ color: "oklch(0.55 0.14 75)" }}
                  >
                    5.0 / 5.0
                  </span>
                </div>

                <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
                  Himanshu Singh
                </h3>

                <div
                  className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-5"
                  style={{
                    background: GREEN_ICON_BG,
                    color: GREEN,
                    border: `1px solid ${GREEN_BORDER}`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ background: GREEN }}
                  />
                  Official Brand Ambassador · DriveEase
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  "Trusted face of DriveEase across India — bringing safety,
                  professionalism, and reliability to every journey."
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {ambassadorStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl p-4 text-center"
                      style={{
                        background: GREEN_ICON_BG,
                        border: `1px solid ${GREEN_BORDER}`,
                      }}
                    >
                      <p
                        className="text-xl font-bold font-display"
                        style={{ color: GREEN }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drivers */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex items-center justify-between mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Top-Rated Drivers from Across India
              </h2>
              <p className="text-muted-foreground">
                Verified professionals ready to drive
              </p>
            </div>
            <Link to="/drivers">
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2 rounded-full"
              >
                View All Drivers <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              data-ocid="drivers.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80 rounded-xl" />
              ))}
            </div>
          ) : featuredDrivers.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="drivers.empty_state"
            >
              No drivers available right now.
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              data-ocid="drivers.list"
            >
              {featuredDrivers.map((driver, i) => (
                <DriverCard
                  key={driver.id.toString()}
                  driver={driver}
                  index={i + 1}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/drivers">
              <Button variant="outline" className="rounded-full">
                View All Drivers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Driver CTA */}
      <section className="py-16" style={{ background: GREEN_TINT }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{
                background: "oklch(0.50 0.18 145 / 0.12)",
                color: GREEN,
                border: "1px solid oklch(0.50 0.18 145 / 0.25)",
              }}
            >
              🚗 Join 5,000+ Registered Drivers
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Are You a Professional Driver?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Register on DriveEase, get verified, and start earning. Drivers
              from all across India are welcome.
            </p>
            <Link to="/register-driver">
              <Button
                size="lg"
                className="font-semibold text-base px-10 rounded-full text-white"
                style={{ background: GREEN }}
                data-ocid="cta.register.primary_button"
              >
                Register as Driver — ₹150 only
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}
