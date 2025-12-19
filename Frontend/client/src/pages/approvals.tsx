import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
  ArrowLeft,
  Calendar,
  X,
  ArrowUp,
  ArrowDown,
  Sliders,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CommunityCard } from "@/components/community-card";
import { CommunityTable } from "@/components/community-table";
import { ViewToggle } from "@/components/view-toggle";

interface Community {
  _id: string;
  name: string;
  description: string;
  domain: string;
  members: any[];
  city?: string;
  zone?: string;
  state?: string;
  countryState?: string;
  banner?: string;
  social_links?: any;
  _communityAdminid: {
    name: string;
  };
  created_at: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  type?: string;
}

const fetchCommunitiesByStatus = async (
  status: string
): Promise<Community[]> => {
  const response = await fetch(
    `https://indian-community-beta.vercel.app//api/communities/${status}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    throw new Error(`Failed to fetch ${status} communities`);
  }
  return response.json();
};

const updateCommunityStatus = async ({
  id,
  status,
  rejectionReason,
}: {
  id: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
}) => {
  // todo: remove mock functionality - uncomment real API call below
  console.log(
    "Updating community:",
    id,
    "to status:",
    status,
    rejectionReason ? `with reason: ${rejectionReason}` : ""
  );
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };

  const response = await fetch(
    `https://indian-community-beta.vercel.app//api/communities/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectionReason }),
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update community status");
  }
  return response.json();
};

const filterCommunitiesByDate = (
  communities: Community[],
  startDate: string,
  endDate: string
) => {
  if (!startDate && !endDate) return communities;

  return communities.filter((community) => {
    const communityDate = new Date(community.created_at);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (communityDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (communityDate > end) return false;
    }

    return true;
  });
};

const filterCommunitiesBySearch = (
  communities: Community[],
  searchTerm: string
) => {
  if (!searchTerm) return communities;

  const lowerSearch = searchTerm.toLowerCase();
  return communities.filter((community) =>
    community.name.toLowerCase().includes(lowerSearch)
  );
};

