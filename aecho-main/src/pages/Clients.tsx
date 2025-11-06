import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Building2, FolderKanban, Search } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

type Client = {
  id: number;
  name: string;
  domain: string;
  status: "Active" | "Inactive";
  projects: number;
  engagements: number;
};

const mockClients: Client[] = [
  { id: 1, name: "Acme Corporation", domain: "Technology", status: "Active", projects: 5, engagements: 3 },
  { id: 2, name: "Global Enterprises", domain: "Finance", status: "Active", projects: 3, engagements: 2 },
  { id: 3, name: "Innovation Labs", domain: "Healthcare", status: "Active", projects: 7, engagements: 4 },
  { id: 4, name: "Strategic Partners", domain: "Retail", status: "Inactive", projects: 0, engagements: 1 },
  { id: 5, name: "Future Systems", domain: "Manufacturing", status: "Active", projects: 2, engagements: 2 },
];

export default function Clients() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chartView, setChartView] = useState<"domain" | "projects">("domain");

  const stats = [
    {
      title: "Total Clients",
      value: mockClients.length.toString(),
      description: "Active clients",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Active Engagements",
      value: mockClients.reduce((sum, c) => sum + c.engagements, 0).toString(),
      description: "Ongoing engagements",
      icon: Building2,
      color: "text-chart-2",
    },
    {
      title: "Active Projects",
      value: mockClients.reduce((sum, c) => sum + c.projects, 0).toString(),
      description: "In progress",
      icon: FolderKanban,
      color: "text-accent",
    },
  ];

  const filteredClients = useMemo(() => {
    return mockClients.filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = domainFilter === "all" || client.domain === domainFilter;
      const matchesStatus = statusFilter === "all" || client.status === statusFilter;
      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [searchTerm, domainFilter, statusFilter]);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedClients,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: filteredClients, initialPageSize: 10 });

  const chartData = [
    { domain: "Technology", total: 40, projects: 25 },
    { domain: "Finance", total: 32, projects: 18 },
    { domain: "Healthcare", total: 28, projects: 15 },
    { domain: "Retail", total: 20, projects: 12 },
    { domain: "Manufacturing", total: 16, projects: 10 },
  ];

  const COLORS = [
    "hsl(240 80% 60%)",   // Aurora Blue
    "hsl(255 75% 65%)",   // Indigo Violet
    "hsl(275 70% 68%)",   // Soft Purple
    "hsl(195 70% 55%)",   // Aqua Teal
    "hsl(310 65% 70%)",   // Magenta Accent
  ];

  const pieData =
    chartView === "domain"
      ? chartData.map(({ domain, total }) => ({ name: domain, value: total }))
      : chartData.map(({ domain, projects }) => ({ name: domain, value: projects }));

  const domains = Array.from(new Set(mockClients.map((c) => c.domain)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
        </Dialog>
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

      {/* Chart */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {chartView === "domain" ? "Clients by Domain" : "Active Projects by Client"}
              </CardTitle>
              <CardDescription>
                {chartView === "domain"
                  ? "Distribution of clients across different domains"
                  : "Number of active projects per client"}
              </CardDescription>
            </div>
            <Tabs value={chartView} onValueChange={(v) => setChartView(v as "domain" | "projects")}>
              <TabsList>
                <TabsTrigger value="domain" className="text-xs">
                  By Domain
                </TabsTrigger>
                <TabsTrigger value="projects" className="text-xs">
                  By Projects
                </TabsTrigger>
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

      {/* Client Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>A list of all clients in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={domainFilter} onValueChange={setDomainFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Engagements</TableHead>
                <TableHead className="text-right">Projects</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.domain}</TableCell>
                  <TableCell className="text-right">{client.engagements ?? 0}</TableCell>
                  <TableCell className="text-right">{client.projects}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === "Active" ? "default" : "secondary"}>
                      {client.status}
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
            totalItems={filteredClients.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
