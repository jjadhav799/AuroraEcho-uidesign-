import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, FileText, Clock, ClipboardCheck, AlertCircle, Maximize2, Minimize2, Sparkles, UserPlus } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

type DocumentStatus = "Pending" | "In Progress" | "Completed" | "Moved to Production";

type Document = {
  id: string;
  docId: string;
  title: string;
  fileType: string;
  assignedDate: Date;
  status: DocumentStatus;
  projectId: string;
  projectName: string;
  keywords: string[];
  tags: string[];
};

type User = {
  id: string;
  name: string;
  email: string;
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
    keywords: ["requirements", "specifications", "functional"],
    tags: ["Technical", "Priority-High"],
  },
  {
    id: "2",
    docId: "DOC-002",
    title: "Technical Design Document",
    fileType: "DOCX",
    assignedDate: new Date("2025-01-12"),
    status: "In Progress",
    projectId: "1",
    projectName: "iAurora Web Revamp",
    keywords: ["design", "architecture", "technical"],
    tags: ["Technical", "Architecture"],
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
    keywords: ["api", "endpoints", "integration"],
    tags: ["Technical", "API"],
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
    keywords: ["user", "guide", "manual"],
    tags: ["Documentation", "End-User"],
  },
  {
    id: "5",
    docId: "DOC-005",
    title: "Test Plan",
    fileType: "XLSX",
    assignedDate: new Date("2025-01-14"),
    status: "In Progress",
    projectId: "2",
    projectName: "Claims ETL Migration",
    keywords: ["testing", "QA", "strategy"],
    tags: ["QA", "Testing"],
  },
];

const projects = [
  { id: "1", name: "iAurora Web Revamp" },
  { id: "2", name: "Claims ETL Migration" },
  { id: "3", name: "Fraud Analytics PoC" },
];

const mockUsersByRole: Record<string, User[]> = {
  "super-admin": [
    { id: "1", name: "Alice Johnson", email: "alice.johnson@aurora.com" },
  ],
  "domain-admin": [
    { id: "2", name: "Brian Lee", email: "brian.lee@aurora.com" },
    { id: "3", name: "Catherine Smith", email: "catherine.smith@aurora.com" },
  ],
  "project-admin": [
    { id: "4", name: "Daniel Roberts", email: "daniel.roberts@aurora.com" },
    { id: "5", name: "Emily Clark", email: "emily.clark@aurora.com" },
  ],
  "review-manager": [
    { id: "6", name: "Frank Harris", email: "frank.harris@aurora.com" },
    { id: "7", name: "Grace Wilson", email: "grace.wilson@aurora.com" },
  ],
  "reviewer": [
    { id: "8", name: "Henry Brown", email: "henry.brown@aurora.com" },
    { id: "9", name: "Iris Davis", email: "iris.davis@aurora.com" },
    { id: "10", name: "Jack Miller", email: "jack.miller@aurora.com" },
  ],
};

const roles = [
  { value: "super-admin", label: "Super Admin" },
  { value: "domain-admin", label: "Domain Admin" },
  { value: "project-admin", label: "Project Admin" },
  { value: "review-manager", label: "Review Manager" },
  { value: "reviewer", label: "Reviewer" },
];

