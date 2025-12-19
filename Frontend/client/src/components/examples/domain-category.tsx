import { DomainCategory } from "../domain-category";
import { Code } from "lucide-react";

export default function DomainCategoryExample() {
  return (
    <div className="max-w-xs">
      <DomainCategory
        name="Technology"
        icon={Code}
        count={1250}
        href="/explore?domain=tech"
      />
    </div>
  );
}
