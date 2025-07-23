"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AddNewActionMenuButton from "@/components/AddNewActionMenuButton";

interface Task {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  due_date: string;
  completed: boolean;
}

export default function Dashboard() {
  const { authenticated } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // To avoid flicker

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!authenticated) {
      router.push("/login");
    } else {
      setAuthChecked(true);
    }
  }, [authenticated, router]);

  useEffect(() => {
    if (!authChecked) return; // Wait for auth check

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
  }, [authChecked]);

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  // Show nothing or a loading state if auth is not checked yet
  if (!authChecked) {
    return <p>Checking authentication...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Your Tasks</h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No tasks found. Add one!</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{task.title}</h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-100"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100"
                      : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Due: <span className="font-medium">{task.due_date}</span>
              </p>
              <p
                className={`text-sm mt-2 ${
                  task.completed
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {task.completed ? "✅ Completed" : "❌ Not Completed"}
              </p>
            </li>
          ))}
        </ul>
      )}

      <AddNewActionMenuButton />
    </div>
  );
}
