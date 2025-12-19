import { CommunityCard, CommunityCardProps } from "@/components/community-card";
import { Footer } from "@/components/footer";
import { CommunityTable } from "@/components/community-table";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  X,
  MapPin,
  Users,
  Compass,
  LayoutGrid,
  Grid3X3,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const indianStates = [
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
];

const communityLevels = [
  { label: "City Level", value: "city" },
  { label: "State Level", value: "state" },
  { label: "National Level", value: "national" },
  { label: "International Level", value: "international" },
];

const fetchCommunities = async (filters: {
  q: string;
  domain: string;
  zone: string;
  state: string;
  city: string;
  level: string;
}) => {
  const params = new URLSearchParams();
  if (filters.q) params.append("q", filters.q);
  if (filters.domain) params.append("domain", filters.domain);
  if (filters.zone) params.append("zone", filters.zone);
  if (filters.state) params.append("state", filters.state);
  if (filters.city) params.append("city", filters.city);
  if (filters.level) params.append("level", filters.level);

  // Use /search endpoint for text search, /filter-search for filter-based search
  const endpoint =
    filters.q &&
    !filters.domain &&
    !filters.zone &&
    !filters.state &&
    !filters.city &&
    !filters.level
      ? "search"
      : "filter-search";

  const response = await fetch(
    `https://indian-community-beta.vercel.app/api/communities/${endpoint}?${params}`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchFilterData = async (endpoint: string, query = "") => {
  try {
    const response = await fetch(
      `https://indian-community-beta.vercel.app/api/${endpoint}${query}`
    );
    if (!response.ok) {
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}`, error);
    return [];
  }
};

const CommunityCardSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-5">
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex justify-between pt-3 border-t border-border/50">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </CardContent>
  </Card>
);

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [zone, setZone] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [level, setLevel] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [communities, setCommunities] = useState<CommunityCardProps[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Fetch Filters
  useEffect(() => {
    const loadFilters = async () => {
      const domainsData = await fetchFilterData("domains");
      setDomains(domainsData || []);
      const zonesData = await fetchFilterData("zones");
      setZones(zonesData || []);
    };
    loadFilters();
  }, []);

  // Fetch Communities
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCommunities({
          q: debouncedSearchQuery,
          domain,
          zone,
          state,
          city,
          level,
        });
        setCommunities(data || []);
      } catch (error) {
        console.error("Failed to fetch communities", error);
        setCommunities([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearchQuery, domain, zone, state, city, level]);

  const handleSearch = () => {
    // Search is reactive to searchQuery state
  };

  const filteredCommunities = communities;

  const mockCities = state
    ? [{ City: "Sample City 1" }, { City: "Sample City 2" }]
    : [];

  const clearFilters = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setDomain("");
    setZone("");
    setState("");
    setCity("");
    setLevel("");
  };

  const handleDomainChange = (value: string) =>
    setDomain(value === "all" ? "" : value);
  const handleZoneChange = (value: string) =>
    setZone(value === "all" ? "" : value);
  const handleStateChange = (value: string) => {
    setState(value === "all" ? "" : value);
    setCity("");
  };
  const handleCityChange = (value: string) =>
    setCity(value === "all" ? "" : value);
  const handleLevelChange = (value: string) =>
    setLevel(value === "all" ? "" : value);

  const activeFiltersCount = [domain, zone, state, city, level].filter(
    Boolean
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="relative ">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-amber-500/5 to-transparent pointer-events-none" />

        <div className="relative bg-gradient-to-r from-orange-900 via-amber-900 to-orange-800 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-30" />

          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">
                  Discover Amazing Communities
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                Explore Communities
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Find and connect with vibrant communities across India. Filter
                by domain, zone, or location to discover your perfect match.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                  <div className="flex items-center pl-5 text-white/60">
                    <Search className="h-5 w-5" />
                  </div>
                  <Input
                    placeholder="Search communities by name, domain, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-lg px-4"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery("")}
                      className="text-white/60 hover:text-white hover:bg-white/10 mr-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      /* Search functionality is already reactive via searchQuery */
                    }}
                    disabled={isLoading}
                    className="h-10 px-6 m-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{communities.length}+ Communities</span>
              </div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>28+ States</span>
              </div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                <span>{zones.length || 5}+ Zones</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
          {/* Inline Filter Section */}
          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-soft animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                Filter Communities
                {activeFiltersCount > 0 && (
                  <Badge className="bg-primary text-primary-foreground">
                    {activeFiltersCount}
                  </Badge>
                )}
              </h2>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Domain
                </Label>
                <Select
                  value={domain || "all"}
                  onValueChange={handleDomainChange}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Domains" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Domains</SelectItem>
                    {domains.map((d) => (
                      <SelectItem key={d.name} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Zone
                </Label>
                <Select value={zone || "all"} onValueChange={handleZoneChange}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Zones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {zones.map((z) => (
                      <SelectItem key={z.name} value={z.name}>
                        {z.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  State
                </Label>
                <Select
                  value={state || "all"}
                  onValueChange={(value) => {
                    handleStateChange(value);
                    if (value === "all") handleCityChange("all");
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {indianStates.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  City
                </Label>
                <Select
                  value={city || "all"}
                  onValueChange={handleCityChange}
                  disabled={!state}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue
                      placeholder={state ? "Select City" : "Select State First"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {mockCities.map((c) => (
                      <SelectItem key={c.City} value={c.City}>
                        {c.City}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Level
                </Label>
                <Select
                  value={level || "all"}
                  onValueChange={handleLevelChange}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {communityLevels.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Active:</span>
                {domain && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {domain}
                    <button
                      onClick={() => handleDomainChange("all")}
                      className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {zone && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {zone}
                    <button
                      onClick={() => handleZoneChange("all")}
                      className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {state && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {state}
                    <button
                      onClick={() => {
                        handleStateChange("all");
                        handleCityChange("all");
                      }}
                      className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {city && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {city}
                    <button
                      onClick={() => handleCityChange("all")}
                      className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {level && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {communityLevels.find((l) => l.value === level)?.label ||
                      level}
                    <button
                      onClick={() => handleLevelChange("all")}
                      className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Quick Domain Pills */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-muted-foreground shrink-0">
              Quick filters:
            </span>
            {domains.slice(0, 6).map((d) => (
              <Badge
                key={d.name}
                variant={domain === d.name ? "default" : "secondary"}
                onClick={() =>
                  handleDomainChange(domain === d.name ? "all" : d.name)
                }
                className={`shrink-0 cursor-pointer transition-all ${
                  domain === d.name
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0"
                    : "hover:bg-secondary/80"
                }`}
              >
                {d.name}
                <span className="ml-1 opacity-70">({d.count})</span>
              </Badge>
            ))}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mt-8 mb-6">
            <div>
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredCommunities.length}
                </span>{" "}
                communities
                {debouncedSearchQuery && (
                  <span>
                    {" "}
                    for "
                    <span className="font-medium">{debouncedSearchQuery}</span>"
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* <Select defaultValue="recent">
                <SelectTrigger className="w-36 bg-card">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="members">Most Members</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select> */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-muted rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 w-8 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                      : ""
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "compact" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("compact")}
                  className={`h-8 w-8 ${
                    viewMode === "compact"
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                      : ""
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {[...Array(6)].map((_, i) => (
                <CommunityCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredCommunities.length === 0 && (
            <Card className="p-12 text-center border-dashed animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary/10 flex items-center justify-center">
                <Compass className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                No Communities Found
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                We couldn't find any communities matching your criteria. Try
                adjusting your filters.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white hover:opacity-90"
              >
                Clear All Filters
              </Button>
            </Card>
          )}

          {/* Communities Grid */}
          {!isLoading && filteredCommunities.length > 0 && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {filteredCommunities.map((community, index) => (
                <div
                  key={community.id || community._id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CommunityCard {...community} />
                </div>
              ))}
            </div>
          )}

          {/* Load More */}
          {!isLoading && filteredCommunities.length > 6 && (
            <div className="flex justify-center mt-10">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 border-primary/30 hover:bg-primary/5 hover:border-primary"
              >
                Load More Communities
              </Button>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
