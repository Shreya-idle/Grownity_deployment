import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Analytics() {
  const analyticsData = {
    overview: {
      totalCommunities: 5234,
      totalMembers: 156789,
      totalEvents: 1234,
      activeUsers: 25000,
      newCommunities: 234,
      newMembers: 5678,
    },
    growth: {
      communities: "+15%",
      members: "+25%",
      events: "+40%",
      monthly: [
        { month: "Jan", communities: 4500, members: 135000 },
        { month: "Feb", communities: 4700, members: 142000 },
        { month: "Mar", communities: 4850, members: 148000 },
        { month: "Apr", communities: 5000, members: 152000 },
        { month: "May", communities: 5234, members: 156789 },
      ],
    },
    engagement: {
      averageSessionTime: "12m",
      returnRate: "68%",
      eventParticipation: "45%",
      topCategories: [
        { name: "Technology", percentage: 40 },
        { name: "Business", percentage: 25 },
        { name: "Design", percentage: 15 },
        { name: "Marketing", percentage: 12 },
        { name: "Others", percentage: 8 },
      ],
    },
    demographics: {
      locations: [
        { city: "Bangalore", percentage: 30 },
        { city: "Mumbai", percentage: 25 },
        { city: "Delhi", percentage: 20 },
        { city: "Hyderabad", percentage: 15 },
        { city: "Others", percentage: 10 },
      ],
      ageGroups: [
        { group: "18-24", percentage: 20 },
        { group: "25-34", percentage: 45 },
        { group: "35-44", percentage: 25 },
        { group: "45+", percentage: 10 },
      ],
    },
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Analytics"
        description="Platform statistics and insights"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Communities
          </h3>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-bold">
              {analyticsData.overview.totalCommunities.toLocaleString()}
            </p>
            <Badge variant="secondary" className="text-green-600">
              {analyticsData.growth.communities}
            </Badge>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Members
          </h3>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-bold">
              {analyticsData.overview.totalMembers.toLocaleString()}
            </p>
            <Badge variant="secondary" className="text-green-600">
              {analyticsData.growth.members}
            </Badge>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Users
          </h3>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-bold">
              {analyticsData.overview.activeUsers.toLocaleString()}
            </p>
            <Badge variant="secondary">
              {analyticsData.engagement.returnRate} return rate
            </Badge>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="growth">
        <TabsList>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
            <div className="h-[300px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.growth.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="communities"
                      stroke="#4f46e5"
                    />
                    <Line type="monotone" dataKey="members" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Category Distribution
              </h3>
              <div className="h-[300px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.engagement.topCategories}
                        dataKey="percentage"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {analyticsData.engagement.topCategories.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Avg. Session Time
                  </h4>
                  <p className="text-2xl font-bold mt-1">
                    {analyticsData.engagement.averageSessionTime}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Return Rate
                  </h4>
                  <p className="text-2xl font-bold mt-1">
                    {analyticsData.engagement.returnRate}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Event Participation
                  </h4>
                  <p className="text-2xl font-bold mt-1">
                    {analyticsData.engagement.eventParticipation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="mt-6">
          <div className="grid gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Location Distribution
              </h3>
              <div className="h-[300px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.demographics.locations}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="city" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
              <div className="h-[300px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.demographics.ageGroups}
                        dataKey="percentage"
                        nameKey="group"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {analyticsData.demographics.ageGroups.map(
                          (entry, idx) => (
                            <Cell key={idx} />
                          )
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
