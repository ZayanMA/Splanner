"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import AddNewActionMenuButton from "@/components/AddNewActionMenuButton";
import type { Task } from "@/types/task";

export default function Tasks() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/login");
    }
  }, [authenticated, loading, router]);

  useEffect(() => {
    if (loading || !authenticated) return;

    async function fetchTasks() {
      try {
        const res = await api.get("tasks/");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoadingTasks(false);
      }
    }

    fetchTasks();
  }, [authenticated, loading]);

  if (loading) return <p>Checking authentication...</p>;
  if (!authenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <div className="sticky top-0 z-20 bg-white dark:bg-black px-4 sm:px-6 lg:px-8 py-6 shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Your Tasks</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loadingTasks ? (
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
      </div>

      <AddNewActionMenuButton
        onTaskCreated={(newTask: Task) => {
          setTasks((prev) => [newTask, ...prev]);
        }}
      />
    </div>
  );
}
