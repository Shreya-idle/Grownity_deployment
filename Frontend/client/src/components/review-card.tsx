import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export interface ReviewCardProps {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export function ReviewCard({ id, authorName, rating, comment, date }: ReviewCardProps) {
  return (
    <Card className="p-6 space-y-4" data-testid={`card-review-${id}`}>
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {authorName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold" data-testid={`text-reviewer-${id}`}>{authorName}</h4>
            <span className="text-sm text-muted-foreground">{date}</span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "text-muted"}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground" data-testid={`text-review-comment-${id}`}>{comment}</p>
    </Card>
  );
}
