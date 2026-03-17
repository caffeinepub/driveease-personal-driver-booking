import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import DriverCard from "../components/DriverCard";
import { useAvailableDrivers, useSeedDrivers } from "../hooks/useQueries";
import { extractDriverLocation } from "../utils/driverLocation";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];
const SEED_VERSION = "v6";

export default function DriversPage() {
  const { data: drivers, isLoading } = useAvailableDrivers();
  const seedMutation = useSeedDrivers();
  const [sort, setSort] = useState("default");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    const alreadySeeded = localStorage.getItem("driveease_seeded");
    if (alreadySeeded !== SEED_VERSION) {
      seeded.current = true;
      localStorage.removeItem("driveease_seeded");
      seedMutation.mutate(undefined, {
        onSuccess: () => {
          localStorage.setItem("driveease_seeded", SEED_VERSION);
        },
      });
    }
  }, [seedMutation.mutate]);

  const driversWithLocation = useMemo(() => {
    return (drivers ?? []).map((d) => ({
      ...d,
      _location: extractDriverLocation(`${d.name} ${d.description}`),
    }));
  }, [drivers]);

  const uniqueStates = useMemo(() => {
    return [...new Set(driversWithLocation.map((d) => d._location.state))]
      .filter((s) => s !== "Other")
      .sort();
  }, [driversWithLocation]);

  const filteredCities = useMemo(() => {
    const source =
      stateFilter !== "all"
        ? driversWithLocation.filter((d) => d._location.state === stateFilter)
        : driversWithLocation;
    return [...new Set(source.map((d) => d._location.city))]
      .filter((c) => c !== "Other")
      .sort();
  }, [driversWithLocation, stateFilter]);

  const handleStateChange = (value: string) => {
    setStateFilter(value);
    setCityFilter("all");
  };

  const filtered = driversWithLocation.filter((d) => {
    const matchesName = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesState =
      stateFilter === "all" || d._location.state === stateFilter;
    const matchesCity = cityFilter === "all" || d._location.city === cityFilter;
    return matchesName && matchesState && matchesCity;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "low") return Number(a.pricePerHour - b.pricePerHour);
    if (sort === "high") return Number(b.pricePerHour - a.pricePerHour);
    return Number(b.rating - a.rating);
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
              Professional Drivers Across India
            </h1>
            <p className="text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `${sorted.length} driver${sorted.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-44"
                data-ocid="drivers.search_input"
              />
            </div>

            {/* State Filter */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Select value={stateFilter} onValueChange={handleStateChange}>
                <SelectTrigger
                  className="w-44"
                  data-ocid="drivers.state.select"
                >
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Filter */}
            <Select
              value={cityFilter}
              onValueChange={setCityFilter}
              disabled={stateFilter === "all"}
            >
              <SelectTrigger className="w-40" data-ocid="drivers.city.select">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {filteredCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <div className="flex items-center gap-1.5 ml-auto">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-44" data-ocid="drivers.select">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Best Rating</SelectItem>
                  <SelectItem value="low">Price: Low to High</SelectItem>
                  <SelectItem value="high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="drivers.loading_state"
          >
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24" data-ocid="drivers.empty_state">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground text-lg">
              No drivers found for the selected region.
            </p>
            <button
              type="button"
              onClick={() => {
                setStateFilter("all");
                setCityFilter("all");
                setSearch("");
              }}
              className="mt-4 text-sm text-primary underline hover:no-underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="drivers.list"
          >
            {sorted.map((driver, i) => (
              <motion.div
                key={driver.id.toString()}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <DriverCard driver={driver} index={i + 1} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
