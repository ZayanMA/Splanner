export type Task = {
  id?: number;
  title: string;
  due_date: string;
  due_time: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  course: number;
  description: string;
  tags: string[];
};