import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="mb-6 flex items-center gap-4">
      <button
        onClick={handleBack}
        className="p-2 rounded-full hover:bg-accent"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
