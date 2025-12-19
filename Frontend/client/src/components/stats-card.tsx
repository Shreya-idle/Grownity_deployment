import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  subtitle?: string;
  icon: LucideIcon;
}

export function StatsCard({ title, value, change, trend, subtitle, icon: Icon }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold" data-testid={`text-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
              <TrendingUp className={`h-3 w-3 ${trend.positive ? '' : 'rotate-180'}`} />
              <span>{trend.value}</span>
            </div>
          )}
          {change && (
            <div className="flex items-center gap-1 text-sm text-chart-3">
              <TrendingUp className="h-3 w-3" />
              <span>{change}</span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
