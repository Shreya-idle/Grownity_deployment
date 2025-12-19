import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Calendar, Flag, BarChart } from "lucide-react";
import { useEffect, useState } from "react";

interface Community {
  _id: string;
  name: string;
  about: string;
  zone: string;
  countryState: string;
  state: string;
  city: string;
  status: "pending" | "approved" | "rejected";
  level_of_community: string;
  view_count: number;
}

export default function Communities() {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        // This fetches from your backend API
        const response = await fetch(
          "https://indian-community-beta.vercel.app//api/communities/search",
          {}
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCommunities(data);
      } catch (error) {
        console.error("Failed to fetch communities:", error);
      }
    };

    fetchCommunities();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Communities</h1>
        <p className="text-muted-foreground">
          Manage and monitor all communities
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search communities..." className="pl-10" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((community) => (
          <Card key={community._id} className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{community.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {community.about}
                  </p>
                </div>
                <Badge>{community.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {community.view_count.toLocaleString()} views
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {community.city}, {community.countryState}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{community.level_of_community}</Badge>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">Manage</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
