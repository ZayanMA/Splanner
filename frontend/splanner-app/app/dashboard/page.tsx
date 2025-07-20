"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

type Task = {
  id: number;
  title: string;
  due_date: string;
  priority: string;
  completed: boolean;
};

export default function Dashboard() {
  useAuth(true); // require login

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await api.get("tasks/");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  if (loading) return <p className="mt-10 text-center">Loading tasks...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task.id} className="border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <span className={`px-2 py-1 rounded text-sm ${task.priority === "high" ? "bg-red-100 text-red-700" : task.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600">Due: {task.due_date}</p>
              <p className={`text-sm mt-1 ${task.completed ? "text-green-600" : "text-gray-500"}`}>
                {task.completed ? "✅ Completed" : "❌ Not Completed"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
