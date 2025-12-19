import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { format } from "date-fns";

export interface EventCardProps {
  id: string;
  title: string;
  communityName: string;
  date: Date;
  time: string;
  location: string;
  type: "online" | "offline";
  rsvpCount: number;
  category: string;
}

export function EventCard({
  id,
  title,
  communityName,
  date,
  time,
  location,
  type,
  rsvpCount,
  category,
}: EventCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid={`card-event-${id}`}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-lg line-clamp-2" data-testid={`text-event-title-${id}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{communityName}</p>
          </div>
          <Badge variant={type === "online" ? "default" : "secondary"} data-testid={`badge-event-type-${id}`}>
            {type === "online" ? "Online" : "In-Person"}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(date, "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{rsvpCount} attending</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <Badge variant="outline">{category}</Badge>
          <Button size="sm" data-testid={`button-rsvp-${id}`}>
            RSVP
          </Button>
        </div>
      </div>
    </Card>
  );
}
