import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeEntry } from "@/types/caseTime";
import { Plus, Clock, Calendar, TrendingUp, Eye, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TimeEntryForm } from "@/components/casetime/TimeEntryForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function CaseTime() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceLineFilter, setServiceLineFilter] = useState<string>("all");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  // Dummy data for time entries
  const dummyEntries: TimeEntry[] = [
    {
      id: "1",
      date: new Date("2025-01-15"),
      project: "iAurora Web Revamp",
      hCode: "H-001",
      serviceLine: "Web Development",
      task: "Frontend Development",
      startTime: "09:00",
      endTime: "12:30",
      duration: 3.5,
      billableHours: 3.0,
      nonBillableHours: 0.5,
      engagementId: "ENG-001",
    },
    {
      id: "2",
      date: new Date("2025-01-15"),
      project: "Claims ETL Migration",
      hCode: "H-002",
      serviceLine: "Backend Development",
      task: "API Integration",
      startTime: "14:00",
      endTime: "17:00",
      duration: 3,
      billableHours: 3.0,
      nonBillableHours: 0,
      engagementId: "ENG-002",
    },
    {
      id: "3",
      date: new Date("2025-01-16"),
      project: "Fraud Analytics PoC",
      hCode: "H-003",
      serviceLine: "UI/UX Design",
      task: "Wireframing",
      startTime: "10:00",
      endTime: "13:00",
      duration: 3,
      billableHours: 2.5,
      nonBillableHours: 0.5,
      engagementId: "ENG-003",
    },
    {
      id: "4",
      date: new Date("2025-01-16"),
      project: "iAurora Web Revamp",
      hCode: "H-001",
      serviceLine: "Testing",
      task: "QA Testing",
      startTime: "15:00",
      endTime: "18:30",
      duration: 3.5,
      billableHours: 3.5,
      nonBillableHours: 0,
      engagementId: "ENG-001",
    },
    {
      id: "5",
      date: new Date("2025-01-17"),
      project: "Claims ETL Migration",
      hCode: "H-002",
      serviceLine: "Database Design",
      task: "Schema Development",
      startTime: "09:30",
      endTime: "12:00",
      duration: 2.5,
      billableHours: 2.0,
      nonBillableHours: 0.5,
      engagementId: "ENG-002",
    },
  ];

  const weeklySummary = {
    totalHours: dummyEntries.reduce((acc, entry) => acc + entry.duration, 0),
    entries: dummyEntries,
  };

  const handleView = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setViewDialogOpen(true);
  };

  const handleApprove = () => {
    // Approve logic
    console.log("Approved entry:", selectedEntry);
  };

  const handleEdit = () => {
    // Edit logic
    console.log("Edit entry:", selectedEntry);
  };

  const handleUpdate = () => {
    // Update logic
    console.log("Update entry:", selectedEntry);
  };

  const handleDelete = () => {
    // Delete logic
    console.log("Delete entry:", selectedEntry);
    setViewDialogOpen(false);
  };

  const filteredEntries = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return dummyEntries.filter((entry) => {
      const matchesSearch =
        entry.serviceLine.toLowerCase().includes(q) ||
        entry.task.toLowerCase().includes(q) ||
        entry.engagementId.toLowerCase().includes(q);
      const matchesServiceLine = serviceLineFilter === "all" || entry.serviceLine === serviceLineFilter;
      return matchesSearch && matchesServiceLine;
    });
  }, [searchTerm, serviceLineFilter]);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedEntries,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: filteredEntries, initialPageSize: 10 });

  const stats = [
    {
      title: "Hours This Week",
      value: `${weeklySummary.totalHours}h`,
      description: "Total billable hours",
      icon: Clock,
      color: "text-primary",
    },
    {
      title: "Entries This Week",
      value: weeklySummary.entries.length,
      description: "Time entries logged",
      icon: Calendar,
      color: "text-accent",
    },
    {
      title: "Avg. Daily Hours",
      value: `${(weeklySummary.totalHours / 7).toFixed(1)}h`,
      description: "Average per day",
      icon: TrendingUp,
      color: "text-chart-2",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Log</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage billable hours
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Log Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log Time Entry</DialogTitle>
              <DialogDescription>
                Record time spent on client engagements
              </DialogDescription>
            </DialogHeader>
            <TimeEntryForm />
          </DialogContent>
        </Dialog>
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
          <CardTitle>Recent Time Entries</CardTitle>
          <CardDescription>
            Your latest logged time entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by service line, task, or engagement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={serviceLineFilter} onValueChange={setServiceLineFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Service Line" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Lines</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Backend Development">Backend Development</SelectItem>
                <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Database Design">Database Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>H-Code</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-right">Billable hrs</TableHead>
                <TableHead className="text-right">Non-Billable hrs</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.map((entry: TimeEntry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.project}</TableCell>
                  <TableCell className="font-medium">{entry.hCode}</TableCell>
                  <TableCell>{entry.serviceLine}</TableCell>
                  <TableCell>{format(new Date(entry.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{entry.startTime}</TableCell>
                  <TableCell>{entry.endTime}</TableCell>
                  <TableCell className="text-right font-medium">{entry.billableHours}h</TableCell>
                  <TableCell className="text-right font-medium">{entry.nonBillableHours}h</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(entry)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredEntries.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Time Entry Details</DialogTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleApprove}>
                  Approve
                </Button>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={handleUpdate}>
                  Update
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
            <DialogDescription>
              View and manage time entry
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Project</label>
                  <p className="text-sm">{selectedEntry.project}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">H-Code</label>
                  <p className="text-sm font-medium">{selectedEntry.hCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-sm">{format(new Date(selectedEntry.date), "MMM dd, yyyy")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Service Line</label>
                  <p className="text-sm">{selectedEntry.serviceLine}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Task</label>
                  <p className="text-sm">{selectedEntry.task}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-sm font-semibold">{selectedEntry.duration}h</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Time</label>
                  <p className="text-sm">{selectedEntry.startTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">End Time</label>
                  <p className="text-sm">{selectedEntry.endTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Billable Hours</label>
                  <p className="text-sm font-semibold">{selectedEntry.billableHours}h</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Non-Billable Hours</label>
                  <p className="text-sm font-semibold">{selectedEntry.nonBillableHours}h</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
