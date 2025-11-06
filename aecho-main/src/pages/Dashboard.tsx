import { Users, Briefcase, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Active Clients",
    value: "124",
    change: "+12% from last month",
    icon: Users,
    color: "text-[hsl(var(--stat-blue))]",
  },
  {
    title: "Open Engagements",
    value: "38",
    change: "+5% from last month",
    icon: Briefcase,
    color: "text-[hsl(var(--stat-blue))]",
  },
  {
    title: "Hours This Month",
    value: "2,847",
    change: "+18% from last month",
    icon: Clock,
    color: "text-[hsl(var(--stat-blue))]",
  },
  {
    title: "Revenue Growth",
    value: "23%",
    change: "+3% from last month",
    icon: TrendingUp,
    color: "text-[hsl(var(--stat-green))]",
  },
];

const quickActions = [
  {
    title: "Create New Engagement",
    description: "Start a new client engagement",
    action: "/engagements",
  },
  {
    title: "Log Time",
    description: "Record billable hours",
    action: "/case-time",
  },
  {
    title: "Generate Invoice",
    description: "Create client invoices",
    action: "/invoices",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your organization's performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-[hsl(var(--stat-green))] mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
