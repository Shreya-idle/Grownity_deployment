import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommunityCard } from "@/components/community-card";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  Home,
  User,
  Heart,
  Settings,
  Users,
  Calendar,
  Upload,
  MessageSquare,
  BarChart,
  Sparkles,
  ChevronRight,
  Bell,
  Search,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";



function DashboardSidebar({
  activeTab,
  onTabChange,
  isOrganizer,
  user,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOrganizer: boolean;
  user: any;
}) {
  const userMenuItems = [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "My Community", icon: Heart, id: "saved" },
    { title: "My Events", icon: Calendar, id: "events" },
    { title: "Settings", icon: Settings, id: "settings" },
  ];

  const organizerMenuItems = [
    { title: "Dashboard", icon: Home, id: "dashboard" },
    { title: "Community Joined", icon: Users, id: "communities" },
    { title: "Events", icon: Calendar, id: "org-events" },
    { title: "Analytics", icon: BarChart, id: "analytics" },
    { title: "Messages", icon: MessageSquare, id: "messages" },
    { title: "Settings", icon: Settings, id: "settings" },
  ];

  const menuItems = isOrganizer ? organizerMenuItems : userMenuItems;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Community</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <Separator className="mx-4 w-auto" />

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {isOrganizer ? "Organizer Menu" : "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeTab === item.id}
                    className="transition-all duration-200"
                  >
                    <button
                      onClick={() => onTabChange(item.id)}
                      className="w-full cursor-pointer"
                      data-testid={`nav-${item.id}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {activeTab === item.id && (
                        <ChevronRight className="ml-auto h-4 w-4 text-primary" />
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src={user?.photoURL} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {user?.name?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [achievements, setAchievements] = useState("");

  const [savedCommunities, setSavedCommunities] = useState<any[]>([]);
  const [organizerCommunities, setOrganizerCommunities] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserAndCommunities = async () => {
      try {
        const userResponse = await fetch("/api/user", {
          credentials: "include",
        });

        if (!userResponse.ok) {
          console.error("Failed to fetch user:", userResponse.statusText);
          return;
        }

        const userData = await userResponse.json();
        setUser(userData.user);
        setDisplayName(userData.user.name || "");
        setEmail(userData.user.email || "");

        const isUserAdmin =
          userData.user.isSuperUser ||
          (userData.user.rolesHaving &&
            (userData.user.rolesHaving.includes("admin") ||
              userData.user.rolesHaving.includes("superuser")));
        setIsAdmin(isUserAdmin);

        const isUserOrganizer =
          userData.user.rolesHaving &&
          (userData.user.rolesHaving.includes("organizer") ||
            userData.user.rolesHaving.includes("admin") ||
            userData.user.rolesHaving.includes("superuser"));
        setIsOrganizer(isUserOrganizer || false);

        const userCommunitiesResp = await fetch(
          "/api/communities/user-communities",
          { credentials: "include" }
        );

        if (userCommunitiesResp.ok) {
          const communitiesData = await userCommunitiesResp.json();
          setSavedCommunities(
            Array.isArray(communitiesData.joined) ? communitiesData.joined : []
          );
          setOrganizerCommunities(
            Array.isArray(communitiesData.created) ? communitiesData.created : []
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchUserAndCommunities();
  }, []);

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDob = e.target.value;
    setDob(newDob);
    if (newDob) {
      const birthDate = new Date(newDob);
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        years--;
      }
      setAge(String(years));
    } else {
      setAge("");
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResume(e.target.files[0]);
    }
  };

  const handleUpdateProfile = () => {
    console.log("Updated Profile:", {
      displayName,
      email,
      gender,
      dob,
      age,
      resume,
      achievements,
    });
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3.5rem",
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 p-8 md:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full translate-y-1/3 -translate-x-1/4" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    <Zap className="h-3 w-3 mr-1" />
                    Welcome back
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  Hello, {user?.name || "User"}! <span className="inline-block animate-wave">👋</span>
                </h1>
                <p className="text-white/80 text-lg max-w-xl leading-relaxed">
                  Explore amazing communities and stay connected with your interests
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatsCard
                title="Communities Created"
                value={organizerCommunities.length}
                icon={Heart}
                trend={{ value: "+2 this month", positive: true }}
              />
              <StatsCard
                title="Upcoming Events"
                value={5}
                icon={Calendar}
                subtitle="Next week: 2 events"
              />
              <StatsCard
                title="Community Members"
                value="2.4K+"
                icon={Users}
                trend={{ value: "+156", positive: true }}
                subtitle={`across ${savedCommunities.length || 0} communities`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Communities Created</h2>
                  <p className="text-muted-foreground mt-1">
                    Communities you've created and manage
                  </p>
                </div>
              </div>

              {organizerCommunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {organizerCommunities.map((community, index) => (
                    <div
                      key={community._id || community.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-fade-in"
                    >
                      <CommunityCard {...community} />
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center border-dashed border-2">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary/60" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No communities yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start exploring and save your favorite communities
                  </p>
                  <Button
                    onClick={() => navigate("/explore")}
                    data-testid="button-explore-communities"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Explore Communities
                  </Button>
                </Card>
              )}
            </div>
          </div>
        );

      case "communities":
        return (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Community Joined</h2>
              <p className="text-muted-foreground">
                Manage and monitor your communities
              </p>
            </div>
            <div className="space-y-4">
              {organizerCommunities.map((community, index) => (
                <Card
                  key={community.id || community._id}
                  className="p-5 border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-md animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-testid={`card-community-item-${community.id}`}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-lg font-bold text-white shrink-0">
                        {community.name?.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {community.name}
                          </h3>
                          <Badge
                            className={`shrink-0 ${
                              community.status === "verified"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                            }`}
                          >
                            {community.status === "verified" ? "Verified" : "Pending"}
                          </Badge>
                          {community.domain && (
                            <Badge variant="secondary" className="shrink-0">
                              {community.domain}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Users className="h-4 w-4 text-primary/70" />
                          <span className="font-medium">
                            {(community.members?.length || community.memberCount || 0).toLocaleString()}
                          </span>
                          <span>members</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-edit-${community.id}`} className="border-orange-600 text-orange-600 hover:bg-orange-50">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`button-analytics-${community.id}`} className="border-orange-600 text-orange-600 hover:bg-orange-50">
                        Analytics
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "saved":
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">My Community</h1>
              <p className="text-muted-foreground">
                Communities you're following and interested in
              </p>
            </div>

            {savedCommunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedCommunities.map((community, index) => (
                  <div
                    key={community._id || community.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-fade-in"
                  >
                    <CommunityCard {...community} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-dashed border-2">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary/60" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No saved communities yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start exploring and save your favorite communities
                </p>
                <Button onClick={() => navigate("/explore")} className="bg-orange-600 hover:bg-orange-700 text-white">
                  Explore Communities
                </Button>
              </Card>
            )}
          </div>
        );

      case "events":
      case "org-events":
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">
                {isOrganizer ? "Organize" : "My"} Events
              </h1>
              <p className="text-muted-foreground">
                {isOrganizer
                  ? "Manage your community events"
                  : "Events you're attending or interested in"}
              </p>
            </div>

            <Card className="p-12 text-center border-dashed border-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {isOrganizer
                  ? "Create your first event to get started"
                  : "Join communities to discover and register for events"}
              </p>
              <Button
                onClick={() => navigate(isOrganizer ? "/register" : "/explore")}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isOrganizer ? "Create Event" : "Explore Communities"}
              </Button>
            </Card>
          </div>
        );

      case "analytics":
        return (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Analytics</h2>
              <p className="text-muted-foreground">Track your community performance</p>
            </div>
            <Card className="p-12 text-center border-dashed border-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                We're building powerful analytics tools to help you understand your community better.
              </p>
            </Card>
          </div>
        );

      case "messages":
        return (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Messages</h2>
              <p className="text-muted-foreground">Communicate with your community members</p>
            </div>
            <Card className="p-12 text-center border-dashed border-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary/60" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Messages Coming Soon</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Stay tuned for our messaging feature to connect with your community.
              </p>
            </Card>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account profile and preferences
              </p>
            </div>

            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-8 border-b">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {user?.name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button data-testid="button-change-avatar" className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="displayName" className="text-sm font-medium">
                      Display Name
                    </Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-2"
                      placeholder="Your display name"
                      data-testid="input-display-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={user?.email?.split("@")[0] || "alexjohnson"}
                      disabled
                      className="mt-2 bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Usernames cannot be changed.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="mt-2 bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Contact support to change your email.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="gender" className="text-sm font-medium">
                      Gender
                    </Label>
                    <Input
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="mt-2"
                      placeholder="Select gender"
                      data-testid="input-gender"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob" className="text-sm font-medium">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={handleDobChange}
                      className="mt-2"
                      data-testid="input-dob"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-sm font-medium">
                      Age
                    </Label>
                    <Input
                      id="age"
                      value={age}
                      disabled
                      className="mt-2 bg-muted"
                      placeholder="Calculated"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="resume" className="text-sm font-medium">
                    Resume / Portfolio
                  </Label>
                  <Input
                    id="resume"
                    type="file"
                    onChange={handleResumeChange}
                    className="mt-2"
                    accept=".pdf,.doc,.docx"
                    data-testid="input-resume"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    PDF, DOC, or DOCX. Max size 5MB.
                  </p>
                </div>

                <div>
                  <Label htmlFor="achievements" className="text-sm font-medium">
                    Achievements & Bio
                  </Label>
                  <textarea
                    id="achievements"
                    value={achievements}
                    onChange={(e) => setAchievements(e.target.value)}
                    className="mt-2 w-full min-h-[100px] px-3 py-2 rounded-md border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Tell us about your achievements and interests..."
                    data-testid="textarea-achievements"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleUpdateProfile} data-testid="button-update-profile" className="bg-orange-600 hover:bg-orange-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOrganizer={isOrganizer}
          user={user}
        />

        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              {/* <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg"> */}
                {/* <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-0 text-sm outline-none w-48 placeholder:text-muted-foreground"
                  data-testid="input-search"
                /> */}
              {/* </div> */}
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Button
                  onClick={() => navigate("/admin/dashboard")}
                  variant="ghost"
                  className="text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                  data-testid="button-admin-panel"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button variant="ghost" size="icon" data-testid="button-notifications">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </Button>
              <ThemeToggle />
            </div>
          </header>

          <ScrollArea className="flex-1">
            <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
              {renderTabContent()}
            </main>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}
