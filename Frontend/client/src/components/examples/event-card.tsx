import { EventCard } from "../event-card";

export default function EventCardExample() {
  return (
    <div className="max-w-md">
      <EventCard
        id="1"
        title="AI & Machine Learning Workshop"
        communityName="Tech Innovators Mumbai"
        date={new Date(2025, 10, 15)}
        time="6:00 PM - 9:00 PM IST"
        location="WeWork, Andheri East, Mumbai"
        type="offline"
        rsvpCount={85}
        category="Workshop"
      />
    </div>
  );
}
