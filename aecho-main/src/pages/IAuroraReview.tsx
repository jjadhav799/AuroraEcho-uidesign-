import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Combobox } from "@/components/ui/combobox";
import { Plus, ClipboardCheck, Clock, AlertCircle, FileSearch, BarChart3, Search, FileText } from "lucide-react";

type DocumentStatus = "Pending" | "Responsive" | "Moved to Production";

type Document = {
  id: string;
  docId: string;
  title: string;
  fileType: string;
  assignedDate: Date;
  status: DocumentStatus;
  projectId: string;
  projectName: string;
};

const mockDocuments: Document[] = [
  {
    id: "1",
    docId: "DOC-001",
    title: "Requirements Specification",
    fileType: "PDF",
    assignedDate: new Date("2025-01-10"),
    status: "Pending",
    projectId: "1",
    projectName: "iAurora Web Revamp",
  },
  {
    id: "2",
    docId: "DOC-002",
    title: "Technical Design Document",
    fileType: "DOCX",
    assignedDate: new Date("2025-01-12"),
    status: "Responsive",
    projectId: "1",
    projectName: "iAurora Web Revamp",
  },
  {
    id: "3",
    docId: "DOC-003",
    title: "API Documentation",
    fileType: "PDF",
    assignedDate: new Date("2025-01-08"),
    status: "Moved to Production",
    projectId: "2",
    projectName: "Claims ETL Migration",
  },
  {
    id: "4",
    docId: "DOC-004",
    title: "User Manual",
    fileType: "PDF",
    assignedDate: new Date("2025-01-15"),
    status: "Pending",
    projectId: "3",
    projectName: "Fraud Analytics PoC",
  },
  {
    id: "5",
    docId: "DOC-005",
    title: "Test Plan",
    fileType: "XLSX",
    assignedDate: new Date("2025-01-14"),
    status: "Responsive",
    projectId: "2",
    projectName: "Claims ETL Migration",
  },
];

const projects = [
  { id: "1", name: "iAurora Web Revamp" },
  { id: "2", name: "Claims ETL Migration" },
  { id: "3", name: "Fraud Analytics PoC" },
];

export default function IAuroraReview() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>("all");

  const filteredDocuments = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return mockDocuments.filter((doc) => {
      const matchesSearch =
        doc.docId.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.fileType.toLowerCase().includes(q);
      const matchesProject = projectFilter === "all" || doc.projectId === projectFilter;
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [searchTerm, projectFilter, statusFilter]);

  const documentStats = useMemo(() => {
    return {
      pending: mockDocuments.filter(d => d.status === "Pending").length,
      responsive: mockDocuments.filter(d => d.status === "Responsive").length,
      production: mockDocuments.filter(d => d.status === "Moved to Production").length,
    };
  }, []);

  const stats = [
    {
      title: "Pending",
      value: documentStats.pending.toString(),
      description: "Awaiting action",
      icon: Clock,
      color: "text-accent",
    },
    {
      title: "Responsive",
      value: documentStats.responsive.toString(),
      description: "Under review",
      icon: ClipboardCheck,
      color: "text-chart-2",
    },
    {
      title: "Moved to Production",
      value: documentStats.production.toString(),
      description: "Completed",
      icon: AlertCircle,
      color: "text-primary",
    },
  ];

  const sections = [
    {
      title: "Analysis",
      description: "Review performance metrics and trends",
      icon: BarChart3,
      path: "/review/analysis",
    },
  ];

  const statusBadgeVariant = (s: DocumentStatus) =>
    s === "Moved to Production" ? "default" : s === "Responsive" ? "secondary" : "outline";

  const handleDocumentClick = (doc: Document) => {
    navigate(`/documents/${doc.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve engagement activities
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Review
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>
            View and manage documents across all projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Doc ID, title, or file type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Combobox
                options={[
                  { value: "all", label: "All Projects" },
                  ...projects.map((p) => ({ value: p.id, label: p.name })),
                ]}
                value={projectFilter}
                onValueChange={setProjectFilter}
                placeholder="Filter by Project"
                searchPlaceholder="Search projects..."
                emptyText="No project found."
              />
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Responsive">Responsive</SelectItem>
                  <SelectItem value="Moved to Production">Moved to Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doc ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <TableCell className="font-medium">{doc.docId}</TableCell>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.fileType}</TableCell>
                  <TableCell>
                    {doc.assignedDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(doc.status) as any}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDocuments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.title}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate(section.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            Items requiring review and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No pending reviews at this time
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
