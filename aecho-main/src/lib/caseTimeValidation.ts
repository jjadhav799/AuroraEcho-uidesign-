import { z } from 'zod';

export const caseTimeSchema = z.object({
  engagementId: z.string().min(1, 'Please select an engagement'),
  engagementName: z.string(),
  engagementNo: z.string(),
  hCode: z.string(),
  clientName: z.string(),
  serviceLine: z.string().min(1, 'Service line is required'),
  task: z.string().min(1, 'Task is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  duration: z.number(),
  date: z.date(),
}).refine((data) => {
  if (!data.startTime || !data.endTime) return true;
  const start = new Date(`2000-01-01T${data.startTime}`);
  const end = new Date(`2000-01-01T${data.endTime}`);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export type CaseTimeFormValues = z.infer<typeof caseTimeSchema>;
