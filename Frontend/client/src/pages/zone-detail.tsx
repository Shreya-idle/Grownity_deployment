import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Users,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";

interface Community {
  _id: string;
  name: string;
  city: string;
  description: string;
  members: any[];
  social_links: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

const zoneNames: { [key: string]: string } = {
  southern: "Southern Zone",
  northern: "Northern Zone",
  eastern: "Eastern Zone",
  western: "Western Zone",
  central: "Central Zone",
  northeast: "North-East Zone",
};

export default function ZoneDetail() {
  const [, params] = useRoute("/zone/:id");
  const zoneId = params?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [cities, setCities] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!zoneId) return;

    const fetchCommunities = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiZoneId = `${zoneId.toLowerCase()}`;
        const response = await fetch(
          `http://localhost:3000/api/communities/zone/${apiZoneId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch communities");
        }

        const data: Community[] = await response.json();
        setCommunities(data);

        const uniqueCities = ["All", ...new Set(data.map((c) => c.city))];
        setCities(uniqueCities);
      } catch (err: any) {
        setError(err.message);
        setCommunities([]);
        setCities(["All"]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [zoneId]);

  const zoneName = zoneId
    ? zoneNames[zoneId] || "Community Zone"
    : "Community Zone";

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity =
      selectedCity === "all" ||
      selectedCity === "All" ||
      community.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const getSocialIcon = (social: string) => {
    switch (social) {
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p>Loading communities...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 to-accent/5 py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <Link href="/zones">
              <Button
                variant="outline"
                size="sm"
                className="mb-6"
                data-testid="button-back"
              >
                ← Back to Zones
              </Button>
            </Link>
            <h1 className="text-4xl font-bold mb-4">{zoneName} Communities</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search communities..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-communities"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {cities.map((city) => (
                <Button
                  key={city}
                  variant={
                    selectedCity === city ||
                    (selectedCity === "all" && city === "All")
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCity(city)}
                  data-testid={`button-city-${city.toLowerCase()}`}
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>

          {filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <Link key={community._id} href={`/community/${community._id}`}>
                  <Card
                    className="p-6 hover-elevate active-elevate-2 cursor-pointer h-full"
                    data-testid={`card-community-${community._id}`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {community.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-lg line-clamp-1 mb-1"
                            data-testid={`text-community-name-${community._id}`}
                          >
                            {community.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            {community.city}
                          </Badge>
                        </div>
                      </div>

                      <p
                        className="text-sm text-muted-foreground line-clamp-3"
                        data-testid={`text-community-description-${community._id}`}
                      >
                        {community.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {community.members.length.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {community.social_links &&
                            Object.entries(community.social_links)
                              .filter(([, link]) => link)
                              .map(([social, link]) => (
                                <a
                                  href={link as string}
                                  key={social}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    {getSocialIcon(social)}
                                  </Button>
                                </a>
                              ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No communities found</h3>
              <p className="text-muted-foreground">
                There are no communities matching your criteria in this zone
                yet.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
