import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  Filter,
  ArrowUpDown,
  Settings2,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  MapPin,
  Calendar,
  X,
  ArrowLeft,
} from "lucide-react";

import { Users, Briefcase, Mic, Gift, Rocket } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type ActionButton = {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
};

const actionButtons: ActionButton[] = [
  {
    type: "volunteer",
    label: "Become a Volunteer",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    type: "sponsor",
    label: "Become a Sponsor",
    icon: Briefcase,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    type: "speaker",
    label: "Become a Speaker",
    icon: Mic,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    type: "community_partner",
    label: "Become a Community Partner",
    icon: Gift,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    type: "showcase_zone",
    label: "Showcase Zone",
    icon: Rocket,
    gradient: "from-blue-500 to-blue-600",
  },
];

interface Proposal {
  _id: string;
  type:
    | "sponsor"
    | "volunteer"
    | "speaker"
    | "community_partner"
    | "showcase_zone";
  name: string;
  email: string;
  phone?: string;
  location?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  tagType?: "spam" | "featured" | "important";
  [key: string]: any;
}

const fetchSubmissions = async (type: string): Promise<Proposal[]> => {
  const apiEndpoint = 
    type === "sponsor" ? "sponsors" : 
    type === "showcase_zone" ? "showcase" :
    type === "community_partner" ? "community-partner" :
    type;

  const response = await fetch(`/api/${apiEndpoint}/list`, {
    credentials: "include",
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Failed to fetch ${type} submissions`);
  }
  const data = await response.json();
  return data.map((item: any) => ({
    ...item,
    type,
    submittedAt: new Date(item.createdAt || Date.now()).toLocaleString(),
  }));
};

const updateStatus = async ({
  type,
  id,
  status,
}: {
  type: string;
  id: string;
  status: "approved" | "rejected";
}) => {
  const endpoint = type === "volunteer" ? `volunteer/${id}/status` :
                   type === "sponsor" ? `sponsors/${id}` :
                   type === "speaker" ? `speaker/${id}` :
                   type === "showcase_zone" ? `showcase/${id}` :
                   `community-partner/${id}`;

  const method = "PATCH";

  const response = await fetch(`/api/${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to update status");
  }
  return response.json();
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "volunteer":
      return Users;
    case "sponsor":
      return Briefcase;
    case "speaker":
      return Mic;
    case "community_partner":
      return Gift;
    case "showcase_zone":
      return Rocket;
    default:
      return Users;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "volunteer":
      return "Volunteer";
    case "sponsor":
      return "Sponsor";
    case "speaker":
      return "Speaker";
    case "community_partner":
      return "Community Partner";
    case "showcase_zone":
      return "Showcase Zone";
    default:
      return type;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return CheckCircle;
    case "rejected":
      return XCircle;
    case "pending":
      return Clock;
    default:
      return Clock;
  }
};

const SubmissionItem = ({ 
  proposal, 
  onStatusUpdate, 
  isPending, 
  isSelected, 
  onToggleSelect 
}: { 
  proposal: Proposal; 
  onStatusUpdate: (id: string, status: "approved" | "rejected") => void;
  isPending: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) => {
  const [, setLocation] = useLocation();
  const TypeIcon = getTypeIcon(proposal.type);
  const typeColor =
    proposal.type === "volunteer"
      ? "from-blue-500 to-blue-600"
      : proposal.type === "sponsor"
      ? "from-purple-500 to-purple-600"
      : proposal.type === "speaker"
      ? "from-green-500 to-green-600"
      : proposal.type === "showcase_zone"
      ? "from-orange-500 to-orange-600"
      : "from-pink-500 to-pink-600";

  return (
    <div className="bg-white rounded-lg border border-orange-200/30 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(proposal._id)}
            className="mt-1"
          />
          <div className={`p-2 rounded-lg bg-gradient-to-br ${typeColor}`}>
            <TypeIcon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">
                {proposal.name}
              </h4>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 border text-xs">
                {getTypeLabel(proposal.type)}
              </Badge>
              {proposal.status !== 'pending' && (
                <Badge className={`border text-xs ${getStatusColor(proposal.status)}`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {proposal.email}
              </p>
              {proposal.location && (
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {proposal.location}
                </p>
              )}
              <p className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {proposal.submittedAt}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {proposal.status === 'pending' && (
            <>
              <Button
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onStatusUpdate(proposal._id, "approved")}
                disabled={isPending}
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => onStatusUpdate(proposal._id, "rejected")}
                disabled={isPending}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-orange-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Dialog>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    View Full Details
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Submission Details - {proposal.name}</DialogTitle>
                    <DialogDescription>
                      Full application details for {getTypeLabel(proposal.type)}
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="flex-1 pr-4 mt-4">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                      {Object.entries(proposal)
                        .filter(([key]) => !['_id', '__v', 'updatedAt', 'type', 'tagType'].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-foreground font-medium break-words">
                              {typeof value === 'string' || typeof value === 'number' 
                                ? String(value) 
                                : value === null ? 'N/A' : JSON.stringify(value)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem onClick={() => {
                const editType = proposal.type === 'showcase_zone' ? 'showcase' : proposal.type === 'community_partner' ? 'community-partner' : proposal.type;
                setLocation(`/admin/edit/${editType}/${proposal._id}`);
              }}>
                Edit Form
              </DropdownMenuItem>
              <DropdownMenuItem>Add Notes</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Send Email</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

const CallForProposals = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  // const navigate = useNavigate();

  const { data: volunteers = [], isLoading: loadingVolunteers } = useQuery({
    queryKey: ["volunteers-list"],
    queryFn: () => fetchSubmissions("volunteer"),
  });
  const { data: speakers = [], isLoading: loadingSpeakers } = useQuery({
    queryKey: ["speakers-list"],
    queryFn: () => fetchSubmissions("speaker"),
  });
  const { data: sponsors = [], isLoading: loadingSponsors } = useQuery({
    queryKey: ["sponsors-list"],
    queryFn: () => fetchSubmissions("sponsor"),
  });
  const { data: showcases = [], isLoading: loadingShowcases } = useQuery({
    queryKey: ["showcases-list"],
    queryFn: () => fetchSubmissions("showcase_zone"),
  });
  const { data: partners = [], isLoading: loadingPartners } = useQuery({
    queryKey: ["partners-list"],
    queryFn: () => fetchSubmissions("community_partner"),
  });

  const proposals = [
    ...volunteers,
    ...speakers,
    ...sponsors,
    ...showcases,
    ...partners,
  ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const mutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: (_, variables) => {
      const typeKey =
        variables.type === "volunteer" ? "volunteers-list" :
        variables.type === "speaker" ? "speakers-list" :
        variables.type === "sponsor" ? "sponsors-list" :
        variables.type === "showcase_zone" ? "showcases-list" :
        "partners-list";
      
      queryClient.invalidateQueries({ queryKey: [typeKey] });
      toast({
        title: "Success",
        description: `Proposal for ${variables.type} has been ${variables.status}.`,
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

  const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [activeForms, setActiveForms] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState({
    type: true,
    name: true,
    email: true,
    status: true,
    date: true,
  });

  const isLoading = loadingVolunteers || loadingSpeakers || loadingSponsors || loadingShowcases || loadingPartners;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  }

  const filteredProposals = filterStatus
    ? proposals.filter((p) => p.status === filterStatus)
    : proposals;

  const toggleSelectAll = () => {
    if (selectedProposals.length === filteredProposals.length) {
      setSelectedProposals([]);
    } else {
      setSelectedProposals(filteredProposals.map((p) => p._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProposals((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSelect = (type: string) => {
    switch (type) {
      case "volunteer":
        setLocation("/volunteer");
        break;
      case "sponsor":
        setLocation("/sponsor");
        break;
      case "speaker":
        setLocation("/speaker");
        break;
      case "community_partner":
        setLocation("/community-partner");
        break;
      case "showcase_zone":
        setLocation("/showcase");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Call for Proposals
              </h1>
              <p className="text-gray-600">
                Manage and review all community proposals
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {actionButtons.map(({ type, label, icon: Icon, gradient }) => (
              <Button
                key={type}
                onClick={() => handleSelect(type)}
                className={`group relative overflow-hidden gap-3 h-14 bg-gradient-to-r ${gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-semibold">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto w-full bg-white border border-orange-200">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending-approvals">
              Pending Approvals
            </TabsTrigger>
            <TabsTrigger value="current-sponsors">Current Sponsors</TabsTrigger>
            <TabsTrigger value="current-volunteers">
              Current Volunteers
            </TabsTrigger>
            <TabsTrigger value="current-speakers">Current Speakers</TabsTrigger>
            <TabsTrigger value="current-showcases">Current Showcases</TabsTrigger>
            <TabsTrigger value="current-partners">Current Partners</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-orange-200/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Proposals
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {proposals.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Filter className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-orange-200/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {proposals.filter((p) => p.status === "pending").length}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-orange-200/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Approved
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {proposals.filter((p) => p.status === "approved").length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-orange-200/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rejected
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {proposals.filter((p) => p.status === "rejected").length}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-orange-200/30 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {proposals.slice(0, 5).map((proposal) => {
                  const StatusIcon = getStatusIcon(proposal.status);
                  const statusColor = getStatusColor(proposal.status);
                  return (
                    <div
                      key={proposal._id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}
                        >
                          {proposal.status}
                        </div>
                        <span className="text-sm text-gray-600">
                          {proposal.name} - {proposal.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {proposal.submittedAt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending-approvals" className="mt-4">
            <div className="bg-white rounded-lg border border-orange-200/30">
              <div className="p-6 border-b border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pending Approvals
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {proposals.filter((p) => p.status === "pending").length}{" "}
                      proposals awaiting review
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 border">
                    {proposals.filter((p) => p.status === "pending").length}{" "}
                    Pending
                  </Badge>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between py-4 gap-3 flex-wrap border-t border-orange-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        selectedProposals.forEach(id => {
                          const proposal = proposals.find(p => p._id === id);
                          if (proposal) mutation.mutate({ type: proposal.type, id, status: "approved" });
                        });
                        setSelectedProposals([]);
                      }}
                      disabled={selectedProposals.length === 0 || mutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve All ({selectedProposals.length})
                    </Button>
                    <Button
                      size="sm"
                      className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => {
                        selectedProposals.forEach(id => {
                          const proposal = proposals.find(p => p._id === id);
                          if (proposal) mutation.mutate({ type: proposal.type, id, status: "rejected" });
                        });
                        setSelectedProposals([]);
                      }}
                      disabled={selectedProposals.length === 0}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject All ({selectedProposals.length})
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pending Proposals List */}
              <div className="space-y-3 p-6">
                {proposals.filter((p) => p.status === "pending").length > 0 ? (
                  proposals
                    .filter((p) => p.status === "pending")
                    .map((proposal) => (
                      <SubmissionItem
                        key={proposal._id}
                        proposal={proposal}
                        isPending={mutation.isPending}
                        isSelected={selectedProposals.includes(proposal._id)}
                        onToggleSelect={toggleSelect}
                        onStatusUpdate={(id, status) => mutation.mutate({ type: proposal.type, id, status })}
                      />
                    ))
                ) : (
                  <div className="bg-white rounded-lg border border-orange-200/30 p-8 text-center text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30 text-green-600" />
                    <p className="font-medium">No pending approvals</p>
                    <p className="text-sm mt-1">
                      All proposals have been reviewed!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="current-sponsors" className="mt-4">
            <div className="space-y-3 p-6">
              {sponsors.filter(s => s.status === 'approved').length > 0 ? (
                sponsors.filter(s => s.status === 'approved').map(proposal => (
                  <SubmissionItem
                    key={proposal._id}
                    proposal={proposal}
                    isPending={mutation.isPending}
                    isSelected={selectedProposals.includes(proposal._id)}
                    onToggleSelect={toggleSelect}
                    onStatusUpdate={(id, status) => mutation.mutate({ type: proposal.type, id, status })}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border border-orange-200/30 p-8 text-center text-gray-600">
                  <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No approved sponsors yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="current-volunteers" className="mt-4">
            <div className="space-y-3 p-6">
              {volunteers.filter(v => v.status === 'approved').length > 0 ? (
                volunteers.filter(v => v.status === 'approved').map(proposal => (
                  <SubmissionItem
                    key={proposal._id}
                    proposal={proposal}
                    isPending={mutation.isPending}
                    isSelected={selectedProposals.includes(proposal._id)}
                    onToggleSelect={toggleSelect}
                    onStatusUpdate={(id, status) => mutation.mutate({ type: proposal.type, id, status })}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border border-orange-200/30 p-8 text-center text-gray-600">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No approved volunteers yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="current-speakers" className="mt-4">
            <div className="space-y-3 p-6">
              {speakers.filter(s => s.status === 'approved').length > 0 ? (
                speakers.filter(s => s.status === 'approved').map(proposal => (
                  <SubmissionItem
                    key={proposal._id}
                    proposal={proposal}
                    isPending={mutation.isPending}
                    isSelected={selectedProposals.includes(proposal._id)}
                    onToggleSelect={toggleSelect}
                    onStatusUpdate={(id, status) => mutation.mutate({ type: proposal.type, id, status })}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border border-orange-200/30 p-8 text-center text-gray-600">
                  <Mic className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No approved speakers yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="current-showcases" className="mt-4">
            <div className="space-y-3 p-6">
              {showcases.filter(s => s.status === 'approved').length > 0 ? (
                showcases.filter(s => s.status === 'approved').map(proposal => (
                  <SubmissionItem
                    key={proposal._id}
                    proposal={proposal}
                    isPending={mutation.isPending}
                    isSelected={selectedProposals.includes(proposal._id)}
                    onToggleSelect={toggleSelect}
                    onStatusUpdate={(id, status) => mutation.mutate({ type: proposal.type, id, status })}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border border-orange-200/30 p-8 text-center text-gray-600">
                  <Rocket className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No approved showcases yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="current-partners" className="mt-4">
            <div className="space-y-3 p-6">
              {partners.filter(p => p.status === 'approved').length > 0 ? (
                partners.filter(p => p.status === 'approved').map(proposal => (
                  <SubmissionItem
                    key={proposal._id}
                    proposal={proposal}
                    isPending={mutation.isPending}
                    isSelected={selectedProposals.includes(proposal._id)}
                    onToggleSelect={toggleSelect}
                    onStatusUpdate={(id, status) => mutation.mutate({ type: proposal.type, id, status })}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border border-orange-200/30 p-8 text-center text-gray-600">
                  <Gift className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No approved partners yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CallForProposals;
