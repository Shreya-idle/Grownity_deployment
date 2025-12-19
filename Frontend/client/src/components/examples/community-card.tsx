import { CommunityCard } from "../community-card";

export default function CommunityCardExample() {
  return (
    <div className="max-w-sm">
      <CommunityCard
        id="1"
        name="Tech Innovators Mumbai"
        description="A vibrant community of tech enthusiasts, developers, and innovators building the future of technology in Mumbai."
        location="Mumbai"
        domain="Technology"
        memberCount={5300}
        eventCount={72}
        verified={true}
        socials={["linkedin", "twitter", "globe"]}
      />
    </div>
  );
}
