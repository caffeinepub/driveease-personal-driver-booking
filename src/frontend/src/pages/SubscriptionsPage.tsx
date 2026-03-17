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
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  CheckCircle,
  CheckCircle2,
  CreditCard,
  Heart,
  Phone,
  RefreshCw,
  ShieldCheck,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const GREEN = "oklch(0.50 0.18 145)";
const GREEN_TINT = "oklch(0.97 0.02 145)";
const GREEN_BORDER = "oklch(0.88 0.05 145)";
const GREEN_ICON_BG = "oklch(0.95 0.05 145)";

const plans = [
  {
    id: "daily-commute",
    name: "Daily Commute",
    price: "₹4,999",
    period: "/month",
    tagline: "For working professionals",
    popular: false,
    features: [
      "2 hrs daily (Mon–Sat)",
      "Assigned personal driver",
      "Office commute specialist",
      "Backup driver included",
      "Trip history & reports",
      "Driver behavior rating",
    ],
    icon: CreditCard,
  },
  {
    id: "family-care",
    name: "Family Care",
    price: "₹6,999",
    period: "/month",
    tagline: "Most popular for families",
    popular: true,
    features: [
      "4 hrs daily availability",
      "Family account (3 members)",
      "School + evening + weekend",
      "Priority 24/7 support",
      "SOS alert to family",
      "Spending limits per member",
      "Real-time location sharing",
    ],
    icon: Users,
  },
  {
    id: "senior-citizen",
    name: "Senior Citizen",
    price: "₹7,999",
    period: "/month",
    tagline: "Dedicated elder care",
    popular: false,
    features: [
      "All-day availability",
      "Dedicated senior care driver",
      "Medical visit support",
      "Door-to-door assistance",
      "Family tracking dashboard",
      "Extra patience & care training",
      "Emergency family SOS",
    ],
    icon: Heart,
  },
];

const steps = [
  {
    num: "01",
    title: "Choose a Plan",
    desc: "Pick the subscription that fits your lifestyle — commute, family, or senior care.",
    icon: CreditCard,
  },
  {
    num: "02",
    title: "Get Your Assigned Driver",
    desc: "We match you with a verified, trained driver who becomes your personal chauffeur.",
    icon: UserCheck,
  },
  {
    num: "03",
    title: "Enjoy Every Day",
    desc: "Same trusted driver, every day. Build a relationship, not just a booking.",
    icon: Heart,
  },
];

const comparisons = [
  {
    feature: "Driver assignment",
    subscription: "Same driver every time",
    oneTime: "Random driver",
  },
  {
    feature: "Pricing",
    subscription: "Fixed monthly rate",
    oneTime: "Variable per trip",
  },
  {
    feature: "Trust",
    subscription: "Builds over time",
    oneTime: "Starts fresh each ride",
  },
  {
    feature: "Family safety",
    subscription: "SOS + family tracking",
    oneTime: "Not available",
  },
  {
    feature: "Backup driver",
    subscription: "Pre-approved backup",
    oneTime: "Not available",
  },
  {
    feature: "Support priority",
    subscription: "Priority 24/7",
    oneTime: "Standard queue",
  },
];

const included = [
  { icon: ShieldCheck, label: "Background Verified" },
  { icon: Award, label: "Grooming & Etiquette" },
  { icon: BadgeCheck, label: "Police Verified" },
  { icon: Star, label: "Dress Code Enforced" },
  { icon: RefreshCw, label: "Behavior Rating" },
  { icon: Phone, label: "24/7 Support" },
];

const PLAN_OPTIONS = [
  { value: "daily-commute", label: "Daily Commute — ₹4,999/mo" },
  { value: "family-care", label: "Family Care — ₹6,999/mo" },
  { value: "senior-citizen", label: "Senior Citizen — ₹7,999/mo" },
];

function EnquiryForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    plan: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim()))
      e.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.plan) e.plan = "Please select a plan.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    const enquiry = {
      id: Date.now(),
      name: form.name,
      phone: form.phone,
      city: form.city,
      plan: form.plan,
      message: form.message,
      date: new Date().toISOString().split("T")[0],
      status: "Pending" as const,
    };
    const existing = JSON.parse(
      localStorage.getItem("driveease_enquiries") || "[]",
    );
    existing.unshift(enquiry);
    localStorage.setItem("driveease_enquiries", JSON.stringify(existing));
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", city: "", plan: "", message: "" });
    }, 3000);
  };

  return (
    <section className="py-20 bg-background" id="enquiry">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
              style={{
                background: "oklch(0.50 0.18 145 / 0.10)",
                color: GREEN,
                border: "1px solid oklch(0.50 0.18 145 / 0.22)",
              }}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Driver Assigned Within 24 Hours
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Register Your Interest
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Fill in your details and we&apos;ll assign your trusted driver
              within 24 hours.
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: "white",
              border: `1px solid ${GREEN_BORDER}`,
              boxShadow: "0 8px 32px oklch(0.50 0.18 145 / 0.10)",
            }}
          >
            {/* Subtle top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ background: GREEN }}
            />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-5"
                  data-ocid="subscriptions.enquiry.success_state"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: GREEN_ICON_BG,
                      border: `2px solid ${GREEN_BORDER}`,
                    }}
                  >
                    <CheckCircle2
                      className="w-10 h-10"
                      style={{ color: GREEN }}
                    />
                  </div>
                  <div>
                    <h3
                      className="font-display text-2xl font-bold mb-2"
                      style={{ color: "oklch(0.15 0 0)" }}
                    >
                      Thank you!
                    </h3>
                    <p className="text-muted-foreground text-base">
                      We&apos;ll call you within 24 hours to confirm your driver
                      assignment.
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                    style={{
                      background: "oklch(0.50 0.18 145 / 0.10)",
                      color: GREEN,
                      border: "1px solid oklch(0.50 0.18 145 / 0.22)",
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Enquiry received — resetting in a moment…
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6"
                >
                  {/* Row: Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="eq-name"
                        className="text-sm font-semibold text-foreground"
                      >
                        Full Name <span style={{ color: GREEN }}>*</span>
                      </Label>
                      <Input
                        id="eq-name"
                        type="text"
                        placeholder="e.g. Ramesh Sharma"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="rounded-xl h-11"
                        style={{
                          borderColor: errors.name ? "#e53e3e" : GREEN_BORDER,
                        }}
                        data-ocid="subscriptions.enquiry.input"
                      />
                      {errors.name && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#e53e3e" }}
                          data-ocid="subscriptions.enquiry.error_state"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="eq-phone"
                        className="text-sm font-semibold text-foreground"
                      >
                        Phone Number <span style={{ color: GREEN }}>*</span>
                      </Label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold select-none"
                          style={{ color: GREEN }}
                        >
                          +91
                        </span>
                        <Input
                          id="eq-phone"
                          type="tel"
                          placeholder="98765 43210"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((p) => ({ ...p, phone: e.target.value }))
                          }
                          className="rounded-xl h-11 pl-12"
                          style={{
                            borderColor: errors.phone
                              ? "#e53e3e"
                              : GREEN_BORDER,
                          }}
                          data-ocid="subscriptions.enquiry.input"
                        />
                      </div>
                      {errors.phone && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#e53e3e" }}
                          data-ocid="subscriptions.enquiry.error_state"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row: City + Plan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* City */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="eq-city"
                        className="text-sm font-semibold text-foreground"
                      >
                        Your City <span style={{ color: GREEN }}>*</span>
                      </Label>
                      <Input
                        id="eq-city"
                        type="text"
                        placeholder="e.g. Pune, Mumbai, Delhi"
                        value={form.city}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, city: e.target.value }))
                        }
                        className="rounded-xl h-11"
                        style={{
                          borderColor: errors.city ? "#e53e3e" : GREEN_BORDER,
                        }}
                        data-ocid="subscriptions.enquiry.input"
                      />
                      {errors.city && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#e53e3e" }}
                          data-ocid="subscriptions.enquiry.error_state"
                        >
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* Plan */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="eq-plan"
                        className="text-sm font-semibold text-foreground"
                      >
                        Plan Interest <span style={{ color: GREEN }}>*</span>
                      </Label>
                      <Select
                        value={form.plan}
                        onValueChange={(v) =>
                          setForm((p) => ({ ...p, plan: v }))
                        }
                      >
                        <SelectTrigger
                          id="eq-plan"
                          className="rounded-xl h-11"
                          style={{
                            borderColor: errors.plan ? "#e53e3e" : GREEN_BORDER,
                          }}
                          data-ocid="subscriptions.enquiry.select"
                        >
                          <SelectValue placeholder="Choose a plan…" />
                        </SelectTrigger>
                        <SelectContent>
                          {PLAN_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.plan && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "#e53e3e" }}
                          data-ocid="subscriptions.enquiry.error_state"
                        >
                          {errors.plan}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="eq-message"
                      className="text-sm font-semibold text-foreground"
                    >
                      Special Requirements{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="eq-message"
                      rows={4}
                      placeholder="e.g. I need a driver for school runs and evening use..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      className="rounded-xl resize-none"
                      style={{ borderColor: GREEN_BORDER }}
                      data-ocid="subscriptions.enquiry.textarea"
                    />
                  </div>

                  {/* Privacy note */}
                  <p className="text-xs text-muted-foreground">
                    🔒 Your information is safe with us. We&apos;ll only use it
                    to assign your trusted driver and confirm your subscription.
                  </p>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto sm:min-w-[200px] font-semibold rounded-full text-white text-base h-12"
                    style={{ background: GREEN }}
                    data-ocid="subscriptions.enquiry.submit_button"
                  >
                    Submit Enquiry
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function SubscriptionsPage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: "oklch(0.97 0.03 145)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: GREEN }}
        />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: "oklch(0.50 0.18 145 / 0.12)",
                color: GREEN,
                border: "1px solid oklch(0.50 0.18 145 / 0.25)",
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              India's First Personal Driver Subscription
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-foreground">
              Your Driver. Your Schedule.
              <br />
              <span style={{ color: GREEN }}>Every Month.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Stop booking rides. Start building relationships. One trusted
              driver, assigned to you — for office, family, or senior care.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a href="#plans">
                <Button
                  size="lg"
                  className="font-semibold rounded-full px-8 text-white"
                  style={{ background: GREEN }}
                  data-ocid="subscriptions.primary_button"
                >
                  View Plans
                </Button>
              </a>
              <Link to="/drivers">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold rounded-full px-8"
                  style={{ borderColor: GREEN_BORDER }}
                  data-ocid="subscriptions.secondary_button"
                >
                  Book One-Time Instead
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Choose Your Plan
            </h2>
            <p className="text-muted-foreground text-lg">
              Transparent pricing. No surprise charges. What you see is what you
              pay.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                data-ocid={`subscriptions.item.${i + 1}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl p-7 flex flex-col"
                style={{
                  background: plan.popular ? GREEN : "white",
                  border: plan.popular
                    ? `2px solid ${GREEN}`
                    : `1px solid ${GREEN_BORDER}`,
                  boxShadow: plan.popular
                    ? "0 16px 48px oklch(0.50 0.18 145 / 0.25)"
                    : "0 2px 8px oklch(0 0 0 / 0.06)",
                  color: plan.popular ? "white" : "inherit",
                }}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase"
                    style={{
                      background: "oklch(0.70 0.18 75)",
                      color: "white",
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: plan.popular
                      ? "oklch(1 0 0 / 0.18)"
                      : GREEN_ICON_BG,
                    border: plan.popular
                      ? "1px solid oklch(1 0 0 / 0.25)"
                      : `1px solid ${GREEN_BORDER}`,
                  }}
                >
                  <plan.icon
                    className="w-6 h-6"
                    style={{ color: plan.popular ? "white" : GREEN }}
                  />
                </div>

                <p
                  className="text-sm font-medium mb-1"
                  style={{
                    color: plan.popular
                      ? "oklch(0.90 0.05 145)"
                      : "oklch(0.45 0 0)",
                  }}
                >
                  {plan.tagline}
                </p>
                <h3
                  className="font-display text-2xl font-bold mb-1"
                  style={{ color: plan.popular ? "white" : "oklch(0.12 0 0)" }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mb-6">
                  <span
                    className="font-display text-4xl font-bold"
                    style={{ color: plan.popular ? "white" : GREEN }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-sm mb-1"
                    style={{
                      color: plan.popular
                        ? "oklch(0.88 0 0)"
                        : "oklch(0.55 0 0)",
                    }}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{
                          color: plan.popular ? "oklch(0.88 0.05 145)" : GREEN,
                        }}
                      />
                      <span
                        className="text-sm"
                        style={{
                          color: plan.popular
                            ? "oklch(0.93 0 0)"
                            : "oklch(0.35 0 0)",
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/drivers">
                  <Button
                    className="w-full rounded-full font-semibold"
                    style={{
                      background: plan.popular ? "white" : GREEN,
                      color: plan.popular ? GREEN : "white",
                    }}
                    data-ocid={`subscriptions.plan.primary_button.${i + 1}`}
                  >
                    Choose Plan
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ background: GREEN_TINT }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              How Subscriptions Work
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple. Transparent. Yours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="text-center"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div
                  className="text-6xl font-display font-bold mb-4"
                  style={{ color: "oklch(0.92 0.04 145)" }}
                >
                  {step.num}
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
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Subscription vs. One-Time Booking
            </h2>
            <p className="text-muted-foreground">
              See why thousands of families choose a subscription over one-time
              rides.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${GREEN_BORDER}` }}
          >
            <div
              className="grid grid-cols-3 text-sm font-semibold px-6 py-3"
              style={{ background: GREEN, color: "white" }}
              data-ocid="subscriptions.table"
            >
              <span>Feature</span>
              <span className="text-center">Subscription ✓</span>
              <span className="text-center">One-Time Booking</span>
            </div>
            {comparisons.map((row, i) => (
              <div
                key={row.feature}
                className="grid grid-cols-3 text-sm px-6 py-4 items-center"
                style={{
                  background: i % 2 === 0 ? "white" : GREEN_TINT,
                  borderTop: `1px solid ${GREEN_BORDER}`,
                }}
              >
                <span className="font-medium text-foreground">
                  {row.feature}
                </span>
                <span
                  className="text-center font-medium"
                  style={{ color: GREEN }}
                >
                  {row.subscription}
                </span>
                <span className="text-center text-muted-foreground">
                  {row.oneTime}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20" style={{ background: GREEN_TINT }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              What's Included in Every Plan
            </h2>
            <p className="text-muted-foreground">
              Every DriveEase driver meets our highest standards — no
              exceptions.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 max-w-4xl mx-auto">
            {included.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex flex-col items-center text-center gap-3 rounded-2xl p-5"
                style={{
                  background: "white",
                  border: `1px solid ${GREEN_BORDER}`,
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: GREEN_ICON_BG,
                    border: `1px solid ${GREEN_BORDER}`,
                  }}
                >
                  <item.icon className="w-6 h-6" style={{ color: GREEN }} />
                </div>
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry / Register Interest Form */}
      <EnquiryForm />

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Meet Your Driver?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Start with a one-time booking or jump straight into a
              subscription. Your trusted driver is waiting.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#plans">
                <Button
                  size="lg"
                  className="font-semibold rounded-full px-10 text-white"
                  style={{ background: GREEN }}
                  data-ocid="subscriptions.cta.primary_button"
                >
                  Get Started — Choose a Plan
                </Button>
              </a>
              <Link to="/drivers">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-semibold rounded-full px-8"
                  style={{ borderColor: GREEN_BORDER }}
                  data-ocid="subscriptions.cta.secondary_button"
                >
                  Browse Drivers First
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
