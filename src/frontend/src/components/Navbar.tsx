import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Car, Menu, X } from "lucide-react";
import { useState } from "react";

function PulseDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: "oklch(0.72 0.22 145)" }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ background: "oklch(0.72 0.22 145)" }}
      />
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "oklch(0.06 0 0)",
        borderColor: "oklch(0.14 0 0)",
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-xl text-foreground"
          data-ocid="nav.home.link"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.72 0.22 145)" }}
          >
            <Car className="w-4 h-4" style={{ color: "oklch(0.06 0 0)" }} />
          </div>
          DriveEase
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.home.link"
          >
            Home
          </Link>
          <Link
            to="/drivers"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.drivers.link"
          >
            Drivers
          </Link>
          <Link
            to="/live"
            className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.live.link"
          >
            <PulseDot />
            Live
          </Link>
          <Link
            to="/track"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="nav.track.link"
          >
            Track Booking
          </Link>
          <Link to="/register-driver" data-ocid="nav.register.link">
            <Button
              size="sm"
              variant="outline"
              className="font-semibold"
              style={{
                borderColor: "oklch(0.72 0.22 145)",
                color: "oklch(0.72 0.22 145)",
                background: "transparent",
              }}
            >
              Register as Driver
            </Button>
          </Link>
          <Link to="/drivers">
            <Button
              size="sm"
              className="font-semibold rounded-full px-5"
              style={{
                background: "oklch(0.72 0.22 145)",
                color: "oklch(0.06 0 0)",
              }}
              data-ocid="nav.book.primary_button"
            >
              Book a Driver
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div
          className="md:hidden border-t px-4 py-4 flex flex-col gap-4"
          style={{
            background: "oklch(0.08 0 0)",
            borderColor: "oklch(0.14 0 0)",
          }}
        >
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-foreground"
            data-ocid="nav.home.link"
          >
            Home
          </Link>
          <Link
            to="/drivers"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-foreground"
            data-ocid="nav.drivers.link"
          >
            Drivers
          </Link>
          <Link
            to="/live"
            onClick={() => setOpen(false)}
            className="text-sm font-medium flex items-center gap-1.5 text-foreground"
            data-ocid="nav.live.link"
          >
            <PulseDot />
            Live Drivers
          </Link>
          <Link
            to="/track"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-foreground"
            data-ocid="nav.track.link"
          >
            Track Booking
          </Link>
          <Link
            to="/register-driver"
            onClick={() => setOpen(false)}
            data-ocid="nav.register.link"
          >
            <Button
              size="sm"
              className="w-full font-semibold rounded-full"
              style={{
                background: "oklch(0.72 0.22 145)",
                color: "oklch(0.06 0 0)",
              }}
            >
              Register as Driver
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
