import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  Camera,
  CheckCircle,
  ChevronRight,
  CreditCard,
  FileText,
  Lock,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Chandigarh",
];

const LANGUAGES = [
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Others",
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  experience: string;
  languages: string[];
  price: string;
  about: string;
  aadhaar: File | null;
  pan: File | null;
  license: File | null;
  selfie: File | null;
}

const INITIAL: FormData = {
  name: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  experience: "",
  languages: [],
  price: "",
  about: "",
  aadhaar: null,
  pan: null,
  license: null,
  selfie: null,
};

const STEPS = [
  { label: "Personal Info", icon: User },
  { label: "Documents", icon: FileText },
  { label: "Payment", icon: CreditCard },
  { label: "Done", icon: CheckCircle },
];

function FileUploadBox({
  label,
  icon: Icon,
  file,
  onChange,
  accept,
  ocid,
}: {
  label: string;
  icon: React.ElementType;
  file: File | null;
  onChange: (f: File | null) => void;
  accept?: string;
  ocid: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const preview = file?.type.startsWith("image/")
    ? URL.createObjectURL(file)
    : null;

  return (
    <div className="space-y-2">
      <Label className="text-foreground text-sm font-medium">{label}</Label>
      <button
        type="button"
        className="relative w-full rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all duration-200 text-center"
        style={{
          borderColor: file
            ? "oklch(0.65 0.18 255 / 0.6)"
            : "oklch(0.28 0.04 255)",
          background: file ? "oklch(0.65 0.18 255 / 0.05)" : "oklch(1.0 0 0)",
        }}
        onClick={() => ref.current?.click()}
        data-ocid={ocid}
      >
        <input
          ref={ref}
          type="file"
          accept={accept ?? "image/*,application/pdf"}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "oklch(0.65 0.18 255 / 0.12)" }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: "oklch(0.65 0.18 255)" }}
            />
          </div>
        )}
        {file ? (
          <p className="text-sm text-foreground font-medium">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">
              Click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or PDF supported
            </p>
          </>
        )}
      </button>
    </div>
  );
}

