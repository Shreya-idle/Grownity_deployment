// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { ThemeToggle } from "@/components/theme-toggle";
// import { StatsCard } from "@/components/stats-card";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useLocation } from "wouter";
// import { useState, useEffect } from "react";
// import {
//   Home,
//   Users,
//   BarChart,
//   Settings,
//   Plus,
//   Shield,
//   Eye,
//   MessageSquare,
//   Calendar,
//   TrendingUp,
// } from "lucide-react";

// function OrganizerDashboardSidebar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
//   const menuItems = [
//     { title: "Dashboard", icon: Home, id: "dashboard" },
//     { title: "My Communities", icon: Users, id: "communities" },
//     { title: "Events", icon: Calendar, id: "events" },
//     { title: "Analytics", icon: BarChart, id: "analytics" },
//     { title: "Messages", icon: MessageSquare, id: "messages" },
//     { title: "Settings", icon: Settings, id: "settings" },
//   ];

//   return (
//     <Sidebar className="border-r border-orange-200/30">
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel className="text-orange-600 font-semibold">Organizer</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {menuItems.map((item) => (
//                 <SidebarMenuItem key={item.id}>
//                   <SidebarMenuButton asChild>
//                     <button
//                       onClick={() => onTabChange(item.id)}
//                       className={`w-full cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/30 ${
//                         activeTab === item.id ? "bg-orange-100 dark:bg-orange-950/50" : ""
//                       }`}
//                       data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
//                     >
//                       <item.icon className="text-orange-600" />
//                       <span>{item.title}</span>
//                     </button>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }

// export default function DashboardOrganizer() {
//   const [, navigate] = useLocation();
//   const [user, setUser] = useState<any>(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [activeTab, setActiveTab] = useState("dashboard");

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch("https://indian-community-beta.vercel.app//api/user", {
//           credentials: "include",
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setUser(data.user);
//           const isUserAdmin =
//             data.user.isSuperUser ||
//             (data.user.rolesHaving &&
//               (data.user.rolesHaving.includes("admin") ||
//                 data.user.rolesHaving.includes("superuser")));
//           setIsAdmin(isUserAdmin);
//         }
//       } catch (error) {
//         console.error("Failed to fetch user:", error);
//       }
//     };
//     fetchUser();
//   }, []);

//   const style = {
//     "--sidebar-width": "16rem",
//   };

//   const communities = [
//     {
//       id: "1",
//       name: "Tech Innovators Mumbai",
//       status: "verified",
//       members: 1250,
//       views: 5432,
//       domain: "Technology",
//       growth: "+12%",
//     },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "communities":
//         return (
//           <div>
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold mb-2">My Communities</h2>
//               <p className="text-muted-foreground">Manage and monitor your communities</p>
//             </div>
//             <div className="space-y-4">
//               {communities.map((community) => (
//                 <Card key={community.id} className="p-6 border-orange-200/50 hover:border-orange-300/70 transition-all hover:shadow-md">
//                   <div className="flex items-center justify-between gap-4">
//                     <div className="flex items-start gap-4 flex-1">
//                       <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
//                         TI
//                       </div>
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2">
//                           <h3 className="font-bold text-lg text-foreground">{community.name}</h3>
//                           <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
//                             {community.status === "verified" ? "✓ Verified" : "Pending"}
//                           </Badge>
//                           <Badge variant="outline" className="text-orange-600 border-orange-200">
//                             {community.domain}
//                           </Badge>
//                         </div>
//                         <div className="flex items-center gap-6 text-sm">
//                           <div className="flex items-center gap-2 text-muted-foreground">
//                             <Users className="h-4 w-4 text-orange-500" />
//                             <span className="font-medium">{community.members.toLocaleString()}</span>
//                             <span>members</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-muted-foreground">
//                             <Eye className="h-4 w-4 text-orange-500" />
//                             <span className="font-medium">{community.views.toLocaleString()}</span>
//                             <span>views</span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <TrendingUp className="h-4 w-4 text-green-500" />
//                             <span className="font-medium text-green-600">{community.growth}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50 hover:border-orange-300">
//                         Edit
//                       </Button>
//                       <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-50 hover:border-orange-300">
//                         Analytics
//                       </Button>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         );
//       case "settings":
//         return (
//           <div>
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold mb-2">Settings</h2>
//               <p className="text-muted-foreground">Manage your organizer profile and preferences</p>
//             </div>
//             <div className="grid gap-6 max-w-2xl">
//               <Card className="p-6 border-orange-200/50">
//                 <h3 className="font-semibold mb-4">Profile Information</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-sm font-medium">Display Name</label>
//                     <input type="text" className="w-full mt-1 px-3 py-2 border border-orange-200 rounded-lg" />
//                   </div>
//                   <div>
//                     <label className="text-sm font-medium">Email</label>
//                     <input type="email" className="w-full mt-1 px-3 py-2 border border-orange-200 rounded-lg" />
//                   </div>
//                 </div>
//               </Card>
//               <Card className="p-6 border-orange-200/50">
//                 <h3 className="font-semibold mb-4">Preferences</h3>
//                 <div className="space-y-4">
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" className="rounded" defaultChecked />
//                     <span className="text-sm">Email notifications for new member requests</span>
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" className="rounded" defaultChecked />
//                     <span className="text-sm">Weekly community analytics digest</span>
//                   </label>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         );
//       case "events":
//       case "analytics":
//       case "messages":
//         return (
//           <div>
//             <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h2>
//             <Card className="p-8 text-center border-orange-200/50">
//               <p className="text-muted-foreground">Coming soon</p>
//             </Card>
//           </div>
//         );
//       default:
//         return (
//           <div className="space-y-8">
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold text-foreground">Organizer Dashboard</h1>
//               <p className="text-muted-foreground mt-2">
//                 Manage your communities, track performance, and engage with members
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <StatsCard title="Total Members" value="12,543" change="+8% this month" icon={Users} />
//               <StatsCard title="Total Views" value="54,321" change="+15% from last month" icon={Eye} />
//               <StatsCard title="Active Events" value="8" change="2 this week" icon={Calendar} />
//               <StatsCard title="Engagement" value="87%" change="+5% trending up" icon={TrendingUp} />
//             </div>

//             <Card className="p-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200/50">
//               <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <Button variant="outline" className="h-auto py-4 border-orange-200 hover:bg-white hover:border-orange-300">
//                   <div className="text-center">
//                     <Plus className="h-5 w-5 mx-auto mb-2 text-orange-600" />
//                     <span className="text-sm font-medium">Create Event</span>
//                   </div>
//                 </Button>
//                 <Button variant="outline" className="h-auto py-4 border-orange-200 hover:bg-white hover:border-orange-300">
//                   <div className="text-center">
//                     <MessageSquare className="h-5 w-5 mx-auto mb-2 text-orange-600" />
//                     <span className="text-sm font-medium">Messages</span>
//                   </div>
//                 </Button>
//                 <Button variant="outline" className="h-auto py-4 border-orange-200 hover:bg-white hover:border-orange-300">
//                   <div className="text-center">
//                     <Users className="h-5 w-5 mx-auto mb-2 text-orange-600" />
//                     <span className="text-sm font-medium">Manage Members</span>
//                   </div>
//                 </Button>
//                 <Button variant="outline" className="h-auto py-4 border-orange-200 hover:bg-white hover:border-orange-300">
//                   <div className="text-center">
//                     <BarChart className="h-5 w-5 mx-auto mb-2 text-orange-600" />
//                     <span className="text-sm font-medium">View Reports</span>
//                   </div>
//                 </Button>
//               </div>
//             </Card>
//           </div>
//         );
//     }
//   };

//   return (
//     <SidebarProvider style={style as React.CSSProperties}>
//       <div className="flex h-screen w-full bg-gradient-to-br from-background to-orange-50/30 dark:from-background dark:to-orange-950/10">
//         <OrganizerDashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
//         <div className="flex flex-col flex-1">
//           <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-orange-200/30">
//             <div className="flex items-center justify-between px-6 py-4">
//               <div className="flex items-center gap-2">
//                 <SidebarTrigger data-testid="button-sidebar-toggle" />
//               </div>
//               <div className="flex items-center gap-3">
//                 {isAdmin && (
//                   <Button
//                     onClick={() => navigate("/admin/dashboard")}
//                     variant="ghost"
//                     className="text-orange-600 hover:bg-orange-50"
//                   >
//                     <Shield className="h-4 w-4 mr-2" />
//                     Admin Panel
//                   </Button>
//                 )}
//                 <Button
//                   onClick={() => navigate("/register")}
//                   className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
//                   data-testid="button-add-community"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   New Community
//                 </Button>
//                 <ThemeToggle />
//               </div>
//             </div>
//           </header>

//           <main className="flex-1 overflow-auto">
//             <div className="max-w-7xl mx-auto px-6 py-8">
//               {renderTabContent()}
//             </div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }
