import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Globe, Building2 } from "lucide-react";
import { format } from "date-fns";

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
  _communityAdminid: {
    name: string;
  };
  created_at: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

interface CommunityTableProps {
  communities: Community[];
  showActions: boolean;
  onApprove?: (id: string, e: React.MouseEvent) => void;
  onReject?: (id: string, e: React.MouseEvent) => void;
  isPending?: boolean;
}

export function CommunityTable({
  communities,
  showActions,
  onApprove,
  onReject,
  isPending,
}: CommunityTableProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "N/A";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  if (communities.length === 0) {
    return (
      <div className="rounded-xl border border-orange-200 bg-white p-12 text-center">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg text-gray-600 font-medium">
          No communities found
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-orange-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200">
            <TableHead className="text-sm font-semibold text-gray-700 px-6 py-4">
              Community
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 px-6 py-4 hidden md:table-cell">
              Description
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 px-6 py-4">
              Location
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 px-6 py-4 hidden lg:table-cell">
              Admin
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 px-6 py-4">
              Created
            </TableHead>
            <TableHead className="text-sm font-semibold text-gray-700 px-6 py-4 text-right">
              {showActions ? "Actions" : "Status"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {communities.map((community, index) => {
            const location = [
              community.city,
              community.state || community.countryState,
            ]
              .filter(Boolean)
              .join(", ");

            return (
              <TableRow
                key={community._id}
                className={`hover:bg-orange-50/30 transition-colors ${
                  index % 2 === 1 ? "bg-gray-50/50" : ""
                }`}
                data-testid={`row-community-${community._id}`}
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {community.banner ? (
                        <img
                          src={community.banner}
                          alt={community.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Globe className="h-5 w-5 text-orange-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {truncateText(community.name, 30)}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1 gap-1">
                        <Globe className="h-3 w-3" />
                        {community.domain}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-500">
                    {truncateText(community.description, 100)}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm text-gray-700">{location || "N/A"}</p>
                </TableCell>
                <TableCell className="px-6 py-4 hidden lg:table-cell">
                  <p className="text-sm text-gray-700">
                    {community._communityAdminid?.name || "N/A"}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="text-sm text-gray-700">
                    {formatDate(community.created_at)}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  {showActions ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => onReject?.(community._id, e)}
                        disabled={isPending}
                        className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        data-testid={`button-reject-${community._id}`}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                      <button
                        onClick={(e) => onApprove?.(community._id, e)}
                        disabled={isPending}
                        className="px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        data-testid={`button-approve-${community._id}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Accept
                      </button>
                    </div>
                  ) : (
                    <>
                      {community.status === "approved" && (
                        <Badge className="bg-green-500 text-white border-0 gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Approved
                        </Badge>
                      )}
                      {community.status === "rejected" && (
                        <Badge className="bg-red-500 text-white border-0 gap-1">
                          <XCircle className="h-3 w-3" />
                          Rejected
                        </Badge>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