export default function Documents() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("1");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredDocuments = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return mockDocuments.filter((doc) => {
      const matchesSearch =
        doc.docId.toLowerCase().includes(q) ||
        doc.title.toLowerCase().includes(q) ||
        doc.fileType.toLowerCase().includes(q);
      const matchesProject = doc.projectId === projectFilter;
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [searchTerm, projectFilter, statusFilter]);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedDocuments,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: filteredDocuments, initialPageSize: 10 });

  const documentStats = useMemo(() => {
    return {
      pending: mockDocuments.filter(d => d.status === "Pending").length,
      inProgress: mockDocuments.filter(d => d.status === "In Progress").length,
      completed: mockDocuments.filter(d => d.status === "Completed").length,
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
      title: "In Progress",
      value: documentStats.inProgress.toString(),
      description: "Under review",
      icon: ClipboardCheck,
      color: "text-chart-2",
    },
    {
      title: "Completed",
      value: documentStats.completed.toString(),
      description: "Finished",
      icon: AlertCircle,
      color: "text-primary",
    },
    {
      title: "Moved to Production",
      value: documentStats.production.toString(),
      description: "In production",
      icon: FileText,
      color: "text-chart-4",
    },
  ];

  const statusBadgeVariant = (s: DocumentStatus) =>
    s === "Moved to Production" ? "default" : s === "Completed" ? "secondary" : s === "In Progress" ? "secondary" : "outline";

  const handleDocumentClick = (doc: Document) => {
    navigate(`/documents/${doc.id}`);
  };

  const toggleDocument = (docId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.length === paginatedDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(paginatedDocuments.map((doc) => doc.id));
    }
  };

  const isAllSelected = paginatedDocuments.length > 0 && selectedDocuments.length === paginatedDocuments.length;
  const isSomeSelected = selectedDocuments.length > 0 && selectedDocuments.length < paginatedDocuments.length;

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleGenerateAnalysis = () => {
    if (selectedDocuments.length === 0) {
      toast.error("Please select at least one document");
      return;
    }
    toast.success(`Generating analysis for ${selectedDocuments.length} document(s)`);
    setSelectedDocuments([]);
  };

  const handleAssignClick = () => {
    if (selectedDocuments.length === 0) {
      toast.error("Please select at least one document");
      return;
    }
    setIsAssignDialogOpen(true);
  };

  const handleApply = () => {
    if (!selectedConfig) {
      toast.error("Please select a configuration");
      return;
    }
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }

    const selectedDoc = mockDocuments.find((d) => d.docId === selectedConfig);
    toast.success(
      `Assigned ${selectedUsers.length} user(s) to review ${selectedDoc?.title} with configuration`
    );
    
    // Reset state
    setIsAssignDialogOpen(false);
    setSelectedDocuments([]);
    setSelectedConfig("");
    setSelectedRole("");
    setSelectedUsers([]);
  };

  const usersForRole = selectedRole ? mockUsersByRole[selectedRole] || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doc Review</h1>
        <p className="text-muted-foreground mt-1">
          Manage and review project documents
        </p>
      </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="shrink-0"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isFullscreen && (
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
      )}

      <Card className={isFullscreen ? "h-[calc(100vh-12rem)]" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Document Repository</CardTitle>
              <CardDescription>
                View and manage documents across all projects
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateAnalysis} 
                disabled={selectedDocuments.length === 0}
                variant="default"
                size="sm"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Analysis
              </Button>
              <Button 
                onClick={handleAssignClick} 
                disabled={selectedDocuments.length === 0}
                variant="outline"
                size="sm"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Assign
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className={isFullscreen ? "h-[calc(100%-5rem)] overflow-auto" : ""}>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Doc ID, title, or file type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Combobox
              options={projects.map((p) => ({ value: p.id, label: p.name }))}
              value={projectFilter}
              onValueChange={setProjectFilter}
              placeholder="Filter by Project"
              searchPlaceholder="Search projects..."
              emptyText="No project found."
              className="w-full sm:w-[180px]"
            />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Moved to Production">Moved to Production</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all documents"
                    className={isSomeSelected && !isAllSelected ? "data-[state=checked]:bg-primary" : ""}
                  />
                </TableHead>
                <TableHead>Doc ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="hover:bg-muted/50"
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      id={`doc-${doc.id}`}
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={() => toggleDocument(doc.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium cursor-pointer" onClick={() => handleDocumentClick(doc)}>{doc.docId}</TableCell>
                  <TableCell className="cursor-pointer" onClick={() => handleDocumentClick(doc)}>{doc.title}</TableCell>
                  <TableCell className="cursor-pointer" onClick={() => handleDocumentClick(doc)}>{doc.fileType}</TableCell>
                  <TableCell className="cursor-pointer" onClick={() => handleDocumentClick(doc)}>
                    {doc.assignedDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="cursor-pointer" onClick={() => handleDocumentClick(doc)}>
                    <Badge variant={statusBadgeVariant(doc.status) as any}>
                      {doc.status}
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
            totalItems={filteredDocuments.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />

          {filteredDocuments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No documents found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply Configurations</DialogTitle>
            <DialogDescription>
              {selectedDocuments.length} {selectedDocuments.length === 1 ? 'document' : 'documents'} selected
            </DialogDescription>
            <p className="text-sm text-muted-foreground mt-2">
              Select a configuration and assign users to review
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Document Configurations */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Select Configuration
              </Label>
              <RadioGroup value={selectedConfig} onValueChange={setSelectedConfig}>
                <div className="space-y-3">
                  {mockDocuments
                    .filter((doc) => selectedDocuments.includes(doc.id))
                    .map((doc) => (
                      <div key={doc.id} className="flex items-start space-x-3">
                        <RadioGroupItem value={doc.docId} id={`config-${doc.id}`} className="mt-1" />
                        <Label
                          htmlFor={`config-${doc.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <Card className="p-4">
                            <h4 className="font-medium mb-2">{doc.title}</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Keywords: </span>
                                <span>{doc.keywords.join(", ")}</span>
                              </div>
                              <div className="flex gap-1 flex-wrap">
                                {doc.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </Card>
                        </Label>
                      </div>
                    ))}
                </div>
              </RadioGroup>
            </div>

            {/* Users Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Users</Label>
              
              <div>
                <Label htmlFor="role-select" className="text-sm mb-2 block">
                  Select Role
                </Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role-select">
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRole && usersForRole.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm">Select Users</Label>
                  {usersForRole.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                      <Checkbox
                        id={`user-${user.id}`}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                      <label
                        htmlFor={`user-${user.id}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {selectedRole && usersForRole.length === 0 && (
                <p className="text-sm text-muted-foreground">No users found for this role</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleApply}>
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
