import { UseFormReturn } from "react-hook-form";
import { CaseTimeFormValues } from "@/lib/caseTimeValidation";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { ServiceLine, Task } from "@/types/caseTime";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface WorkDetailsSectionProps {
  form: UseFormReturn<CaseTimeFormValues>;
  serviceLines: ServiceLine[];
  tasks: Task[];
}

export default function WorkDetailsSection({
  form,
  serviceLines,
  tasks,
}: WorkDetailsSectionProps) {
  const [open, setOpen] = useState(false);
  const selectedServiceLine = form.watch("serviceLine");
  const selectedTasks = form.watch("task");
  const filteredTasks = tasks.filter(
    (task) => task.serviceLineId === selectedServiceLine
  );

  const serviceLineOptions: ComboboxOption[] = serviceLines.map((line) => ({
    value: line.id,
    label: line.name,
  }));

  // Handle multi-select for tasks
  const selectedTaskArray = selectedTasks ? selectedTasks.split(",").filter(Boolean) : [];

  const toggleTask = (taskId: string) => {
    const currentTasks = selectedTaskArray;
    const newTasks = currentTasks.includes(taskId)
      ? currentTasks.filter((id) => id !== taskId)
      : [...currentTasks, taskId];
    form.setValue("task", newTasks.join(","));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="serviceLine"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Line *</FormLabel>
            <FormControl>
              <Combobox
                options={serviceLineOptions}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("task", "");
                }}
                placeholder="Select service line"
                searchPlaceholder="Search service lines..."
                emptyText="No service line found."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="task"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tasks (Multiple Selection)</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!selectedServiceLine}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {selectedTaskArray.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {selectedTaskArray.map((taskId) => {
                          const task = filteredTasks.find((t) => t.id === taskId);
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
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded cursor-pointer"
                        onClick={() => toggleTask(task.id)}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedTaskArray.includes(task.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="text-sm">{task.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      {selectedServiceLine ? "No tasks available" : "Select a service line first"}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
