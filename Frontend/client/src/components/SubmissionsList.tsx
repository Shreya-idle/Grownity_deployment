import React, { useEffect, useState } from "react";

type Submission = {
  _id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  preferredRole?: string;
  organization?: string;
  communityName?: string;
  topic?: string;
  startupName?: string;
  sponsorshipLevel?: string;
};

type SubmissionsListProps = {
  apiEndpoint: string;
  title: string;
  showRole?: boolean;
  roleField?: string;
  filterStatus?: string;
};

export default function SubmissionsList({ 
  apiEndpoint, 
  title, 
  showRole = false,
  roleField = "preferredRole",
  filterStatus
}: SubmissionsListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (response.ok) {
          let data = await response.json();
          if (filterStatus) {
            data = data.filter((s: Submission) => s.status === filterStatus);
          }
          setSubmissions(data);
        } else {
          setError("Failed to load submissions");
        }
      } catch (err) {
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [apiEndpoint]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mt-8 p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="mt-8 p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-500">No submissions yet. Be the first to apply!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">
        Total: {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
      </p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-slate-700">
              <th className="text-left py-3 px-2 font-medium">Name</th>
              {showRole && <th className="text-left py-3 px-2 font-medium">Role/Area</th>}
              <th className="text-left py-3 px-2 font-medium">Status</th>
              <th className="text-left py-3 px-2 font-medium">Applied On</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission._id} className="border-b dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-2">
                  <div className="font-medium">{submission.name}</div>
                  <div className="text-xs text-gray-500">
                    {submission.organization || submission.communityName || submission.startupName || ""}
                  </div>
                </td>
                {showRole && (
                  <td className="py-3 px-2">
                    {(submission as any)[roleField] || "-"}
                  </td>
                )}
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status?.charAt(0).toUpperCase() + submission.status?.slice(1) || "Pending"}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-500">
                  {formatDate(submission.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
