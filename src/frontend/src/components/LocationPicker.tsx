import {
  Bookmark,
  BookmarkCheck,
  Locate,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface SavedAddress {
  label: string;
  address: string;
  lat: number;
  lng: number;
  type: "pickup" | "dropoff";
}

interface LocationPickerProps {
  label: string;
  value: string;
  onChange: (address: string, lat: number, lng: number) => void;
  markerColor: "green" | "red";
  showMyLocation?: boolean;
  ocidMap: string;
  ocidSearch: string;
  locationType?: "pickup" | "dropoff";
}

const STORAGE_KEY = "driveease_saved_addresses";

function loadSaved(): SavedAddress[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function storeSaved(addresses: SavedAddress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

export default function LocationPicker({
  label,
  value,
  onChange,
  markerColor,
  showMyLocation,
  ocidMap,
  ocidSearch,
  locationType = "pickup",
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [savedAddresses, setSavedAddresses] =
    useState<SavedAddress[]>(loadSaved);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveLabel, setSaveLabel] = useState("");
  const [currentLatLng, setCurrentLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep currentLatLng in sync when value changes from outside
  useEffect(() => {
    if (!value) {
      setCurrentLatLng(null);
      setShowSaveForm(false);
    }
  }, [value]);

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
    setCurrentLatLng({ lat, lng });
    onChange(r.display_name, lat, lng);
    setSearchQuery("");
    setResults([]);
    setShowSaveForm(false);
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
          const addr =
            data.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setCurrentLatLng({ lat, lng });
          onChange(addr, lat, lng);
        } catch {
          setCurrentLatLng({ lat, lng });
          onChange(`${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng);
        }
        setIsLocating(false);
      },
      () => setIsLocating(false),
    );
  };

  const handleSaveAddress = () => {
    if (!saveLabel.trim() || !value || !currentLatLng) return;
    const newEntry: SavedAddress = {
      label: saveLabel.trim(),
      address: value,
      lat: currentLatLng.lat,
      lng: currentLatLng.lng,
      type: locationType,
    };
    const updated = [...savedAddresses, newEntry];
    setSavedAddresses(updated);
    storeSaved(updated);
    setSaveLabel("");
    setShowSaveForm(false);
  };

  const handleDeleteSaved = (index: number) => {
    const updated = savedAddresses.filter((_, i) => i !== index);
    setSavedAddresses(updated);
    storeSaved(updated);
  };

  const isAlreadySaved =
    value && savedAddresses.some((s) => s.address === value);
  const accentGreen = "#16a34a";
  const accentColor = markerColor === "green" ? accentGreen : "#dc2626";

  // Only show chips relevant to this picker type
  const relevantSaved = savedAddresses.filter((s) => s.type === locationType);

  return (
    <div className="space-y-3" data-ocid={ocidMap}>
      {/* Label */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
        <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
        <span>{label}</span>
      </div>

      {/* Saved address chips */}
      {relevantSaved.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {relevantSaved.map((s, i) => (
            <div
              key={`saved-${s.label}-${s.address.substring(0, 20)}`}
              className="flex items-center gap-1 pl-2 pr-1 py-1 rounded-full text-xs font-medium border border-gray-200 bg-white shadow-sm group"
              style={{ color: "#374151" }}
            >
              <MapPin
                className="w-3 h-3 shrink-0"
                style={{ color: accentGreen }}
              />
              <button
                type="button"
                onClick={() => {
                  setCurrentLatLng({ lat: s.lat, lng: s.lng });
                  onChange(s.address, s.lat, s.lng);
                }}
                className="hover:text-green-700 transition-colors max-w-[80px] truncate"
                title={s.address}
                data-ocid={`location.saved.button.${i + 1}`}
              >
                {s.label}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSaved(i)}
                className="ml-0.5 p-0.5 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors text-gray-400"
                title="Remove saved address"
                data-ocid={`location.saved.delete_button.${i + 1}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search box */}
      <div className="relative flex gap-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search ${label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-transparent shadow-sm transition-shadow"
            style={{ "--tw-ring-color": "#16a34a" } as React.CSSProperties}
            data-ocid={ocidSearch}
          />
          {/* Dropdown results */}
          {(results.length > 0 || isSearching) && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto z-50">
              {isSearching ? (
                <div className="px-3 py-3 text-xs text-gray-400 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                  Searching...
                </div>
              ) : (
                results.map((r) => (
                  <button
                    key={r.place_id}
                    type="button"
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-start gap-2 transition-colors"
                  >
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-gray-400" />
                    <span className="truncate">{r.display_name}</span>
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
            className="px-2.5 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-green-700 disabled:opacity-50 transition-colors shadow-sm"
            data-ocid="booking.my_location_button"
          >
            <Locate
              className={`w-4 h-4 ${isLocating ? "animate-pulse" : ""}`}
              style={{ color: isLocating ? accentGreen : undefined }}
            />
          </button>
        )}
      </div>

      {/* Selected address display */}
      {value && (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-start gap-2 px-3 py-2.5">
            <MapPin
              className="w-3.5 h-3.5 mt-0.5 shrink-0"
              style={{ color: accentColor }}
            />
            <span className="text-xs text-gray-700 line-clamp-2 flex-1 leading-relaxed">
              {value}
            </span>
            <div className="flex items-center gap-1 ml-auto shrink-0">
              {!isAlreadySaved && (
                <button
                  type="button"
                  onClick={() => setShowSaveForm(!showSaveForm)}
                  title="Save this address"
                  className="p-1 rounded hover:bg-green-50 transition-colors"
                  style={{ color: showSaveForm ? accentGreen : "#9ca3af" }}
                  data-ocid="location.save.button"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>
              )}
              {isAlreadySaved && (
                <span title="Address saved" style={{ color: accentGreen }}>
                  <BookmarkCheck className="w-3.5 h-3.5" />
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  onChange("", 0, 0);
                  setShowSaveForm(false);
                }}
                className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                data-ocid="location.clear.button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Inline save form */}
          {showSaveForm && (
            <div className="border-t border-gray-100 px-3 py-2.5 bg-green-50">
              <p className="text-xs font-medium text-green-800 mb-2">
                Save this address
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Home, Work, Office"
                  value={saveLabel}
                  onChange={(e) => setSaveLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveAddress()}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-md border border-green-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500"
                  data-ocid="location.save.input"
                />
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={!saveLabel.trim()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md text-white disabled:opacity-40 transition-colors"
                  style={{ background: accentGreen }}
                  data-ocid="location.save.submit_button"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSaveForm(false);
                    setSaveLabel("");
                  }}
                  className="px-2 py-1.5 text-xs rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                  data-ocid="location.save.cancel_button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Map placeholder */}
      <div
        className="rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50"
        style={{ height: 180 }}
      >
        <div className="text-center text-sm">
          <MapPin
            className="w-6 h-6 mx-auto mb-2"
            style={{ color: accentColor }}
          />
          {value ? (
            <p className="text-xs text-gray-500 px-4 line-clamp-2">
              📍 {value.split(",").slice(0, 2).join(",")}
            </p>
          ) : (
            <p className="text-gray-400 text-xs">
              Search above to set {label.toLowerCase()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
