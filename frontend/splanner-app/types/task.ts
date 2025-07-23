export type Task = {
  id?: number;
  title: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  tags: string[];
};