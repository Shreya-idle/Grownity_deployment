import { LayoutGrid, Table2 } from "lucide-react";

interface ViewToggleProps {
  viewMode: "card" | "table";
  onViewChange: (mode: "card" | "table") => void;
}

export function ViewToggle({ viewMode, onViewChange }: ViewToggleProps) {
  return (
    <div
      className="inline-flex rounded-lg border border-orange-200 overflow-hidden"
      data-testid="view-toggle-container"
    >
      <button
        onClick={() => onViewChange("card")}
        className={`p-2 transition-all duration-200 ${
          viewMode === "card"
            ? "bg-orange-500 text-white"
            : "bg-white text-gray-600 hover:bg-orange-50"
        }`}
        title="Card View"
        data-testid="button-card-view"
      >
        <LayoutGrid className="h-5 w-5" />
      </button>
      <button
        onClick={() => onViewChange("table")}
        className={`p-2 transition-all duration-200 ${
          viewMode === "table"
            ? "bg-orange-500 text-white"
            : "bg-white text-gray-600 hover:bg-orange-50"
        }`}
        title="Table View"
        data-testid="button-table-view"
      >
        <Table2 className="h-5 w-5" />
      </button>
    </div>
  );
}
