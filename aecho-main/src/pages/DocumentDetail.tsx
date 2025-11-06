import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import { ArrowLeft, FileText, Maximize2, Minimize2 } from "lucide-react";
import { toast } from "sonner";

type DocumentStatus = "Pending" | "In Progress" | "Completed" | "Moved to Production";

const projects = [
  { id: "1", name: "iAurora Web Revamp" },
  { id: "2", name: "Claims ETL Migration" },
  { id: "3", name: "Fraud Analytics PoC" },
];

const keywords = [
  { id: "1", name: "API" },
  { id: "2", name: "Security" },
  { id: "3", name: "Performance" },
  { id: "4", name: "Database" },
  { id: "5", name: "Frontend" },
];

const tags = [
  { id: "1", name: "Critical" },
  { id: "2", name: "Review Required" },
  { id: "3", name: "High Priority" },
  { id: "4", name: "Archived" },
];

// Mock documents by project
const projectDocuments: Record<string, any[]> = {
  "1": [
    { id: "DOC-001", title: "Requirements Specification" },
    { id: "DOC-002", title: "Technical Design Document" },
  ],
  "2": [
    { id: "DOC-003", title: "API Documentation" },
    { id: "DOC-005", title: "Test Plan" },
  ],
  "3": [{ id: "DOC-004", title: "User Manual" }],
};

export default function DocumentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedProject, setSelectedProject] = useState("1");
  const [selectedDocId, setSelectedDocId] = useState("DOC-001");
  const [status, setStatus] = useState<DocumentStatus>("Pending");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [expandedContent, setExpandedContent] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleKeywordToggle = (keywordId: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keywordId)
        ? prev.filter((k) => k !== keywordId)
        : [...prev, keywordId]
    );
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = () => {
    toast.success("Document updated successfully");
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocId(docId);
    setExpandedContent(true);
  };

  const currentDocs = projectDocuments[selectedProject] || [];
  const selectedDoc = currentDocs.find(d => d.id === selectedDocId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/documents")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Docs
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Review</h1>
          <p className="text-muted-foreground mt-1">
            Review and annotate document details
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className={`grid gap-6 transition-all duration-300 ${isFullscreen ? 'md:grid-cols-1' : expandedContent ? 'md:grid-cols-[0.8fr_2.4fr_0.8fr]' : 'md:grid-cols-[1fr_2fr_1fr]'}`}>
        {/* Segment 1: Project Selection & Document List */}
        {!isFullscreen && (
        <Card className={expandedContent ? 'md:col-span-1' : ''}>
          <CardHeader>
            <CardTitle>Project & Documents</CardTitle>
            <CardDescription>Select project and document</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Project</label>
              <Combobox
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                value={selectedProject}
                onValueChange={setSelectedProject}
                placeholder="Select project"
                searchPlaceholder="Search projects..."
                emptyText="No project found."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as DocumentStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Moved to Production">Moved to Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Documents in Project
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 border rounded-md hover:bg-accent cursor-pointer transition-colors ${
                      selectedDocId === doc.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => handleDocumentSelect(doc.id)}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{doc.id}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {doc.title}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Segment 2: Document Content */}
        <Card className={isFullscreen ? 'md:col-span-1 h-[calc(100vh-12rem)]' : expandedContent ? 'md:col-span-1' : ''}>
          <CardHeader>
            <CardTitle>{selectedDoc?.title || "Doc Title"}</CardTitle>
            <CardDescription>Preview of selected document</CardDescription>
          </CardHeader>
          <CardContent className={isFullscreen ? 'h-[calc(100%-5rem)] overflow-auto' : ''}>
            <div className={`bg-muted/50 rounded-lg p-6 border-2 border-dashed border-border ${isFullscreen ? 'min-h-full' : 'min-h-[400px]'}`}>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Requirements Specification</h3>
                  <p className="text-sm text-muted-foreground">
                    This document outlines the functional and non-functional requirements
                    for the iAurora Web Revamp project.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">1. Introduction</h4>
                  <p className="text-xs text-muted-foreground">
                    The purpose of this document is to define the scope and requirements
                    of the web application redesign.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">2. Functional Requirements</h4>
                  <p className="text-xs text-muted-foreground">
                    - User authentication and authorization
                    <br />
                    - Dashboard with analytics
                    <br />
                    - Document management system
                    <br />- Real-time notifications
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segment 3: Keywords, Tags, Comments */}
        {!isFullscreen && (
        <Card className={expandedContent ? 'md:col-span-1' : ''}>
          <CardHeader>
            <CardTitle>Metadata & Comments</CardTitle>
            <CardDescription>Add keywords, tags, and comments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Keywords</label>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword.id}
                    variant={
                      selectedKeywords.includes(keyword.id) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleKeywordToggle(keyword.id)}
                  >
                    {keyword.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Comments</label>
              <Textarea
                placeholder="Add your comments here..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} size="lg">
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
