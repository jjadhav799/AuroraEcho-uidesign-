import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { WeeklySummary, TimeEntry } from "@/types/caseTime";
import { Plus, Clock, Calendar as CalendarIcon, TrendingUp, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimeEntryFormEnhanced } from "@/components/casetime/TimeEntryFormEnhanced";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";

export default function TimelogEnhanced() {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [filterPeriod, setFilterPeriod] = useState<string>("month");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);

  // Mock data for display
  const mockData: WeeklySummary = {
    totalHours: 40.5,
    entries: [
      {
        id: '1',
        date: new Date('2025-01-15'),
        project: 'iAurora Web Revamp',
        hCode: 'H-001',
        serviceLine: 'Web Development',
        task: 'Frontend Development',
        startTime: '09:00',
        endTime: '12:30',
        duration: 3.5,
        billableHours: 3.0,
        nonBillableHours: 0.5,
        engagementId: 'ENG-001',
      },
      {
        id: '2',
        date: new Date('2025-01-15'),
        project: 'Claims ETL Migration',
        hCode: 'H-002',
        serviceLine: 'Backend Development',
        task: 'API Integration',
        startTime: '14:00',
        endTime: '17:00',
        duration: 3,
        billableHours: 3.0,
        nonBillableHours: 0,
        engagementId: 'ENG-002',
      },
      {
        id: '3',
        date: new Date('2025-01-16'),
        project: 'Fraud Analytics PoC',
        hCode: 'H-003',
        serviceLine: 'UI/UX Design',
        task: 'Wireframing',
        startTime: '10:00',
        endTime: '13:00',
        duration: 3,
        billableHours: 2.5,
        nonBillableHours: 0.5,
        engagementId: 'ENG-003',
      },
      {
        id: '4',
        date: new Date('2025-01-16'),
        project: 'iAurora Web Revamp',
        hCode: 'H-001',
        serviceLine: 'Testing',
        task: 'QA Testing',
        startTime: '15:00',
        endTime: '18:30',
        duration: 3.5,
        billableHours: 3.5,
        nonBillableHours: 0,
        engagementId: 'ENG-001',
      },
      {
        id: '5',
        date: new Date('2025-01-17'),
        project: 'Claims ETL Migration',
        hCode: 'H-002',
        serviceLine: 'Database Design',
        task: 'Schema Development',
        startTime: '09:30',
        endTime: '12:00',
        duration: 2.5,
        billableHours: 2.0,
        nonBillableHours: 0.5,
        engagementId: 'ENG-002',
      },
      {
        id: '6',
        date: new Date('2025-01-17'),
        project: 'Retail App QA Suite',
        hCode: 'H-004',
        serviceLine: 'Testing',
        task: 'Automation Testing',
        startTime: '14:00',
        endTime: '18:00',
        duration: 4,
        billableHours: 4.0,
        nonBillableHours: 0,
        engagementId: 'ENG-004',
      },
      {
        id: '7',
        date: new Date('2025-01-18'),
        project: 'MES Integration',
        hCode: 'H-005',
        serviceLine: 'Backend Development',
        task: 'System Integration',
        startTime: '09:00',
        endTime: '13:00',
        duration: 4,
        billableHours: 3.5,
        nonBillableHours: 0.5,
        engagementId: 'ENG-005',
      },
      {
        id: '8',
        date: new Date('2025-01-18'),
        project: 'Data Lake Implementation',
        hCode: 'H-006',
        serviceLine: 'Database Design',
        task: 'Data Modeling',
        startTime: '14:30',
        endTime: '17:30',
        duration: 3,
        billableHours: 3.0,
        nonBillableHours: 0,
        engagementId: 'ENG-006',
      },
      {
        id: '9',
        date: new Date('2025-01-19'),
        project: 'iAurora Web Revamp',
        hCode: 'H-001',
        serviceLine: 'Web Development',
        task: 'Backend API',
        startTime: '10:00',
        endTime: '14:00',
        duration: 4,
        billableHours: 4.0,
        nonBillableHours: 0,
        engagementId: 'ENG-001',
      },
      {
        id: '10',
        date: new Date('2025-01-19'),
        project: 'Fraud Analytics PoC',
        hCode: 'H-003',
        serviceLine: 'Data Analytics',
        task: 'Dashboard Creation',
        startTime: '15:00',
        endTime: '19:00',
        duration: 4,
        billableHours: 3.5,
        nonBillableHours: 0.5,
        engagementId: 'ENG-003',
      },
      {
        id: '11',
        date: new Date('2025-01-20'),
        project: 'Claims ETL Migration',
        hCode: 'H-002',
        serviceLine: 'Backend Development',
        task: 'ETL Development',
        startTime: '09:00',
        endTime: '12:00',
        duration: 3,
        billableHours: 3.0,
        nonBillableHours: 0,
        engagementId: 'ENG-002',
      },
      {
        id: '12',
        date: new Date('2025-01-20'),
        project: 'Retail App QA Suite',
        hCode: 'H-004',
        serviceLine: 'Testing',
        task: 'Performance Testing',
        startTime: '13:30',
        endTime: '17:00',
        duration: 3.5,
        billableHours: 3.0,
        nonBillableHours: 0.5,
        engagementId: 'ENG-004',
      },
    ],
  };

  const { data: weeklySummary } = useQuery<WeeklySummary>({
    queryKey: ["weeklySummary"],
    queryFn: async () => {
      const response = await fetch("/api/time-entries/weekly");
      if (!response.ok) return mockData;
      return response.json();
    },
    initialData: mockData,
  });

  const filteredEntries = useMemo(() => {
    return weeklySummary.entries;
  }, [weeklySummary.entries]);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData: paginatedEntries,
    setCurrentPage,
    setPageSize,
  } = usePagination({ data: filteredEntries, initialPageSize: 10 });

  const projects = [
    { id: "1", name: "iAurora Web Revamp" },
    { id: "2", name: "Claims ETL Migration" },
    { id: "3", name: "Fraud Analytics PoC" },
  ];

  const stats = [
    {
      title: "Hours This Week",
      value: `${weeklySummary.totalHours}h`,
      description: "Total hours logged",
      icon: Clock,
      color: "text-primary",
    },
    {
      title: "Billable hours this week",
      value: weeklySummary.entries.length,
      description: "Time entries logged",
      icon: CalendarIcon,
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

  const handleView = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setViewDialogOpen(true);
  };

  const handleApprove = () => {
    // Approve logic
  };

  const handleEdit = () => {
    // Edit logic
  };

  const handleUpdate = () => {
    // Update logic
  };

  const handleDelete = () => {
    // Delete logic
    setViewDialogOpen(false);
  };

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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log Time Entry</DialogTitle>
              <DialogDescription>
                Record time spent on client engagements
              </DialogDescription>
            </DialogHeader>
            <TimeEntryFormEnhanced />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Project</label>
              <Combobox
                options={projects.map(p => ({ value: p.id, label: p.name }))}
                value={selectedProject}
                onValueChange={setSelectedProject}
                placeholder="Select project"
                searchPlaceholder="Search projects..."
                emptyText="No project found."
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="text-sm font-medium mb-2 block">Period</label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>
            Your logged time entries
          </CardDescription>
        </CardHeader>
        <CardContent>
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
