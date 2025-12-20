import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table";
import {
  Search,
  Shield,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Filter,
  Plus,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  rolesHaving: string[];
  isActive: boolean;
  [key: string]: any;
};

export default function TeamsPage() {
  const [, navigate] = useLocation();
  const [usersData, setUsersData] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://indian-community-beta.vercel.app/api/user/all-admin",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsersData(data);
          setFilteredUsers(data);
        } else {
          console.error("Failed to fetch users: Response not OK");
        }
      } catch (error) {
        console.error("Failed to fetch or validate users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and role
  useEffect(() => {
    let filtered = usersData;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((user) =>
        user.rolesHaving?.includes(roleFilter)
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, usersData]);

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "superuser":
        return "bg-purple-600 text-white";
      case "admin":
        return "bg-orange-600 text-white";
      case "moderator":
        return "bg-blue-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "superuser":
        return Shield;
      case "admin":
        return Shield;
      default:
        return null;
    }
  };

  const uniqueRoles = Array.from(
    new Set(usersData.flatMap((user) => user.rolesHaving || []))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-orange-50/30 dark:from-background dark:to-orange-950/10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-orange-200/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 rounded-lg hover:bg-orange-100 transition-colors text-orange-600"
                title="Go back to dashboard"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Admin Team
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your administration team and permissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-1">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading team members...</p>
            </div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6 border-orange-200/50">
                <p className="text-sm text-muted-foreground mb-2">
                  Total Members
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {usersData.length}
                </p>
              </Card>
              <Card className="p-6 border-orange-200/50">
                <p className="text-sm text-muted-foreground mb-2">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {usersData.filter((u) => u.isActive).length}
                </p>
              </Card>
              <Card className="p-6 border-orange-200/50">
                <p className="text-sm text-muted-foreground mb-2">Superusers</p>
                <p className="text-3xl font-bold text-purple-600">
                  {
                    usersData.filter((u) =>
                      u.rolesHaving?.includes("superuser")
                    ).length
                  }
                </p>
              </Card>
              <Card className="p-6 border-orange-200/50">
                <p className="text-sm text-muted-foreground mb-2">Admins</p>
                <p className="text-3xl font-bold text-orange-600">
                  {
                    usersData.filter((u) => u.rolesHaving?.includes("admin"))
                      .length
                  }
                </p>
              </Card>
            </div>

            {/* Data Table */}
            <Card className="p-6 border-orange-200/50">
              <DataTable data={filteredUsers} />
            </Card>
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed border-orange-200/50">
            <Shield className="h-12 w-12 text-orange-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No team members found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || roleFilter
                ? "Try adjusting your search or filter criteria"
                : "No admin team members yet. Add your first team member to get started."}
            </p>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
