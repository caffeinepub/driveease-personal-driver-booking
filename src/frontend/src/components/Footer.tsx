import { Link } from "@tanstack/react-router";
import { Car, Mail, Phone } from "lucide-react";

const GREEN = "oklch(0.50 0.18 145)";
const GREEN_LIGHT = "oklch(0.75 0.12 145)";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      style={{
        background: "oklch(0.10 0.03 145)",
        color: "oklch(0.88 0.04 145)",
      }}
    >
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-display font-bold text-xl mb-4 text-white">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: GREEN }}
              >
                <Car className="w-4 h-4 text-white" />
              </div>
              DriveEase
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.65 0.05 145)" }}
            >
              India's First Personal Driver Network. Safe, verified, and trusted
              drivers for every family.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-bold text-sm uppercase tracking-wider mb-4"
              style={{ color: GREEN_LIGHT }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "Book Driver", to: "/drivers" },
                { label: "Register Driver", to: "/register-driver" },
                { label: "Track Booking", to: "/track" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "oklch(0.65 0.05 145)" }}
                    data-ocid={`footer.${link.label.toLowerCase().replace(" ", "_")}.link`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className="font-bold text-sm uppercase tracking-wider mb-4"
              style={{ color: GREEN_LIGHT }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              {[
                "Subscription Plans",
                "Family Account",
                "Live Tracking",
                "Driver Insurance",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm"
                  style={{ color: "oklch(0.65 0.05 145)" }}
                >
                  ✓ {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-bold text-sm uppercase tracking-wider mb-4"
              style={{ color: GREEN_LIGHT }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                  style={{ color: "oklch(0.65 0.05 145)" }}
                >
                  <Phone
                    className="w-4 h-4 shrink-0"
                    style={{ color: GREEN_LIGHT }}
                  />
                  +91-9876543210
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@driveease.in"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                  style={{ color: "oklch(0.65 0.05 145)" }}
                >
                  <Mail
                    className="w-4 h-4 shrink-0"
                    style={{ color: GREEN_LIGHT }}
                  />
                  support@driveease.in
                </a>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["✓ Pan-India", "✓ Aadhaar Verified", "✓ 24/7 Support"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: "oklch(0.50 0.18 145 / 0.20)",
                      color: GREEN_LIGHT,
                      border: "1px solid oklch(0.50 0.18 145 / 0.35)",
                    }}
                  >
                    {badge}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "oklch(0.22 0.05 145)" }}
        >
          <p className="text-sm" style={{ color: "oklch(0.50 0.04 145)" }}>
            © {year} DriveEase. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors hover:text-white"
            style={{ color: "oklch(0.45 0.04 145)" }}
          >
            Built with ❤️ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
