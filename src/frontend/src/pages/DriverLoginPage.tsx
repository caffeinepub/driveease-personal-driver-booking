import type { DriverRegistration } from "@/backend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function DriverLoginPage() {
  const { actor } = useActor();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DriverRegistration | null | undefined>(
    undefined,
  );
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (!actor) throw new Error("Not connected");
      const reg = await actor.getDriverRegistrationByPhone(phone);
      setResult(reg);
    } catch (e) {
      console.error(e);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{ background: "oklch(0.98 0.005 145)" }}
    >
      {/* Decorative orbs */}
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.50 0.18 145)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.72 0.16 75)" }}
      />

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: "oklch(0.50 0.18 145 / 0.1)",
              color: "oklch(0.40 0.18 145)",
              border: "1px solid oklch(0.50 0.18 145 / 0.3)",
            }}
          >
            🚗 Driver Status Check
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Check Your Application
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your registered mobile number to check your driver
            registration status
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-md border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Registration Status Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone-input">Mobile Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 rounded-md border text-sm text-muted-foreground bg-muted">
                    +91
                  </div>
                  <Input
                    id="phone-input"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                      setError("");
                      setResult(undefined);
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1"
                    data-ocid="driver_login.phone.input"
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  />
                </div>
                {error && (
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.60 0.20 25)" }}
                  >
                    {error}
                  </p>
                )}
              </div>

              <Button
                onClick={handleCheck}
                disabled={loading || !phone}
                className="w-full font-semibold"
                style={{
                  background: "oklch(0.50 0.18 145)",
                  color: "white",
                }}
                data-ocid="driver_login.check.primary_button"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Checking...
                  </span>
                ) : (
                  "Check Status"
                )}
              </Button>

              {/* Results */}
              {result === null && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: "oklch(0.95 0.01 0)",
                    border: "1px solid oklch(0.85 0.02 0)",
                  }}
                  data-ocid="driver_login.error_state"
                >
                  <p className="text-sm text-muted-foreground">
                    No registration found for this number. Please{" "}
                    <a
                      href="/register-driver"
                      className="font-semibold underline"
                      style={{ color: "oklch(0.50 0.18 145)" }}
                    >
                      register here
                    </a>
                    .
                  </p>
                </motion.div>
              )}

              {result && result.status === "pending" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-5 space-y-3"
                  style={{
                    background: "oklch(0.98 0.04 90)",
                    border: "1px solid oklch(0.82 0.10 90 / 0.5)",
                  }}
                  data-ocid="driver_login.loading_state"
                >
                  <div className="flex items-center gap-3">
                    <Clock
                      className="w-6 h-6 flex-shrink-0"
                      style={{ color: "oklch(0.60 0.18 75)" }}
                    />
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "oklch(0.45 0.16 75)" }}
                      >
                        Profile Under Verification
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(0.55 0.12 75)" }}
                      >
                        Your profile is under verification. Please wait for
                        admin approval (2–3 business days).
                      </p>
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3 text-xs space-y-1.5"
                    style={{ background: "oklch(0.94 0.03 90 / 0.8)" }}
                  >
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-foreground">
                        {result.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City</span>
                      <span className="font-medium text-foreground">
                        {result.city}, {result.state}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Application ID
                      </span>
                      <span
                        className="font-mono font-semibold"
                        style={{ color: "oklch(0.55 0.18 220)" }}
                      >
                        {result.applicationId}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {result && result.status === "approved" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-5 space-y-3"
                  style={{
                    background: "oklch(0.97 0.04 145)",
                    border: "1px solid oklch(0.60 0.16 145 / 0.4)",
                  }}
                  data-ocid="driver_login.success_state"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className="w-6 h-6 flex-shrink-0"
                      style={{ color: "oklch(0.50 0.18 145)" }}
                    />
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "oklch(0.35 0.15 145)" }}
                      >
                        Profile Approved!
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(0.45 0.12 145)" }}
                      >
                        Your profile has been approved! You can now start
                        accepting bookings.
                      </p>
                    </div>
                  </div>
                  <div
                    className="rounded-lg p-3 text-xs space-y-1.5"
                    style={{ background: "oklch(0.94 0.03 145 / 0.6)" }}
                  >
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-foreground">
                        {result.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City</span>
                      <span className="font-medium text-foreground">
                        {result.city}, {result.state}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Application ID
                      </span>
                      <span
                        className="font-mono font-semibold"
                        style={{ color: "oklch(0.50 0.18 145)" }}
                      >
                        {result.applicationId}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {result && result.status === "rejected" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-5 space-y-3"
                  style={{
                    background: "oklch(0.98 0.03 25)",
                    border: "1px solid oklch(0.75 0.15 25 / 0.4)",
                  }}
                  data-ocid="driver_login.error_state"
                >
                  <div className="flex items-center gap-3">
                    <XCircle
                      className="w-6 h-6 flex-shrink-0"
                      style={{ color: "oklch(0.60 0.20 25)" }}
                    />
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: "oklch(0.45 0.18 25)" }}
                      >
                        Registration Not Approved
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(0.55 0.12 25)" }}
                      >
                        Your registration was not approved. Please contact
                        support.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Not registered yet?{" "}
          <a
            href="/register-driver"
            className="font-semibold underline"
            style={{ color: "oklch(0.50 0.18 145)" }}
          >
            Register as a Driver
          </a>
        </p>
      </div>
    </div>
  );
}
