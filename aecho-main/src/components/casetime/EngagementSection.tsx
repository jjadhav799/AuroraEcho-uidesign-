import { UseFormReturn } from "react-hook-form";
import { CaseTimeFormValues } from "@/lib/caseTimeValidation";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";

interface EngagementSectionProps {
  form: UseFormReturn<CaseTimeFormValues>;
  engagements: Array<{ id: string; name: string }>;
  onEngagementChange: (id: string) => void;
}

export default function EngagementSection({
  form,
  engagements,
  onEngagementChange,
}: EngagementSectionProps) {
  const engagementOptions: ComboboxOption[] = engagements.map((eng) => ({
    value: eng.id,
    label: eng.name,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="engagementId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engagement *</FormLabel>
            <FormControl>
              <Combobox
                options={engagementOptions}
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  onEngagementChange(value);
                }}
                placeholder="Select engagement"
                searchPlaceholder="Search engagements..."
                emptyText="No engagement found."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="engagementNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engagement No</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-muted" />
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
            <FormLabel>H Code</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-muted" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Name</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-muted" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
