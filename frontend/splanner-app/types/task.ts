export type Task = {
  id?: number;
  title: string;
  due_date: string;
  due_time: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  module: number;
  description: string;
  tags: string[];
};