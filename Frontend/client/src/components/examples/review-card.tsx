import { ReviewCard } from "../review-card";

export default function ReviewCardExample() {
  return (
    <div className="max-w-2xl">
      <ReviewCard
        id="1"
        authorName="Rahul Sharma"
        rating={5}
        comment="Amazing community with great learning opportunities. The events are well-organized and the networking is top-notch!"
        date="2 days ago"
      />
    </div>
  );
}
