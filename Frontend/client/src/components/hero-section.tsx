import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Dropdown } from "react-day-picker";
import { Badge } from "@/components/ui/badge";
export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    const user_query = searchQuery.trim();

    if (user_query) params.append("q", user_query);

    if (params.toString()) {
      setLocation(`/explore?${params.toString()}`);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag));
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };
  return (
    <section className="relative hero-background overflow-hidden min-h-[80vh] md:min-h-screen">
      {/* ensure content sits above the CSS background gradient */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-28 lg:py-36">
        <div className="text-center max-w-3xl mx-auto space-y-8 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-primary-foreground text-shadow font-samarkan">
            Welcome <br /> Community India
          </h1>
          <p className="text-lg md:text-xl text-white italic text-shadow">
            Find local and online communities based on your interests. Join
            groups for tech, startups, design, and more. Build meaningful
            connections.
          </p>

          <form
            onSubmit={handleFormSubmit}
            className="relative max-w-2xl mx-auto"
          >
            <div className="flex gap-2">
              <Link href="/explore">
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="h-12 px-4"
                >
                  {/* <Dropdown> */}
                  <SlidersHorizontal className="h-5 w-5" />
                 
                </Button>
              </Link>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
                <Input
                  type="search"
                  placeholder="Location"
                  className="pl-10 h-12 bg-transparent placeholder:text-white border-white/50 hover:border-white focus-visible:ring-white/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-hero-search"
                />
              </div>

              <Button
                variant="outline"
                type="submit"
                size="lg"
                className="h-12 w-12 border-white text-white hover:bg-white/10"
                data-testid="button-hero-search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            {/* <div className="flex flex-wrap gap-2 mt-4 justify-center text-primary-foreground/90 text-shadow">
              <span className="font-semibold">Popular:</span>
              <span>Tech Communities</span>
              <span>Startup Groups</span>
              <span>Design Circles</span>
            </div> */}
          </form>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">1,200+</span>
              <span className="text-white">Active Communities</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">150+</span>
              <span className="text-white">Cities Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                50,000+
              </span>
              <span className="text-white">Total Members</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
