import { Locate, MapPin, Search, X } from "lucide-react";
import { useRef, useState } from "react";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (address: string, lat: number, lng: number) => void;
  markerColor: "green" | "red";
  showMyLocation?: boolean;
  ocidMap: string;
  ocidSearch: string;
}

export default function LocationPicker({
  label,
  value,
  onChange,
  markerColor,
  showMyLocation,
  ocidMap,
  ocidSearch,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in`,
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const selectResult = (r: NominatimResult) => {
    const lat = Number.parseFloat(r.lat);
    const lng = Number.parseFloat(r.lon);
    onChange(r.display_name, lat, lng);
    setSearchQuery("");
    setResults([]);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          );
          const data = await res.json();
          onChange(
            data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            lat,
            lng,
          );
        } catch {
          onChange(`${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng);
        }
        setIsLocating(false);
      },
      () => setIsLocating(false),
    );
  };

  const accentColor =
    markerColor === "green" ? "oklch(0.72 0.22 145)" : "oklch(0.60 0.22 25)";

  return (
    <div className="space-y-2" data-ocid={ocidMap}>
      <div className="flex items-center gap-1.5 text-sm font-medium">
        <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
        <span>{label}</span>
      </div>

      {/* Selected address display */}
      {value && (
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground border"
          style={{
            background: "oklch(0.10 0 0)",
            borderColor: "oklch(0.18 0 0)",
          }}
        >
          <MapPin
            className="w-3 h-3 mt-0.5 shrink-0"
            style={{ color: accentColor }}
          />
          <span className="line-clamp-2">{value}</span>
          <button
            type="button"
            onClick={() => onChange("", 0, 0)}
            className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Search box */}
      <div className="relative flex gap-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1"
            style={{
              background: "oklch(0.10 0 0)",
              borderColor: "oklch(0.18 0 0)",
            }}
            data-ocid={ocidSearch}
          />
          {/* Dropdown */}
          {(results.length > 0 || isSearching) && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl max-h-48 overflow-y-auto z-50"
              style={{
                background: "oklch(0.10 0 0)",
                borderColor: "oklch(0.18 0 0)",
              }}
            >
              {isSearching ? (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Searching...
                </div>
              ) : (
                results.map((r) => (
                  <button
                    key={r.place_id}
                    type="button"
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 text-foreground border-b last:border-0 truncate"
                    style={{ borderColor: "oklch(0.14 0 0)" }}
                  >
                    {r.display_name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {showMyLocation && (
          <button
            type="button"
            onClick={handleMyLocation}
            disabled={isLocating}
            title="Use my location"
            className="px-2.5 py-2 rounded-lg border text-foreground hover:bg-white/5 disabled:opacity-50 transition-colors"
            style={{
              background: "oklch(0.10 0 0)",
              borderColor: "oklch(0.18 0 0)",
            }}
            data-ocid="booking.my_location_button"
          >
            <Locate
              className={`w-4 h-4 ${isLocating ? "animate-pulse" : ""}`}
              style={{ color: isLocating ? accentColor : undefined }}
            />
          </button>
        )}
      </div>

      {/* Map placeholder with Google Maps embed hint */}
      <div
        className="rounded-xl overflow-hidden border flex items-center justify-center"
        style={{
          height: 200,
          background: "oklch(0.08 0 0)",
          borderColor: "oklch(0.18 0 0)",
        }}
      >
        <div className="text-center text-sm text-muted-foreground">
          <MapPin
            className="w-6 h-6 mx-auto mb-2"
            style={{ color: accentColor }}
          />
          <p>Search above to set {label.toLowerCase()}</p>
          {value && (
            <p
              className="mt-1 text-xs px-4 line-clamp-2"
              style={{ color: accentColor }}
            >
              {value}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
