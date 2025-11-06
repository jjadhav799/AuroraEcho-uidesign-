export interface CaseTimeFormData {
  // Engagement (readonly after selection)
  engagementId: string;
  engagementName: string;
  engagementNo: string;
  hCode: string;
  clientName: string;

  // Work Details
  serviceLine: string;
  task: string;

  // Day Entry
  startTime: string;
  endTime: string;
  duration: number;
  date: Date;
}

export interface ServiceLine {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  name: string;
  serviceLineId: string;
}

export interface EngagementDetail {
  id: string;
  name: string;
  engagementNo: string;
  hCode: string;
  clientName: string;
}

export interface TimeEntry {
  id: string;
  date: Date;
  project: string;
  hCode: string;
  serviceLine: string;
  task: string;
  startTime: string;
  endTime: string;
  duration: number;
  billableHours: number;
  nonBillableHours: number;
  engagementId: string;
}

export interface WeeklySummary {
  totalHours: number;
  entries: TimeEntry[];
}