export default function RegisterDriverPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [paying, setPaying] = useState(false);
  const [appId] = useState(
    () => `DRV-${Math.floor(1000 + Math.random() * 9000)}`,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof FormData, val: unknown) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleLang = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone))
      e.phone = "Enter a valid 10-digit Indian phone number";
    if (!form.email.trim() || !form.email.includes("@"))
      e.email = "Enter a valid email";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state) e.state = "State is required";
    if (!form.experience) e.experience = "Experience is required";
    if (form.languages.length === 0)
      e.languages = "Select at least one language";
    if (!form.price.trim() || Number.isNaN(Number(form.price)))
      e.price = "Enter a valid price";
    return e;
  };

  const validate2 = () => {
    const e: Record<string, string> = {};
    if (!form.aadhaar) e.aadhaar = "Aadhaar card is required";
    if (!form.pan) e.pan = "PAN card is required";
    if (!form.license) e.license = "Driving license is required";
    if (!form.selfie) e.selfie = "Selfie is required";
    return e;
  };

  const goNext = () => {
    if (step === 1) {
      const e = validate1();
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
    }
    if (step === 2) {
      const e = validate2();
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep(4);
      localStorage.setItem("driveease_driver_app", appId);
    }, 2000);
  };

  const cardStyle = {
    background: "oklch(0.94 0 0)",
    border: "1px solid oklch(0.22 0.03 255)",
    boxShadow:
      "0 0 0 1px oklch(0.22 0.03 255), 0 4px 24px oklch(0.65 0.18 255 / 0.06)",
  };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ background: "oklch(1.0 0 0)" }}
    >
      {/* Background orbs */}
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.18 255)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.72 0.16 75)" }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: "oklch(0.72 0.16 75 / 0.15)",
              color: "oklch(0.90 0.12 75)",
              border: "1px solid oklch(0.72 0.16 75 / 0.3)",
            }}
          >
            🚗 Join India's Largest Driver Network
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Register as a Driver
          </h1>
          <p className="text-muted-foreground">
            Complete the 4-step registration to start earning with DriveEase
          </p>
        </motion.div>

        {/* Stepper */}
        {step < 4 && (
          <div className="flex items-center mb-10">
            {STEPS.slice(0, 3).map((s, i) => {
              const num = i + 1;
              const active = step === num;
              const done = step > num;
              return (
                <div
                  key={s.label}
                  className="flex items-center flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                      style={{
                        background: done
                          ? "oklch(0.65 0.18 255)"
                          : active
                            ? "oklch(0.72 0.16 75)"
                            : "oklch(0.88 0 0)",
                        color:
                          done || active
                            ? "oklch(1.0 0 0)"
                            : "oklch(0.50 0.04 255)",
                        boxShadow: active
                          ? "0 0 12px oklch(0.72 0.16 75 / 0.5)"
                          : "none",
                      }}
                    >
                      {done ? "✓" : num}
                    </div>
                    <span
                      className="text-xs mt-1 font-medium"
                      style={{
                        color: active
                          ? "oklch(0.90 0.12 75)"
                          : "oklch(0.50 0.04 255)",
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className="flex-1 h-0.5 mx-2 mb-4 transition-all duration-500"
                      style={{
                        background: done
                          ? "oklch(0.65 0.18 255)"
                          : "oklch(0.22 0.03 255)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-8 space-y-6"
              style={cardStyle}
              data-ocid="register.panel"
            >
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <User
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.18 255)" }}
                />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-foreground">Full Name *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Rajesh Kumar"
                    data-ocid="register.name.input"
                  />
                  {errors.name && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground">Phone Number *</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    data-ocid="register.phone.input"
                  />
                  {errors.phone && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-foreground">Email Address *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="rajesh@example.com"
                    data-ocid="register.email.input"
                  />
                  {errors.email && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground">City *</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Mumbai"
                    data-ocid="register.city.input"
                  />
                  {errors.city && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.city}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground">State *</Label>
                  <Select
                    value={form.state}
                    onValueChange={(v) => set("state", v)}
                  >
                    <SelectTrigger data-ocid="register.state.select">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.state}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground">
                    Years of Experience *
                  </Label>
                  <Select
                    value={form.experience}
                    onValueChange={(v) => set("experience", v)}
                  >
                    <SelectTrigger data-ocid="register.experience.select">
                      <SelectValue placeholder="Select years" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "10",
                        "11",
                        "12",
                        "13",
                        "14",
                        "15",
                        "16",
                        "17",
                        "18",
                        "19",
                        "20+",
                      ].map((y) => (
                        <SelectItem key={y} value={y}>
                          {y} {y === "20+" ? "years" : "year(s)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.experience && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.experience}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-foreground">
                    Expected Price Per Hour (₹) *
                  </Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="250"
                    data-ocid="register.price.input"
                  />
                  {errors.price && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Languages Spoken *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {LANGUAGES.map((lang) => (
                    <div key={lang} className="flex items-center gap-2">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={form.languages.includes(lang)}
                        onCheckedChange={() => toggleLang(lang)}
                        data-ocid="register.lang.checkbox"
                      />
                      <Label
                        htmlFor={`lang-${lang}`}
                        className="text-sm text-foreground cursor-pointer"
                      >
                        {lang}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.languages && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.70 0.20 25)" }}
                  >
                    {errors.languages}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground">About Yourself</Label>
                <Textarea
                  value={form.about}
                  onChange={(e) => set("about", e.target.value)}
                  placeholder="Tell passengers about your driving experience, special skills, etc."
                  className="min-h-[100px]"
                  data-ocid="register.about.textarea"
                />
              </div>

              <Button
                onClick={goNext}
                className="w-full font-semibold"
                style={{ background: "oklch(0.65 0.18 255)", color: "white" }}
                data-ocid="register.step1.primary_button"
              >
                Continue to Documents <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-8 space-y-6"
              style={cardStyle}
              data-ocid="register.documents.panel"
            >
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <FileText
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.18 255)" }}
                />
                Document Verification
              </h2>

              <div
                className="rounded-xl p-4 text-sm"
                style={{
                  background: "oklch(0.65 0.18 255 / 0.08)",
                  border: "1px solid oklch(0.65 0.18 255 / 0.2)",
                  color: "oklch(0.75 0.10 255)",
                }}
              >
                📋 Documents will be verified within{" "}
                <strong>2-3 business days</strong>. Ensure all documents are
                clear and readable.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <FileUploadBox
                    label="Aadhaar Card (Front & Back) *"
                    icon={FileText}
                    file={form.aadhaar}
                    onChange={(f) => set("aadhaar", f)}
                    ocid="register.aadhaar.upload_button"
                  />
                  {errors.aadhaar && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.aadhaar}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <FileUploadBox
                    label="PAN Card *"
                    icon={CreditCard}
                    file={form.pan}
                    onChange={(f) => set("pan", f)}
                    ocid="register.pan.upload_button"
                  />
                  {errors.pan && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.pan}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <FileUploadBox
                    label="Driving License *"
                    icon={FileText}
                    file={form.license}
                    onChange={(f) => set("license", f)}
                    ocid="register.license.upload_button"
                  />
                  {errors.license && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.license}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <FileUploadBox
                    label="Selfie (Clear face photo) *"
                    icon={Camera}
                    file={form.selfie}
                    onChange={(f) => set("selfie", f)}
                    accept="image/*"
                    ocid="register.selfie.upload_button"
                  />
                  {errors.selfie && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.70 0.20 25)" }}
                    >
                      {errors.selfie}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  data-ocid="register.step2.cancel_button"
                >
                  Back
                </Button>
                <Button
                  onClick={goNext}
                  className="flex-1 font-semibold"
                  style={{ background: "oklch(0.65 0.18 255)", color: "white" }}
                  data-ocid="register.step2.primary_button"
                >
                  Continue to Payment <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-8 space-y-6"
              style={cardStyle}
              data-ocid="register.payment.panel"
            >
              <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <CreditCard
                  className="w-5 h-5"
                  style={{ color: "oklch(0.65 0.18 255)" }}
                />
                Registration Payment
              </h2>

              {/* Summary */}
              <div
                className="rounded-xl p-5 space-y-3"
                style={{
                  background: "oklch(1.0 0 0)",
                  border: "1px solid oklch(0.22 0.03 255)",
                }}
              >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Application Summary
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Name</span>
                  <span className="text-foreground font-medium">
                    {form.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="text-foreground font-medium">
                    {form.phone}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">City</span>
                  <span className="text-foreground font-medium">
                    {form.city}, {form.state}
                  </span>
                </div>
                <div
                  className="border-t pt-3 flex justify-between items-center"
                  style={{ borderColor: "oklch(0.22 0.03 255)" }}
                >
                  <span className="font-semibold text-foreground">
                    Registration Fee
                  </span>
                  <span
                    className="text-2xl font-display font-bold"
                    style={{ color: "oklch(0.72 0.16 75)" }}
                  >
                    ₹150
                  </span>
                </div>
              </div>

              {/* UPI QR placeholder */}
              <div
                className="rounded-xl p-6 text-center"
                style={{
                  background: "oklch(1.0 0 0)",
                  border: "1px solid oklch(0.22 0.03 255)",
                }}
              >
                <div
                  className="w-36 h-36 mx-auto rounded-xl mb-4"
                  style={{
                    background: `white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='10' y='10' width='30' height='30' fill='none' stroke='black' stroke-width='4'/%3E%3Crect x='15' y='15' width='20' height='20' fill='black'/%3E%3Crect x='60' y='10' width='30' height='30' fill='none' stroke='black' stroke-width='4'/%3E%3Crect x='65' y='15' width='20' height='20' fill='black'/%3E%3Crect x='10' y='60' width='30' height='30' fill='none' stroke='black' stroke-width='4'/%3E%3Crect x='15' y='65' width='20' height='20' fill='black'/%3E%3Crect x='45' y='10' width='8' height='8' fill='black'/%3E%3Crect x='45' y='25' width='8' height='8' fill='black'/%3E%3Crect x='60' y='45' width='8' height='8' fill='black'/%3E%3Crect x='75' y='45' width='8' height='8' fill='black'/%3E%3Crect x='45' y='60' width='8' height='8' fill='black'/%3E%3Crect x='60' y='60' width='8' height='8' fill='black'/%3E%3Crect x='75' y='75' width='8' height='8' fill='black'/%3E%3Crect x='45' y='75' width='8' height='8' fill='black'/%3E%3Crect x='60' y='75' width='8' height='8' fill='black'/%3E%3C/svg%3E") center / contain no-repeat`,
                    padding: "8px",
                  }}
                  aria-label="UPI QR code for payment"
                />
                <p className="text-sm font-semibold text-foreground">
                  Scan to Pay ₹150 via UPI
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  driveease@upi
                </p>
              </div>

              <div
                className="rounded-xl p-4 flex items-center gap-3"
                style={{
                  background: "oklch(0.95 0.05 145)",
                  border: "1px solid oklch(0.40 0.10 160 / 0.3)",
                }}
              >
                <Lock
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "oklch(0.70 0.14 160)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.75 0.10 160)" }}
                >
                  100% secure payment. Registration fee of ₹150 is
                  non-refundable.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                  disabled={paying}
                  data-ocid="register.step3.cancel_button"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePay}
                  disabled={paying}
                  className="flex-1 font-bold text-base"
                  style={{
                    background: "oklch(0.72 0.16 75)",
                    color: "oklch(1.0 0 0)",
                    boxShadow: paying
                      ? "none"
                      : "0 0 20px oklch(0.72 0.16 75 / 0.4)",
                  }}
                  data-ocid="register.pay.primary_button"
                >
                  {paying ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin inline-block"
                        aria-hidden="true"
                      />
                      Processing...
                    </span>
                  ) : (
                    "Pay ₹150 & Register"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="rounded-2xl p-10 text-center space-y-6"
              style={cardStyle}
              data-ocid="register.success_state"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                style={{
                  background: "oklch(0.92 0.05 145)",
                  border: "3px solid oklch(0.60 0.16 160)",
                  boxShadow: "0 0 40px oklch(0.60 0.16 160 / 0.4)",
                }}
              >
                <CheckCircle
                  className="w-12 h-12"
                  style={{ color: "oklch(0.70 0.16 160)" }}
                />
              </motion.div>

              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Application Submitted Successfully!
                </h2>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono font-bold my-3"
                  style={{
                    background: "oklch(0.65 0.18 255 / 0.12)",
                    border: "1px solid oklch(0.65 0.18 255 / 0.3)",
                    color: "oklch(0.75 0.15 255)",
                  }}
                >
                  Application ID: {appId}
                </div>
              </div>

              <div
                className="rounded-xl p-5 text-left space-y-3"
                style={{
                  background: "oklch(1.0 0 0)",
                  border: "1px solid oklch(0.22 0.03 255)",
                }}
              >
                <p className="text-sm text-foreground flex items-start gap-2">
                  <span style={{ color: "oklch(0.72 0.16 75)" }}>✓</span>
                  Our team will verify your documents within{" "}
                  <strong>2-3 business days</strong>.
                </p>
                <p className="text-sm text-foreground flex items-start gap-2">
                  <span style={{ color: "oklch(0.72 0.16 75)" }}>✓</span>
                  You will receive an <strong>SMS/call</strong> on your
                  registered phone number <strong>{form.phone}</strong>.
                </p>
                <p className="text-sm text-foreground flex items-start gap-2">
                  <span style={{ color: "oklch(0.72 0.16 75)" }}>✓</span>
                  Once approved, your profile will appear on DriveEase for
                  customers to book.
                </p>
              </div>

              <div className="flex gap-3 flex-col sm:flex-row">
                <Link to="/" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full"
                    data-ocid="register.home.secondary_button"
                  >
                    Back to Home
                  </Button>
                </Link>
                <Link to="/drivers" className="flex-1">
                  <Button
                    className="w-full font-semibold"
                    style={{
                      background: "oklch(0.65 0.18 255)",
                      color: "white",
                    }}
                    data-ocid="register.drivers.primary_button"
                  >
                    Browse Drivers
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
