import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const enhancedTimeEntrySchema = z.object({
  project: z.string().min(1, "Project is required"),
  hCode: z.string(),
  ticket: z.string(),
  service: z.string().min(1, "Service is required"),
  tasks: z.array(z.string()).min(1, "At least one task is required"),
  date: z.date(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  billableHours: z.string(),
  nonBillableHours: z.string(),
});

type EnhancedTimeEntryFormValues = z.infer<typeof enhancedTimeEntrySchema>;

export function TimeEntryFormEnhanced() {
  const { toast } = useToast();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [taskPopoverOpen, setTaskPopoverOpen] = useState(false);

  const form = useForm<EnhancedTimeEntryFormValues>({
    resolver: zodResolver(enhancedTimeEntrySchema),
    defaultValues: {
      project: "",
      hCode: "",
      ticket: "",
      service: "",
      tasks: [],
      date: new Date(),
      startTime: "",
      endTime: "",
      billableHours: "",
      nonBillableHours: "",
    },
  });

  const projects = [
    { id: "1", name: "iAurora Web Revamp", hCode: "H-001" },
    { id: "2", name: "Claims ETL Migration", hCode: "H-002" },
    { id: "3", name: "Fraud Analytics PoC", hCode: "H-003" },
  ];

  const tickets = [
    { id: "TKT-001", title: "Fix login authentication bug" },
    { id: "TKT-002", title: "Implement dashboard analytics" },
    { id: "TKT-003", title: "Database migration script" },
  ];

  const services = [
    { id: "1", name: "Development" },
    { id: "2", name: "Testing" },
    { id: "3", name: "Design" },
  ];

  const availableTasks = [
    { id: "1", name: "Bug Fix" },
    { id: "2", name: "Feature Development" },
    { id: "3", name: "Code Review" },
    { id: "4", name: "Documentation" },
    { id: "5", name: "Testing" },
  ];

  const projectOptions: ComboboxOption[] = projects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const ticketOptions: ComboboxOption[] = tickets.map((t) => ({
    value: t.id,
    label: `${t.id}: ${t.title}`,
  }));

  const serviceOptions: ComboboxOption[] = services.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      form.setValue("hCode", project.hCode);
    }
  };

  const handleTaskToggle = (taskId: string) => {
    const newTasks = selectedTasks.includes(taskId)
      ? selectedTasks.filter((t) => t !== taskId)
      : [...selectedTasks, taskId];
    setSelectedTasks(newTasks);
    form.setValue("tasks", newTasks);
  };

  const onSubmit = async (data: EnhancedTimeEntryFormValues) => {
    try {
      toast({
        title: "Success",
        description: "Time entry logged successfully",
      });
      form.reset();
      setSelectedTasks([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log time entry",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project *</FormLabel>
                <FormControl>
                  <Combobox
                    options={projectOptions}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleProjectChange(value);
                    }}
                    placeholder="Select project"
                    searchPlaceholder="Search projects..."
                    emptyText="No project found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>H-Code</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ticket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ticket</FormLabel>
                <FormControl>
                  <Combobox
                    options={ticketOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select ticket"
                    searchPlaceholder="Search tickets..."
                    emptyText="No ticket found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service *</FormLabel>
              <FormControl>
                <Combobox
                  options={serviceOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select service"
                  searchPlaceholder="Search services..."
                  emptyText="No service found."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tasks"
          render={() => (
            <FormItem>
              <FormLabel>Tasks (Multiple Selection)</FormLabel>
              <Popover open={taskPopoverOpen} onOpenChange={setTaskPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        selectedTasks.length === 0 && "text-muted-foreground"
                      )}
                    >
                      {selectedTasks.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {selectedTasks.map((taskId) => {
                            const task = availableTasks.find((t) => t.id === taskId);
                            return task ? (
                              <Badge key={taskId} variant="secondary" className="text-xs">
                                {task.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        "Select tasks"
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-popover" align="start">
                  <div className="max-h-60 overflow-y-auto p-2">
                    {availableTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => handleTaskToggle(task.id)}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedTasks.includes(task.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="text-sm">{task.name}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time *</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="billableHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billable Hours</FormLabel>
                <FormControl>
                  <Input type="number" step="0.5" placeholder="0.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nonBillableHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Non-Billable Hours</FormLabel>
                <FormControl>
                  <Input type="number" step="0.5" placeholder="0.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Clear
          </Button>
          <Button type="submit">Log Time</Button>
        </div>
      </form>
    </Form>
  );
}
