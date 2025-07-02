// Task type inferred from usage in KanbanBoard and TaskCard
export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  assignee_id?: string;
  created_at?: string;
};

// User type inferred from usage and AuthContext, with avatar_url
export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
};


export type Status = 'To Do' | 'In Progress' | 'Done';
