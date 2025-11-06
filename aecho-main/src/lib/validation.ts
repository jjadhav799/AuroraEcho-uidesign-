import { z } from "zod";

export const engagementSchema = z.object({
  // General - Required fields
  engagement: z.string().min(1, "Engagement name is required"),
  billingClients: z.array(z.string()).min(1, "At least one billing client is required"),
  nonStandardContract: z.boolean(),
  partOfMSA: z.boolean(),
  salesforceId: z.string(),
  sensitivities: z.array(z.string()).min(1, "At least one sensitivity is required"),
  engagementType: z.string().min(1, "Engagement type is required"),
  allocatedServices: z.array(z.string()).min(1, "At least one service is required"),
  hostingPlatform: z.string().min(1, "Hosting platform is required"),
  preferredTemplate: z.string(),
  revenueCountry: z.string().min(1, "Revenue country is required"),
  outsideCounselApprovalEmail: z.string().email().or(z.literal("")),
  arbitration: z.string(),
  preferredDataCenterLocation: z.string().min(1, "Data center location is required"),

  // Billing - Required fields
  contractingEntity: z.string().min(1, "Contracting entity is required"),
  contractSigned: z.boolean(),
  effectiveDate: z.date().optional(),
  currency: z.string().min(1, "Currency is required"),
  isBillable: z.boolean(),
  billingType: z.string().min(1, "Billing type is required"),
  paymentTerms: z.number().min(0),

  // Billing Contact
  billingContactCompany: z.string(),
  billingContactEmail: z.string().email().or(z.literal("")),
  billingContactAddress1: z.string(),
  billingContactAddress2: z.string(),
  billingContactAddress3: z.string(),
  billingContactState: z.string(),
  billingContactCountry: z.string(),
  billingContactName: z.string(),
  billingContactPhone: z.string(),
  billingContactCity: z.string(),
  billingContactZip: z.string(),

  // Engaging Client
  engagingClientCompany: z.string(),
  engagingClientEmail: z.string().email().or(z.literal("")),
  engagingClientAddress1: z.string(),
  engagingClientAddress2: z.string(),
  engagingClientAddress3: z.string(),
  engagingClientState: z.string(),
  engagingClientCountry: z.string(),
  engagingClientName: z.string(),
  engagingClientPhone: z.string(),
  engagingClientCity: z.string(),
  engagingClientZip: z.string(),

  // Notes
  notes: z.string(),
});

export type EngagementFormValues = z.infer<typeof engagementSchema>;
