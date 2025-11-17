export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  organizationId: string;
  assignedToId: string | null;
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

