import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import Navbar from "@/components/navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import PrivateRoute from "@/components/Routes/PrivateRoute";

import CommunityDetail from "@/pages/community-detail";
import CommunityRegistration from "@/pages/community-registration";
import DashboardUser from "@/pages/dashboard-user";

import About from "@/pages/about";
import { SearchResults } from "@/pages/SearchResults";
import NewDashboard from "@/dashboard/page";
// import NavItem from "@/components/navbar";
import Analytics from "@/pages/analytics";
import TeamsPage from "@/pages/teams";

import CallForProposals from "./pages/call-for-proposals";
import ProposalForm from "./pages/proposals-form";
import ProtectedRoute from "./components/protected-route";
import EditCommunityPage from "./pages/edit-community";
import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { createContext, useState, useContext, ReactNode } from "react";
import Volunteer from "./pages/Volunteer";
import SpeakerForm from "./pages/speaker";
import SponsorForm from "./pages/Sponsor";
import ShowcaseZone from "./pages/ShowcaseZone";
import CodeOfConduct from "./pages/code-of-conduct";
import CommunityPartnerForm from "./pages/CommunityPartner";

function Router() {


  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/register" component={CommunityRegistration} />
      <Route path="/communities/search" component={SearchResults} />
      <Route path="/community/:id" component={CommunityDetail} />
      <Route path="/about" component={About} />
      <Route path="/community/edit/:id">
        {(params) => (
          <ProtectedRoute
            path={`/community/edit/${params.id}`}
            component={EditCommunityPage}
          />
        )}
      </Route>
      <Route path="/volunteer">
        <Volunteer />
      </Route>
      <Route path="/speaker">
        <SpeakerForm />
      </Route>
      <Route path="/sponsor">
        <SponsorForm />
      </Route>
      <Route path="/showcase">
        <ShowcaseZone />
      </Route>
      <Route path="/community-partner">
        <CommunityPartnerForm />
      </Route>
      <Route path="/code-of-conduct" component={CodeOfConduct} />
      <Route path="/user/dashboard" component={DashboardUser} />

      <PrivateRoute path="/admin/dashboard" component={NewDashboard} allowedRoles={["superuser","admin"]} />


      <PrivateRoute
        path="/admin/dashboard/team"
        component={TeamsPage}
        allowedRoles={["superuser" , "team"]}
      />

      <PrivateRoute
        path="/admin/dashboard/analytics"
        component={Analytics}
        allowedRoles={["superuser","analytics"]}
      />

      <PrivateRoute path="/admin/dashboard/proposals" component={CallForProposals} allowedRoles={["superuser","admin"]} />
      <PrivateRoute path="/admin/dashboard/proposals/form" component={ProposalForm} allowedRoles={["superuser", "admin"]} />

      {/* Admin Edit Routes */}
      <PrivateRoute path="/admin/edit/volunteer/:id" allowedRoles={["superuser", "admin"]}>
        {(params: any) => <Volunteer isAdmin={true} id={params.id} />}
      </PrivateRoute>
      <PrivateRoute path="/admin/edit/speaker/:id" allowedRoles={["superuser", "admin"]}>
        {(params: any) => <SpeakerForm isAdmin={true} id={params.id} />}
      </PrivateRoute>
      <PrivateRoute path="/admin/edit/sponsor/:id" allowedRoles={["superuser", "admin"]}>
        {(params: any) => <SponsorForm isAdmin={true} id={params.id} />}
      </PrivateRoute>
      <PrivateRoute path="/admin/edit/showcase/:id" allowedRoles={["superuser", "admin"]}>
        {(params: any) => <ShowcaseZone isAdmin={true} id={params.id} />}
      </PrivateRoute>
      <PrivateRoute path="/admin/edit/community-partner/:id" allowedRoles={["superuser", "admin"]}>
        {(params: any) => <CommunityPartnerForm isAdmin={true} id={params.id} />}
      </PrivateRoute>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div
              className={`flex-1 transition-all duration-300 ${
                isSidebarOpen ? "ml-64" : "ml-0"
              }`}
            >
              <Header toggleSidebar={toggleSidebar} />
              <main className="pt-16">
                <Router />
              </main>
            </div>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