const sortCommunities = (
  communities: Community[],
  sortOrder: "latest" | "oldest"
) => {
  const sorted = [...communities];
  if (sortOrder === "latest") {
    return sorted.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else {
    return sorted.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }
};

export default function Approvals() {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const { data: pending = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ["communities", "pending"],
    queryFn: () => fetchCommunitiesByStatus("pending"),
  });

  const { data: approved = [], isLoading: isLoadingApproved } = useQuery({
    queryKey: ["communities", "approved"],
    queryFn: () => fetchCommunitiesByStatus("approved"),
  });

  const { data: rejected = [], isLoading: isLoadingRejected } = useQuery({
    queryKey: ["communities", "rejected"],
    queryFn: () => fetchCommunitiesByStatus("rejected"),
  });

  const { data: contentModerator = [], isLoading: isLoadingcontentModerator } =
    useQuery({
      queryKey: ["communities", "moderated"],
      queryFn: () => fetchCommunitiesByStatus("moderated"),
    });

  const mutation = useMutation({
    mutationFn: updateCommunityStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Success",
        description: "Request updated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // via-orange-50/20 to-amber-50/10

  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      mutation.mutate({ id, status: "rejected", rejectionReason: reason });
    } else {
      toast({
        title: "Info",
        description: "Rejection cancelled. No reason was provided.",
      });
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setSortOrder("latest");
    setSearchTerm("");
  };

  const isLoading =
    isLoadingPending ||
    isLoadingApproved ||
    isLoadingRejected ||
    isLoadingcontentModerator;

  const filteredAndSortedPending = sortCommunities(
    filterCommunitiesBySearch(
      filterCommunitiesByDate(pending, startDate, endDate),
      searchTerm
    ),
    sortOrder
  );
  const filteredAndSortedApproved = sortCommunities(
    filterCommunitiesBySearch(
      filterCommunitiesByDate(approved, startDate, endDate),
      searchTerm
    ),
    sortOrder
  );
  const filteredAndSortedRejected = sortCommunities(
    filterCommunitiesBySearch(
      filterCommunitiesByDate(rejected, startDate, endDate),
      searchTerm
    ),
    sortOrder
  );
  const filteredAndSortedContentModerator = sortCommunities(
    filterCommunitiesBySearch(
      filterCommunitiesByDate(contentModerator, startDate, endDate),
      searchTerm
    ),
    sortOrder
  );

  const isFiltering =
    startDate || endDate || sortOrder !== "latest" || searchTerm;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  const totalRequests =
    pending.length +
    approved.length +
    rejected.length +
    contentModerator.length;

  const CardWithActions = ({
    community,
    showActions,
  }: {
    community: Community;
    showActions: boolean;
  }) => {
    return (
      <div className="relative">
        <CommunityCard
          _id={community._id}
          name={community.name}
          description={community.description}
          domain={community.domain}
          zone={community.zone || ""}
          city={community.city || ""}
          state={community.state || community.countryState || ""}
          banner={community.banner}
          numberOfMembers={
            Array.isArray(community.members) ? community.members.length : 0
          }
          status={community.status}
          showActions={showActions}
          onApprove={handleApprove}
          onReject={handleReject}
          isPending={mutation.isPending}
        />
        {!showActions && (
          <div className="absolute top-3 right-3 z-10">
            {community.status === "approved" && (
              <Badge className="bg-green-500 text-white border-0 gap-1 shadow-lg">
                <CheckCircle className="h-3 w-3" />
                Approved
              </Badge>
            )}
            {community.status === "rejected" && (
              <Badge className="bg-red-500 text-white border-0 gap-1 shadow-lg">
                <XCircle className="h-3 w-3" />
                Rejected
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCommunitiesView = (
    communities: Community[],
    showActions: boolean,
    emptyMessage: string,
    emptySubMessage: string
  ) => {
    if (communities.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-orange-200/30 p-8 sm:p-12 text-center">
          <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-20 text-green-600" />
          <p className="text-base sm:text-lg text-gray-600 font-medium">
            {isFiltering ? `No ${emptyMessage} found` : `No ${emptyMessage}`}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {isFiltering ? "Try adjusting your filters" : emptySubMessage}
          </p>
        </div>
      );
    }

    if (viewMode === "table") {
      return (
        <CommunityTable
          communities={communities}
          showActions={showActions}
          onApprove={handleApprove}
          onReject={handleReject}
          isPending={mutation.isPending}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {communities.map((community) => (
          <CardWithActions
            key={community._id}
            community={community}
            showActions={showActions}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50/20 to-amber-50/10">
      <div className="border-b border-orange-200/40 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 rounded-lg hover:bg-orange-100 transition-colors text-orange-600 mt-1"
                title="Go back to dashboard"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-200/50">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Community Approvals
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Review and manage community registration requests
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-semibold text-gray-900">
                  {totalRequests}
                </span>{" "}
                total requests
              </div>
              <div className="text-xs text-gray-500">
                {pending.length} pending approval
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search communities by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white/80 placeholder:text-gray-400"
                  data-testid="input-search"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    data-testid="button-clear-search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="hidden sm:block">
                <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 bg-gradient-to-r from-orange-50/20 to-amber-50/10 hover:from-orange-100 hover:to-amber-100 text-orange-700"
                data-testid="button-toggle-filters"
              >
                <Sliders className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>

              {isFiltering && (
                <Button
                  onClick={handleClearFilter}
                  variant="outline"
                  className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50"
                  data-testid="button-clear-filters"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="sm:hidden">
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 sm:p-5 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/80 to-amber-50/50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  Date Range
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white/80"
                    data-testid="input-start-date"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white/80"
                    data-testid="input-end-date"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-orange-200">
                <label className="text-sm font-semibold text-gray-900">
                  Sort By
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder("latest")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      sortOrder === "latest"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-600 text-white shadow-md"
                        : "bg-white border-orange-200 text-gray-700 hover:border-orange-400"
                    }`}
                    data-testid="button-sort-latest"
                  >
                    <ArrowUp className="h-4 w-4" />
                    Latest
                  </button>
                  <button
                    onClick={() => setSortOrder("oldest")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      sortOrder === "oldest"
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-600 text-white shadow-md"
                        : "bg-white border-orange-200 text-gray-700 hover:border-orange-400"
                    }`}
                    data-testid="button-sort-oldest"
                  >
                    <ArrowDown className="h-4 w-4" />
                    Oldest
                  </button>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="bg-transparent border-b border-orange-200/30 rounded-none p-0 h-auto w-full justify-start overflow-x-auto">
              <TabsTrigger
                value="pending"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-orange-600 whitespace-nowrap"
                data-testid="tab-pending"
              >
                Pending ({filteredAndSortedPending.length})
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-orange-600 whitespace-nowrap"
                data-testid="tab-approved"
              >
                Approved ({filteredAndSortedApproved.length})
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-orange-600 whitespace-nowrap"
                data-testid="tab-rejected"
              >
                Rejected ({filteredAndSortedRejected.length})
              </TabsTrigger>
              <TabsTrigger
                value="contentModerator"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-orange-600 whitespace-nowrap"
                data-testid="tab-moderated"
              >
                Content Moderator ({filteredAndSortedContentModerator.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6 sm:mt-8 py-4 sm:py-6">
              {renderCommunitiesView(
                filteredAndSortedPending,
                true,
                "pending requests",
                "All communities are up to date!"
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-6 sm:mt-8 py-4 sm:py-6">
              {renderCommunitiesView(
                filteredAndSortedApproved,
                false,
                "approved communities",
                "Approve communities to see them here"
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-6 sm:mt-8 py-4 sm:py-6">
              {renderCommunitiesView(
                filteredAndSortedRejected,
                false,
                "rejected communities",
                "Rejected communities will appear here"
              )}
            </TabsContent>

            <TabsContent
              value="contentModerator"
              className="mt-6 sm:mt-8 py-4 sm:py-6"
            >
              {renderCommunitiesView(
                filteredAndSortedContentModerator,
                false,
                "moderated communities",
                "Moderated communities will appear here"
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
