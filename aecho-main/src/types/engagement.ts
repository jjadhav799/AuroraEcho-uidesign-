export interface EngagementFormData {
  // General
  engagement: string;
  billingClients: string[];
  nonStandardContract: boolean;
  partOfMSA: boolean;
  salesforceId: string;
  sensitivities: string[];
  engagementType: string;
  allocatedServices: string[];
  hostingPlatform: string;
  preferredTemplate: string;
  revenueCountry: string;
  outsideCounselApprovalEmail: string;
  arbitration: string;
  preferredDataCenterLocation: string;

  // Billing
  contractingEntity: string;
  contractSigned: boolean;
  effectiveDate: Date | undefined;
  currency: string;
  isBillable: boolean;
  billingType: string;
  paymentTerms: number;

  // Billing Contact
  billingContactCompany: string;
  billingContactEmail: string;
  billingContactAddress1: string;
  billingContactAddress2: string;
  billingContactAddress3: string;
  billingContactState: string;
  billingContactCountry: string;
  billingContactName: string;
  billingContactPhone: string;
  billingContactCity: string;
  billingContactZip: string;

  // Engaging Client
  engagingClientCompany: string;
  engagingClientEmail: string;
  engagingClientAddress1: string;
  engagingClientAddress2: string;
  engagingClientAddress3: string;
  engagingClientState: string;
  engagingClientCountry: string;
  engagingClientName: string;
  engagingClientPhone: string;
  engagingClientCity: string;
  engagingClientZip: string;

  // Notes
  notes: string;
}

export interface DropdownOptions {
  billingClients: string[];
  sensitivities: string[];
  engagementTypes: string[];
  allocatedServices: string[];
  hostingPlatforms: string[];
  preferredTemplates: string[];
  countries: string[];
  currencies: string[];
  billingTypes: string[];
  contractingEntities: string[];
  arbitrationOptions: string[];
  dataCenterLocations: string[];
}
