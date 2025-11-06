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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Building2, FolderKanban, Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

// ===== Types & Dummy Data =====
type ProjectStatus = "Active" | "On Hold" | "Closed";

type Project = {
  id: number;
  code: string;
  name: string;
  client: string;
  domain: string;
  status: ProjectStatus;
  users: number;
  documents: number;
};

const mockProjects: Project[] = [
  { id: 1, code: "PRJ-001", name: "iAurora Web Revamp", client: "Acme Corporation", domain: "Technology", status: "Active", users: 4, documents: 34 },
  { id: 2, code: "PRJ-002", name: "Claims ETL Migration", client: "Global Enterprises", domain: "Finance", status: "On Hold", users: 3, documents: 21 },
  { id: 3, code: "PRJ-003", name: "Fraud Analytics PoC", client: "Innovation Labs", domain: "Healthcare", status: "Active", users: 2, documents: 27 },
  { id: 4, code: "PRJ-004", name: "Retail App QA Suite", client: "Strategic Partners", domain: "Retail", status: "Closed", users: 1, documents: 15 },
  { id: 5, code: "PRJ-005", name: "MES Integration", client: "Future Systems", domain: "Manufacturing", status: "Active", users: 3, documents: 29 },
  { id: 6, code: "PRJ-006", name: "Data Lake Implementation", client: "Brighton Health", domain: "Healthcare", status: "Active", users: 4, documents: 31 },
  { id: 7, code: "PRJ-007", name: "Payment Gateway Uplift", client: "NextPay", domain: "Finance", status: "On Hold", users: 2, documents: 18 },
  { id: 8, code: "PRJ-008", name: "Mobile App Accessibility", client: "Retail Connect", domain: "Retail", status: "Closed", users: 1, documents: 22 },
  { id: 9, code: "PRJ-009", name: "API Gateway Modernization", client: "TechNova", domain: "Technology", status: "Active", users: 3, documents: 36 },
  { id: 10, code: "PRJ-010", name: "IoT Data Platform", client: "SmartEdge", domain: "Manufacturing", status: "Active", users: 4, documents: 41 },
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");

  // ===== Stats =====
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter((p) => p.status === "Active").length;
  const onHoldProjects = mockProjects.filter((p) => p.status === "On Hold").length;
  const closedProjects = mockProjects.filter((p) => p.status === "Closed").length;

  const totalUsers = mockProjects.reduce((sum, p) => sum + p.users, 0);
  const totalDocuments = mockProjects.reduce((sum, p) => sum + p.documents, 0);

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects.toString(),
      description: "Projects in portfolio",
      icon: FolderKanban,
      color: "text-primary",
    },
    {
      title: "Active",
      value: activeProjects.toString(),
      description: "Currently in progress",
      icon: Building2,
      color: "text-accent",
    },
    {
      title: "On Hold",
      value: onHoldProjects.toString(),
      description: "Temporarily paused",
      icon: Users,
      color: "text-[hsl(var(--aurora-mid))]",
    },
    {
      title: "Closed",
      value: closedProjects.toString(),
      description: "Completed or ended",
      icon: Users,
      color: "text-muted-foreground",
    },
  ];

  // ===== Filters & Search =====
  const domains = Array.from(new Set(mockProjects.map((p) => p.domain)));
  const filteredProjects = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return mockProjects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q);
      const matchesDomain = domainFilter === "all" || p.domain === domainFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesDomain && matchesStatus;
    });
  }, [searchTerm, domainFilter, statusFilter]);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedProjects,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: filteredProjects, initialPageSize: 10 });

  const statusBadgeVariant = (s: ProjectStatus) =>
    s === "Active" ? "default" : s === "On Hold" ? "outline" : "secondary";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Track project health, workload, and engagement mapping
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon as any;
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

      {/* Project Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Project Directory</CardTitle>
          <CardDescription>
            Overview of all projects, linked clients, and engagement counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name, code, or client..."
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
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>H-Code</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Documents</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.code}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.client}</TableCell>
                  <TableCell>{p.domain}</TableCell>
                  <TableCell className="text-right">{p.users}</TableCell>
                  <TableCell className="text-right">{p.documents}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(p.status) as any}>{p.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredProjects.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
