import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import DriverCard from "../components/DriverCard";
import { useAvailableDrivers } from "../hooks/useQueries";

const GREEN = "oklch(0.50 0.18 145)";
const GREEN_TINT = "oklch(0.97 0.02 145)";
const GREEN_BORDER = "oklch(0.88 0.05 145)";
const GREEN_ICON_BG = "oklch(0.95 0.05 145)";

const steps = [
  {
    icon: Car,
    title: "Choose a Driver",
    desc: "Browse our verified professional drivers with ratings and experience from all over India.",
    step: "01",
  },
  {
    icon: CalendarCheck,
    title: "Book & Confirm",
    desc: "Fill in your trip details and get an instant booking confirmation.",
    step: "02",
  },
  {
    icon: MapPin,
    title: "Enjoy the Ride",
    desc: "Your driver arrives at your location. You relax, they drive your car.",
    step: "03",
  },
];

const features = [
  {
    icon: Shield,
    title: "Safe & Verified",
    desc: "All drivers are background-checked, Aadhaar & license verified.",
  },
  {
    icon: Star,
    title: "Best Prices",
    desc: "Transparent pricing with no hidden fees. Always get the best deal.",
  },
  {
    icon: Clock,
    title: "On-Time",
    desc: "Punctuality is our promise. Your driver will always be on time.",
  },
  {
    icon: CheckCircle,
    title: "Pan-India Coverage",
    desc: "Drivers available in Delhi, Mumbai, Chennai, Kolkata, and 100+ cities.",
  },
];

const ambassadorStats = [
  { label: "Trips Endorsed", value: "10,000+" },
  { label: "Cities Covered", value: "100+" },
  { label: "Customer Trust", value: "98%" },
  { label: "Years with Us", value: "3+" },
];

export default function LandingPage() {
  const { data: drivers, isLoading } = useAvailableDrivers();
  const featuredDrivers = drivers?.slice(0, 3) ?? [];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "oklch(0.97 0.03 145)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: GREEN }}
        />
        <div className="container mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: "oklch(0.50 0.18 145 / 0.12)",
                color: GREEN,
                border: "1px solid oklch(0.50 0.18 145 / 0.25)",
              }}
            >
              <Star className="w-3.5 h-3.5" fill="currentColor" />
              Trusted by 10,000+ customers across India
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-foreground">
              Hire a Professional Driver
              <br />
              <span style={{ color: GREEN }}>Across India</span>
            </h1>
            <p className="text-lg max-w-md text-muted-foreground">
              We provide verified drivers from every corner of India. Your car,
              our expert driver — safe, affordable, on-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/drivers">
                <Button
                  size="lg"
                  className="font-semibold text-base px-8 rounded-full text-white"
                  style={{ background: GREEN }}
                  data-ocid="hero.primary_button"
                >
                  Book a Driver Now <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link to="/register-driver">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold text-base px-8 rounded-full"
                  style={{
                    borderColor: GREEN_BORDER,
                    color: "oklch(0.20 0 0)",
                    background: "white",
                  }}
                  data-ocid="hero.secondary_button"
                >
                  Drive With Us →
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src="/assets/generated/hero-driver-india.dim_800x600.jpg"
                alt="Professional Driver across India"
                className="relative rounded-2xl w-full max-w-md object-cover"
                style={{ maxHeight: 420, border: `1px solid ${GREEN_BORDER}` }}
              />
              <div
                className="absolute -bottom-4 -left-4 rounded-xl p-4 flex items-center gap-3 bg-white"
                style={{ border: `1px solid ${GREEN_BORDER}` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: GREEN }}
                >
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    All drivers are
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Verified & Insured
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
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
              Three simple steps to get your driver
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

      {/* Why Choose Us */}
      <section className="py-20" style={{ background: GREEN_TINT }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Why Choose DriveEase?
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for a stress-free ride
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
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

      {/* Brand Ambassador */}
      <section
        className="py-20 bg-background overflow-hidden"
        data-ocid="ambassador.section"
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
              {/* Photo */}
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

              {/* Text */}
              <motion.div
                className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {/* Stars */}
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
      <section className="py-20" style={{ background: GREEN_TINT }}>
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
      <section className="py-16 bg-background">
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
    </div>
  );
}
