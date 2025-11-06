import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Tag, Search, Eye, FolderOpen } from "lucide-react";

type AnalysisReport = {
  arid: string;
  title: string;
  date: string;
  docs: number;
  score: number;
  responsiveDocs: number;
  projectId: string;
};

type Project = {
  id: string;
  name: string;
};

const dummyProjects: Project[] = [
  { id: "proj-001", name: "Smith Ltd Contract Review" },
  { id: "proj-002", name: "Q4 Compliance Audit" },
  { id: "proj-003", name: "Patent Research Initiative" },
  { id: "proj-004", name: "Discovery Phase 2024" },
];

const dummyReports: AnalysisReport[] = [
  { arid: "AR-001", title: "Q4 Compliance Review", date: "2024-01-15", docs: 24, score: 87, responsiveDocs: 18, projectId: "proj-002" },
  { arid: "AR-002", title: "Contract Analysis - Smith Ltd", date: "2024-01-14", docs: 12, score: 92, responsiveDocs: 10, projectId: "proj-001" },
  { arid: "AR-003", title: "Patent Prior Art Search", date: "2024-01-12", docs: 45, score: 78, responsiveDocs: 32, projectId: "proj-003" },
  { arid: "AR-004", title: "Discovery Document Review", date: "2024-01-10", docs: 67, score: 83, responsiveDocs: 48, projectId: "proj-004" },
  { arid: "AR-005", title: "Regulatory Filing Check", date: "2024-01-08", docs: 15, score: 95, responsiveDocs: 14, projectId: "proj-002" },
];

export default function ReviewAnalysis() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [selectedProject, setSelectedProject] = useState("proj-001");

  // Filter reports by project
  const projectFilteredReports = dummyReports.filter(report => report.projectId === selectedProject);

  const totalScanned = projectFilteredReports.reduce((sum, report) => sum + report.docs, 0);
  const responsiveDocs = projectFilteredReports.reduce((sum, report) => sum + report.responsiveDocs, 0);
  const responsivePercent = totalScanned > 0 ? ((responsiveDocs / totalScanned) * 100).toFixed(1) : "0.0";
  const keywordsMatched = 3;
  const totalKeywords = 100;
  const tagsMatched = 5;
  const totalTags = 100;

  const filteredReports = projectFilteredReports.filter(
    (report) =>
      report.arid.toLowerCase().includes(search.toLowerCase()) ||
      report.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Analyze document scanning and review performance
          </p>
        </div>
        <div className="flex items-center gap-2 min-w-[300px]">
          <FolderOpen className="h-5 w-5 text-muted-foreground shrink-0" />
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {dummyProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top 3 cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Scanned</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScanned}</div>
            <p className="text-xs text-muted-foreground">Total documents processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectFilteredReports.length}</div>
            <p className="text-xs text-muted-foreground">Analysis reports created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responsive</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responsiveDocs} ({responsivePercent}%)</div>
            <p className="text-xs text-muted-foreground">Documents matched</p>
          </CardContent>
        </Card>
      </div>

      {/* Keywords and Tags cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Keywords Matched</CardTitle>
            <Search className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywordsMatched}/{totalKeywords}</div>
            <p className="text-xs text-muted-foreground">Unique keywords found</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags Matched</CardTitle>
            <Tag className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tagsMatched}/{totalTags}</div>
            <p className="text-xs text-muted-foreground">Classification tags applied</p>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by ARID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ARID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Docs</TableHead>
                <TableHead>Score (%)</TableHead>
                <TableHead>Responsive</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.arid}>
                  <TableCell className="font-medium">{report.arid}</TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.docs}</TableCell>
                  <TableCell>{report.score}%</TableCell>
                  <TableCell>{report.responsiveDocs}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/review/analysis/${report.arid}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
