import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CustomerProfile } from "../backend.d";
import { useActor } from "../hooks/useActor";

const GREEN = "oklch(0.50 0.18 145)";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (profile: CustomerProfile) => void;
}

export default function CustomerLoginModal({
  open,
  onOpenChange,
  onLoginSuccess,
}: Props) {
  const { actor } = useActor();
  const [mobileForm, setMobileForm] = useState({ name: "", mobile: "" });
  const [emailForm, setEmailForm] = useState({ name: "", email: "" });
  const [loadingMobile, setLoadingMobile] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMobileError("");
    if (!mobileForm.name.trim()) {
      setMobileError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobileForm.mobile.trim())) {
      setMobileError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!actor) {
      setMobileError("Service not ready. Please try again.");
      return;
    }
    setLoadingMobile(true);
    try {
      const profile = await (actor as any).registerOrLoginByMobile(
        mobileForm.name.trim(),
        mobileForm.mobile.trim(),
      );
      localStorage.setItem("driveease_customer", JSON.stringify(profile));
      toast.success(`Welcome, ${profile.name}! You're now logged in.`);
      onLoginSuccess(profile);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setMobileError("Something went wrong. Please try again.");
    } finally {
      setLoadingMobile(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    if (!emailForm.name.trim()) {
      setEmailError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (!actor) {
      setEmailError("Service not ready. Please try again.");
      return;
    }
    setLoadingEmail(true);
    try {
      const profile = await (actor as any).registerOrLoginByEmail(
        emailForm.name.trim(),
        emailForm.email.trim(),
      );
      localStorage.setItem("driveease_customer", JSON.stringify(profile));
      toast.success(`Welcome, ${profile.name}! You're now logged in.`);
      onLoginSuccess(profile);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md rounded-2xl"
        data-ocid="customer.login.modal"
      >
        <DialogHeader>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
            style={{ background: GREEN }}
          >
            <Phone className="w-5 h-5 text-white" />
          </div>
          <DialogTitle className="text-xl font-display font-bold">
            Customer Login / Register
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Sign in or create your DriveEase account in seconds.
          </p>
        </DialogHeader>

        <Tabs defaultValue="mobile" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger
              value="mobile"
              className="flex-1 gap-1.5"
              data-ocid="customer.login.tab"
            >
              <Phone className="w-3.5 h-3.5" /> Mobile Number
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="flex-1 gap-1.5"
              data-ocid="customer.login.tab"
            >
              <Mail className="w-3.5 h-3.5" /> Email ID
            </TabsTrigger>
          </TabsList>

          {/* Mobile Tab */}
          <TabsContent value="mobile">
            <form
              onSubmit={handleMobileSubmit}
              className="flex flex-col gap-4 pt-3"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mobile-name">Your Name</Label>
                <Input
                  id="mobile-name"
                  placeholder="e.g. Rahul Sharma"
                  value={mobileForm.name}
                  onChange={(e) =>
                    setMobileForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="customer.login.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mobile-number">Mobile Number</Label>
                <div className="flex">
                  <span
                    className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm font-medium"
                    style={{ color: GREEN }}
                  >
                    +91
                  </span>
                  <Input
                    id="mobile-number"
                    className="rounded-l-none"
                    placeholder="9876543210"
                    maxLength={10}
                    value={mobileForm.mobile}
                    onChange={(e) =>
                      setMobileForm((p) => ({
                        ...p,
                        mobile: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    data-ocid="customer.login.input"
                  />
                </div>
              </div>
              {mobileError && (
                <p
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.55 0.22 25)" }}
                  data-ocid="customer.login.error_state"
                >
                  {mobileError}
                </p>
              )}
              <Button
                type="submit"
                disabled={loadingMobile}
                className="w-full rounded-full font-semibold text-white"
                style={{ background: GREEN }}
                data-ocid="customer.login.submit_button"
              >
                {loadingMobile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email">
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col gap-4 pt-3"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email-name">Your Name</Label>
                <Input
                  id="email-name"
                  placeholder="e.g. Priya Patel"
                  value={emailForm.name}
                  onChange={(e) =>
                    setEmailForm((p) => ({ ...p, name: e.target.value }))
                  }
                  data-ocid="customer.login.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email-address">Email ID</Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="e.g. priya@gmail.com"
                  value={emailForm.email}
                  onChange={(e) =>
                    setEmailForm((p) => ({ ...p, email: e.target.value }))
                  }
                  data-ocid="customer.login.input"
                />
              </div>
              {emailError && (
                <p
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.55 0.22 25)" }}
                  data-ocid="customer.login.error_state"
                >
                  {emailError}
                </p>
              )}
              <Button
                type="submit"
                disabled={loadingEmail}
                className="w-full rounded-full font-semibold text-white"
                style={{ background: GREEN }}
                data-ocid="customer.login.submit_button"
              >
                {loadingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center mt-2">
          New? We'll create your free account automatically.
        </p>
      </DialogContent>
    </Dialog>
  );
}
