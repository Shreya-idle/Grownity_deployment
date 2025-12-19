import { StatsCard } from "../stats-card";
import { Users } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="max-w-xs">
      <StatsCard
        title="Total Members"
        value="50,234"
        change="+12% from last month"
        icon={Users}
      />
    </div>
  );
}
