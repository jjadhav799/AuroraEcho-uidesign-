export interface Ticket {
  id: string;
  title: string;
  assignedDate: Date;
  closedDate: Date | null;
  status: "Open" | "In Progress" | "Closed";
  totalHours: number;
  users: string[];
  tasks: string[];
  description?: string;
  project?: string;
}
