import { useLocation } from "wouter";
import { useQuery } from "react-query";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Settings,
  BarChart3,
  Gift,
  FileText,
  Shield,
  Bell,
  ArrowRight,
  Home,
  Loader2,
  AlertCircle,
} from "lucide-react";

// --- Types ---
type DashboardStats = {
  totalCommunities: number;
  pendingApprovals: number;
  activeEvents: number;
  teamMembers: number;
};

type Activity = {
  type: "approval" | "submission";
  title: string;
  description: string;
  time: string;
  icon?: string;
};

const getStats = async (): Promise<DashboardStats> => {
  const res = await fetch(
    "https://indian-community-beta.vercel.app/api/super_user/stats",
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch stats");
  const arr = await res.json();

  const findValue = (label: string) => {
    const it = (arr || []).find((x: any) => x.label === label);
    return it ? Number(it.value ?? 0) : 0;
  };

  return {
    totalCommunities: findValue("Total Communities"),
    pendingApprovals: findValue("Pending Approvals"),
    activeEvents: findValue("Active Events"),
    teamMembers: findValue("Team Members"),
  };
};

const getRecentActivity = async (): Promise<Activity[]> => {
  const res = await fetch(
    "https://indian-community-beta.vercel.app/api/super_user/recent-activity",
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch recent activity");
  const data = await res.json();
  return data as Activity[];
};

const iconMap: Record<string, any> = {
  CheckCircle,
  FileText,
  Bell,
};

const getActivityColor = (type: Activity["type"]) => {
  switch (type) {
    case "approval":
      return "bg-green-100 text-green-700";
    case "submission":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useQuery("dashboardStats", getStats);

  const {
    data: recentActivityData,
    isLoading: isLoadingActivity,
    isError: isErrorActivity,
  } = useQuery("recentActivity", getRecentActivity);

  // Build KPI cards by reading from statsData (safe defaults)
  const stats = [
    {
      label: "Total Communities",
      value: statsData?.totalCommunities ?? "...",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Pending Approvals",
      value: statsData?.pendingApprovals ?? "...",
      icon: Clock,
      color: "from-orange-500 to-amber-500",
      action: true,
    },
    {
      label: "Active Events",
      value: statsData?.activeEvents ?? "...",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Team Members",
      value: statsData?.teamMembers ?? "...",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const quickActions = [
    {
      title: "Manage Proposals",
      description:
        "Review and approve volunteer, speaker & sponsor submissions",
      icon: Gift,
      color: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      count: "-",
      action: () => navigate("/admin/dashboard/proposals"),
    },
    {
      title: "Community Approvals",
      description: "Review and approve pending community registrations",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      count: statsData?.pendingApprovals ?? "...",
      action: () => navigate("/admin/dashboard/approvals"),
    },
    {
      title: "Admin Team",
      description: "Manage team members and their permissions",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      count: statsData?.teamMembers ?? "...",
      action: () => navigate("/admin/dashboard/team"),
    },
    {
      title: "Analytics",
      description: "View detailed analytics and performance metrics",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      count: "-",
      action: () => navigate("/admin/dashboard/analytics"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-50/20 to-amber-50/10">
      {/* Header Section */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-orange-200/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Home className="h-6 w-6 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Welcome back! Here's an overview of your platform's performance and
            pending tasks.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card
                key={idx}
                className="p-6 border-orange-200/50 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <div className="text-3xl font-bold text-gray-900">
                      {isLoadingStats ? (
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                      ) : isErrorStats ? (
                        "Error"
                      ) : (
                        stat.value
                      )}
                    </div>
                    {stat.action && (
                      <p className="text-xs text-orange-600 font-medium mt-3">
                        Action required →
                      </p>
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Card
                  key={idx}
                  className={`p-6 border-orange-200/50 hover:border-orange-400 hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br ${action.bgGradient}`}
                  onClick={action.action}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {action.count !== "-" && (
                      <Badge className="bg-orange-600 text-white">
                        {isLoadingStats ? "..." : action.count}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white group-hover:shadow-lg transition-all"
                    onClick={action.action}
                  >
                    Open
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Platform Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-orange-200/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
                <Button variant="ghost" size="sm" className="text-orange-600">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {isLoadingActivity ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                  </div>
                ) : isErrorActivity ? (
                  <div className="flex flex-col items-center justify-center h-32 text-red-600">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>Could not load recent activity.</p>
                  </div>
                ) : (
                  recentActivityData?.map((activity, idx) => {
                    const ActivityIcon =
                      iconMap[activity.icon ?? "FileText"] ?? FileText;
                    return (
                      <div
                        key={`${activity.time}-${idx}`}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-orange-50/50 transition-colors border border-orange-100/50"
                      >
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 ${getActivityColor(
                            activity.type
                          )}`}
                        >
                          <ActivityIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {formatDistanceToNow(
                            new Date(activity.time ?? Date.now()),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Platform Summary */}
          <div className="space-y-4">
            <Card className="p-6 border-orange-200/50 bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold text-gray-900">Platform Growth</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Communities</span>
                    <span className="font-semibold text-green-600">+12%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-500 w-3/4" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Events</span>
                    <span className="font-semibold text-blue-600">+18%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-4/5" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Members</span>
                    <span className="font-semibold text-purple-600">+15%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 w-3/4" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-orange-200/50 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">System Status</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700">
                    All systems operational
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700">
                    Database connected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700">API responding</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-orange-200/50 bg-gradient-to-br from-purple-50 to-pink-50">
              <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-purple-700 hover:bg-purple-100"
                  onClick={() => navigate("/admin/dashboard/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-purple-700 hover:bg-purple-100"
                  onClick={() => navigate("/")}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
