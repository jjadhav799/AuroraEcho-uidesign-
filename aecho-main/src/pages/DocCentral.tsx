import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Upload, FileText } from "lucide-react";

export default function DocCentral() {
  const stats = [
    {
      title: "Total Documents",
      value: "1,234",
      description: "All files",
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Recent Uploads",
      value: "48",
      description: "This week",
      icon: Upload,
      color: "text-accent",
    },
    {
      title: "Active Folders",
      value: "32",
      description: "Organized collections",
      icon: FolderOpen,
      color: "text-chart-2",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doc Central</h1>
          <p className="text-muted-foreground mt-1">
            Document management and storage
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderOpen className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
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
          <CardTitle>Document Library</CardTitle>
          <CardDescription>
            Access and manage engagement documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No documents uploaded yet. Click "Upload Document" to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
