import { useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Building2, Briefcase, MapPin, Code } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const zoneDetails: { [key: string]: any } = {
  Northern: {
    icon: Building2,
    description: "Innovation hubs driving India's digital transformation",
  },
  Western: {
    icon: Briefcase,
    description: "Financial and commercial technology powerhouse",
  },
  Southern: {
    icon: Code,
    description: "Silicon Valley of India with global tech giants",
  },
  Eastern: {
    icon: MapPin,
    description: "Emerging tech centers with rich cultural heritage",
  },
};

interface City {
  name: string;
  count: number;
}

interface Zone {
  name: string;
  cities: City[];
}

interface State {
  name: string;
  count: number;
}

export default function Zones() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchZones = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://indian-community-beta.vercel.app//api/communities/stats/zones"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch zone data");
        }
        console.log(response);
        const data = await response.json();
        setZones(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchZones();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-br from-primary/10 to-accent/5 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              India's Tech Community Zones
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore communities across India organized by geographic zones and
              cities
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(6)].map((_, j) => (
                      <Skeleton key={j} className="h-10 w-full" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {zones.map((zone) => {
                const details = zoneDetails[zone.name] || {
                  icon: Code,
                  description: "A vibrant tech zone.",
                };
                return (
                  <Link
                    key={zone.name}
                    href={`/zone/${zone.name.toLowerCase()}`}
                  >
                    <Card
                      className="p-8 hover-elevate active-elevate-2 cursor-pointer h-full"
                      data-testid={`card-zone-${zone.name}`}
                    >
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <details.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-2">
                              {zone.name}
                            </h2>
                            <p className="text-muted-foreground">
                              {details.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {zone.states.map((state) => (
                            <div
                              key={state.name}
                              className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 hover-elevate"
                            >
                              <span className="text-sm font-medium">
                                {state.name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {state.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {zone.cities &&
                            zone.cities.map((city) => (
                              <div
                                key={city.name}
                                className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 hover-elevate"
                              >
                                <span className="text-sm font-medium">
                                  {city.name}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {city.count}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
