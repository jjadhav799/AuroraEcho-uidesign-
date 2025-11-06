import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { caseTimeSchema, CaseTimeFormValues } from "@/lib/caseTimeValidation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ServiceLine, Task, EngagementDetail } from "@/types/caseTime";
import EngagementSection from "@/components/casetime/EngagementSection";
import WorkDetailsSection from "@/components/casetime/WorkDetailsSection";
import DayEntrySection from "@/components/casetime/DayEntrySection";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function TimeEntryForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(true);

  const form = useForm<CaseTimeFormValues>({
    resolver: zodResolver(caseTimeSchema),
    defaultValues: {
      engagementId: "",
      engagementName: "",
      engagementNo: "",
      hCode: "",
      clientName: "",
      serviceLine: "",
      task: "",
      startTime: "",
      endTime: "",
      duration: 0,
      date: new Date(),
    },
  });

  const { data: engagements } = useQuery({
    queryKey: ["engagements"],
    queryFn: async () => {
      const response = await fetch("/api/engagements");
      if (!response.ok) throw new Error("Failed to fetch engagements");
      return response.json() as Promise<Array<{ id: number; name: string; client: string }>>;
    },
  });

  const { data: serviceLines = [] } = useQuery<ServiceLine[]>({
    queryKey: ["serviceLines"],
    queryFn: async () => {
      const response = await fetch("/api/service-lines");
      if (!response.ok) throw new Error("Failed to fetch service lines");
      return response.json();
    },
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      return response.json();
    },
  });

  const handleEngagementChange = async (engagementId: string) => {
    try {
      const response = await fetch(`/api/engagement-details/${engagementId}`);
      if (!response.ok) throw new Error("Failed to fetch engagement details");
      const details: EngagementDetail = await response.json();
      
      form.setValue("engagementName", details.name);
      form.setValue("engagementNo", details.engagementNo);
      form.setValue("hCode", details.hCode);
      form.setValue("clientName", details.clientName);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load engagement details",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: CaseTimeFormValues) => {
    try {
      const response = await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit time entry");

      toast({
        title: "Success",
        description: "Time entry logged successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["weeklySummary"] });

      form.reset({
        engagementId: data.engagementId,
        engagementName: data.engagementName,
        engagementNo: data.engagementNo,
        hCode: data.hCode,
        clientName: data.clientName,
        serviceLine: "",
        task: "",
        startTime: "",
        endTime: "",
        duration: 0,
        date: new Date(),
      });
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
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Engagement</h3>
            <EngagementSection
              form={form}
              engagements={(engagements || []).map((e) => ({
                id: e.id.toString(),
                name: e.name,
              }))}
              onEngagementChange={handleEngagementChange}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Work Details</h3>
            <WorkDetailsSection
              form={form}
              serviceLines={serviceLines}
              tasks={tasks}
            />
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">Day Entry</h3>
            <DayEntrySection form={form} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Clear
          </Button>
          <Button type="submit">Log Time</Button>
        </div>
      </form>
    </Form>
  );
}
