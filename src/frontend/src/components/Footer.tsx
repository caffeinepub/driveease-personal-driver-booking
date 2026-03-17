import { Link } from "@tanstack/react-router";
import { Car } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer
      className="border-t mt-auto"
      style={{
        background: "oklch(0.06 0 0)",
        borderColor: "oklch(0.14 0 0)",
      }}
    >
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-lg mb-3 text-foreground">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: "oklch(0.72 0.22 145)" }}
              >
                <Car className="w-4 h-4" style={{ color: "oklch(0.06 0 0)" }} />
              </div>
              DriveEase
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting you with verified professional drivers across India.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/drivers"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Book a Driver
                </Link>
              </li>
              <li>
                <Link
                  to="/register-driver"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Register as Driver
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Track Booking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">
              Why DriveEase
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                ✓ Pan-India Coverage
              </li>
              <li className="text-sm text-muted-foreground">
                ✓ Aadhaar-Verified Drivers
              </li>
              <li className="text-sm text-muted-foreground">
                ✓ Best Competitive Prices
              </li>
              <li className="text-sm text-muted-foreground">✓ 24/7 Support</li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "oklch(0.14 0 0)" }}
        >
          <p className="text-sm text-muted-foreground">
            © {year} DriveEase. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            Trusted by 10,000+ customers across India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
