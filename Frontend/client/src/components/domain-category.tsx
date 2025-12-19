import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

export interface DomainCategoryProps {
  name: string;
  icon: LucideIcon;
  count: number;
  href: string;
}

export function DomainCategory({ name, icon: Icon, count, href }: DomainCategoryProps) {
  return (
    <Link href={href}>
      <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer transition-all text-center space-y-3" data-testid={`card-domain-${name.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">{count} communities</p>
        </div>
      </Card>
    </Link>
  );
}
