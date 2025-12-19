import { Navbar } from "@/components/navbar";
import { EventCard } from "@/components/event-card";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Events() {
  const [eventType, setEventType] = useState("");
  const [category, setCategory] = useState("");

  const events = [
    {
      id: "1",
      title: "AI & Machine Learning Workshop",
      communityName: "Tech Innovators Mumbai",
      date: new Date(2025, 10, 15),
      time: "6:00 PM - 9:00 PM IST",
      location: "WeWork, Andheri East, Mumbai",
      type: "offline" as const,
      rsvpCount: 85,
      category: "Workshop",
    },
    {
      id: "2",
      title: "Startup Pitch Night",
      communityName: "Bangalore Startup Founders",
      date: new Date(2025, 10, 18),
      time: "7:00 PM - 10:00 PM IST",
      location: "Virtual Event",
      type: "online" as const,
      rsvpCount: 142,
      category: "Networking",
    },
    {
      id: "3",
      title: "Design Thinking Masterclass",
      communityName: "Delhi Design Collective",
      date: new Date(2025, 10, 20),
      time: "2:00 PM - 6:00 PM IST",
      location: "India Habitat Centre, New Delhi",
      type: "offline" as const,
      rsvpCount: 67,
      category: "Workshop",
    },
    {
      id: "4",
      title: "Digital Marketing Trends 2025",
      communityName: "Pune Marketing Network",
      date: new Date(2025, 10, 22),
      time: "5:00 PM - 7:00 PM IST",
      location: "Virtual Event",
      type: "online" as const,
      rsvpCount: 203,
      category: "Conference",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
 
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Events Calendar</h1>
            <p className="text-muted-foreground">
              Discover upcoming events from communities across India
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger className="w-[180px]" data-testid="select-event-type">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">In-Person</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]" data-testid="select-event-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" data-testid="button-clear-filters">
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
