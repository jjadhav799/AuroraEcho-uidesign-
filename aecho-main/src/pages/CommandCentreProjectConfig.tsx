import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

type Project = {
  id: number;
  code: string;
  name: string;
  domain: string;
  status: "Active" | "On-Hold" | "Closed";
  users: string[];
  tags: string[];
  documents: string[];
};

const ALL_USERS = ["Alice Johnson", "Brian Lee", "Catherine Smith", "Daniel Roberts", "Emily Clark", "Frank Harris"];
// ⬇️ Only keep these two tags, per request
const ALL_TAGS = ["Responsive", "Privileged"];

const initialProjects: Project[] = [
  { id: 1, code: "P-1001", name: "Mobile Modernization", domain: "Technology", status: "Active", users: ["Alice Johnson"], tags: ["Responsive"], documents: ["SOW_v1.pdf"] },
  { id: 2, code: "P-1002", name: "Claims ETL Revamp", domain: "Healthcare", status: "Active", users: ["Emily Clark"], tags: ["Privileged"], documents: ["Mapping.xlsx"] },
  { id: 3, code: "P-1003", name: "Fraud Analytics PoC", domain: "Finance", status: "On-Hold", users: ["Brian Lee"], tags: [], documents: [] },
  { id: 4, code: "P-1004", name: "Provider DQ Rules", domain: "Healthcare", status: "Closed", users: ["Daniel Roberts"], tags: [], documents: [] },
];

export default function CommandCentreProjectConfig() {
  const navigate = useNavigate();
  const [projects] = useState(initialProjects);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [projects, search]);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedProjects,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: filtered, initialPageSize: 10 });

  const handleSelectProject = (project: Project) => {
    navigate(`/command-centre/project-config/detail?id=${project.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Configuration</h1>
          <p className="text-muted-foreground mt-1">Search and select a project to manage users, tags, and documents</p>
        </div>
      </div>

      {/* List view */}
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Select a project to configure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name, code, domain, or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProjects.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => handleSelectProject(p)}
                  >
                    <TableCell className="font-medium">{p.code}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.domain}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.status === "Active"
                            ? "default"
                            : p.status === "On-Hold"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {p.status}
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
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>
    </div>
  );
}
