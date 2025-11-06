import { UseFormReturn } from "react-hook-form";
import { EngagementFormValues } from "@/lib/validation";
import { DropdownOptions } from "@/types/engagement";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneralSectionProps {
  form: UseFormReturn<EngagementFormValues>;
  options: DropdownOptions;
}

export function GeneralSection({ form, options }: GeneralSectionProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="engagement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engagement Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter engagement name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="billingClients"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Billing Clients *</FormLabel>
            <Select onValueChange={(value) => field.onChange([value])} value={field.value?.[0]}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing client" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.billingClients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sensitivities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sensitivities *</FormLabel>
            <Select onValueChange={(value) => field.onChange([value])} value={field.value?.[0]}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select sensitivity" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.sensitivities.map((sensitivity) => (
                  <SelectItem key={sensitivity} value={sensitivity}>
                    {sensitivity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="engagementType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Engagement Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.engagementTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allocatedServices"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allocated Services *</FormLabel>
            <Select onValueChange={(value) => field.onChange([value])} value={field.value?.[0]}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.allocatedServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferredTemplate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Hosting Template</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.preferredTemplates.map((template) => (
                  <SelectItem key={template} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hostingPlatform"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hosting Platform *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.hostingPlatforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="revenueCountry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Revenue Country *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferredDataCenterLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Data Center Location *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.dataCenterLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="salesforceId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salesforce ID (Read-only)</FormLabel>
            <FormControl>
              <Input {...field} disabled className="bg-muted" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="outsideCounselApprovalEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Outside Counsel Approval Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="arbitration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Arbitration</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.arbitrationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="sm:col-span-2 space-y-4">
        <FormField
          control={form.control}
          name="nonStandardContract"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Non-standard Contract
              </FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="partOfMSA"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal cursor-pointer">
                Part of MSA
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
