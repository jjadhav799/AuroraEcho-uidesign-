import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Building2, FolderKanban, Search, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

// ===== Dummy Engagement Directory Data =====
type EngagementRow = {
  id: number;
  hCode: string;
  name: string;
  description: string;
  projects: number;
  users: number;
  status: "Active" | "Inactive" | "Pending";
};

const mockEngagements: EngagementRow[] = [
  {
    id: 1,
    hCode: "H-1001",
    name: "Mobile App Modernization",
    description: "Refactor legacy app to improve performance & UX",
    projects: 4,
    users: 12,
    status: "Active",
  },
  {
    id: 2,
    hCode: "H-1002",
    name: "Claims ETL Revamp",
    description: "Rebuild ETL pipeline with observability & governance",
    projects: 3,
    users: 9,
    status: "Inactive",
  },
  {
    id: 3,
    hCode: "H-1003",
    name: "Fraud Analytics PoC",
    description: "AI-driven detection models and analytics dashboards",
    projects: 2,
    users: 7,
    status: "Active",
  },
  {
    id: 4,
    hCode: "H-1004",
    name: "Provider Data Quality",
    description: "DQ rules, validation, and master record workflows",
    projects: 1,
    users: 5,
    status: "Pending",
  },
  {
    id: 5,
    hCode: "H-1005",
    name: "Rx Claims Batch Pilot",
    description: "Canonical mapping and error-handling PoC",
    projects: 2,
    users: 6,
    status: "Active",
  },
];

export default function Engagements() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "Active" | "Inactive" | "Pending">("all");
  const [chartView, setChartView] = useState<"status" | "projects">("status");

  // ===== Stats =====
  const activeEngagements = mockEngagements.filter((e) => e.status === "Active").length;
  const activeProjects = mockEngagements
    .filter((e) => e.status === "Active")
    .reduce((sum, e) => sum + e.projects, 0);
  const totalUsers = mockEngagements.reduce((sum, e) => sum + e.users, 0);

  const stats = [
    {
      title: "Active Engagements",
      value: activeEngagements.toString(),
      description: "Running right now",
      icon: Building2,
      color: "text-primary",
    },
    {
      title: "Active Projects",
      value: activeProjects.toString(),
      description: "Across active engagements",
      icon: FolderKanban,
      color: "text-accent",
    },
    {
      title: "Users",
      value: totalUsers.toString(),
      description: "Contributors assigned",
      icon: Users,
      color: "text-[hsl(var(--aurora-mid))]",
    },
  ];

  // ===== Chart (dummy, derived from mock data) =====
  // Colors aligned to iAurora (vibrant but on-theme)
  const COLORS = [
    "hsl(240 80% 60%)", // Aurora Blue
    "hsl(255 75% 65%)", // Indigo Violet
    "hsl(275 70% 68%)", // Soft Purple
    "hsl(195 70% 55%)", // Aqua Teal
    "hsl(310 65% 70%)", // Magenta Accent
  ];

  // Aggregate for "By Status"
  const statusCounts = useMemo(() => {
    const m = new Map<EngagementRow["status"], number>();
    for (const e of mockEngagements) {
      m.set(e.status, (m.get(e.status) ?? 0) + 1);
    }
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  // Aggregate for "By Projects" (sum projects per engagement label – top 5 shown)
  const projectsByEngagement = useMemo(() => {
    // Display each engagement's projects; dummy top 5
    return mockEngagements
      .map((e) => ({ name: e.name, value: e.projects }))
      .slice(0, 5);
  }, []);

  const pieData = chartView === "status" ? statusCounts : projectsByEngagement;

  // ===== Filtered rows =====
  const filteredRows = useMemo(() => {
    return mockEngagements.filter((e) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        e.hCode.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedEngagements,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: filteredRows, initialPageSize: 10 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Engagements</h1>
        <p className="text-muted-foreground mt-1">
          Monitor engagement performance and view active projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart (like Clients) */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {chartView === "status" ? "Engagements by Status" : "Projects by Engagement"}
              </CardTitle>
              <CardDescription>
                {chartView === "status"
                  ? "Distribution of engagements across Active / Inactive / Pending"
                  : "Active project counts across top engagements"}
              </CardDescription>
            </div>
            <Tabs value={chartView} onValueChange={(v) => setChartView(v as "status" | "projects")}>
              <TabsList>
                <TabsTrigger value="status" className="text-xs">By Status</TabsTrigger>
                <TabsTrigger value="projects" className="text-xs">By Projects</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip
                formatter={(v: number) => [v, "Count"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ color: "hsl(var(--foreground))", fontSize: 12 }}
              />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={2}
                stroke="hsl(var(--card))"
                strokeWidth={1}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagements Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Engagements Directory</CardTitle>
          <CardDescription>List of all engagements with details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by H_Code, name, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v: "all" | "Active" | "Inactive" | "Pending") => setStatusFilter(v)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>H_Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Projects</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEngagements.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.hCode}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell className="max-w-[480px] truncate" title={e.description}>
                    {e.description}
                  </TableCell>
                  <TableCell className="text-right">{e.projects}</TableCell>
                  <TableCell className="text-right">{e.users}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        e.status === "Active"
                          ? "default"
                          : e.status === "Pending"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {e.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredRows.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
