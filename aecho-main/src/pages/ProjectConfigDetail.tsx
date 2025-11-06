import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

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
const ALL_TAGS = ["Responsive", "Privileged"];
const ALL_DOCUMENTS = ["SOW_v1.pdf", "Mapping.xlsx", "Requirements.docx", "Tech-Spec.pdf"];

const initialProjects: Project[] = [
  { id: 1, code: "P-1001", name: "Mobile Modernization", domain: "Technology", status: "Active", users: ["Alice Johnson"], tags: ["Responsive"], documents: ["SOW_v1.pdf"] },
  { id: 2, code: "P-1002", name: "Claims ETL Revamp", domain: "Healthcare", status: "Active", users: ["Emily Clark"], tags: ["Privileged"], documents: ["Mapping.xlsx"] },
  { id: 3, code: "P-1003", name: "Fraud Analytics PoC", domain: "Finance", status: "On-Hold", users: ["Brian Lee"], tags: [], documents: [] },
  { id: 4, code: "P-1004", name: "Provider DQ Rules", domain: "Healthcare", status: "Closed", users: ["Daniel Roberts"], tags: [], documents: [] },
];

export default function ProjectConfigDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");

  const [project, setProject] = useState<Project | null>(() => {
    const found = initialProjects.find((p) => p.id === Number(projectId));
    return found || null;
  });

  const [newDocName, setNewDocName] = useState("");

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Project Not Found</h1>
          <Button variant="ghost" onClick={() => navigate("/command-centre/project-config")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const toggleUser = (user: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      const isSelected = prev.users.includes(user);
      return {
        ...prev,
        users: isSelected ? prev.users.filter((u) => u !== user) : [...prev.users, user],
      };
    });
  };

  const toggleTag = (tag: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      const isSelected = prev.tags.includes(tag);
      return {
        ...prev,
        tags: isSelected ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  const toggleDocument = (doc: string) => {
    setProject((prev) => {
      if (!prev) return prev;
      const isSelected = prev.documents.includes(doc);
      return {
        ...prev,
        documents: isSelected ? prev.documents.filter((d) => d !== doc) : [...prev.documents, doc],
      };
    });
  };

  const addNewDocument = () => {
    if (!newDocName.trim()) return toast.error("Document name is required");
    setProject((prev) => {
      if (!prev) return prev;
      if (prev.documents.includes(newDocName.trim())) {
        toast.warning("Document already added");
        return prev;
      }
      toast.success("Document added");
      return { ...prev, documents: [...prev.documents, newDocName.trim()] };
    });
    setNewDocName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">
            {project.code} — {project.domain}
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate("/command-centre/project-config")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Project Configuration</CardTitle>
          <CardDescription>Manage users, tags, and documents for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4 mt-4">
              <div className="space-y-3">
                {ALL_USERS.map((user) => (
                  <div key={user} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${user}`}
                      checked={project.users.includes(user)}
                      onCheckedChange={() => toggleUser(user)}
                    />
                    <label
                      htmlFor={`user-${user}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {user}
                    </label>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Tags Tab */}
            <TabsContent value="tags" className="space-y-4 mt-4">
              <div className="space-y-3">
                {ALL_TAGS.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={project.tags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4 mt-4">
              <div className="space-y-3">
                {ALL_DOCUMENTS.map((doc) => (
                  <div key={doc} className="flex items-center space-x-2">
                    <Checkbox
                      id={`doc-${doc}`}
                      checked={project.documents.includes(doc)}
                      onCheckedChange={() => toggleDocument(doc)}
                    />
                    <label
                      htmlFor={`doc-${doc}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {doc}
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="New document name (e.g., Report_v2.pdf)"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                  <Button onClick={addNewDocument} disabled={!newDocName.trim()}>
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
