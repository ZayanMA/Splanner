'use client'

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Task = {
  id: number;
  title: string;
  due_date: string;
  priority: string;
  tags: string[];
  completed: boolean;
  user: number;
  course: any;
};

export default function Dashboard() {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");

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

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.due_date),
    end: new Date(task.due_date),
  }));

  return (
    <div className="bg-white dark:bg-black pb-24">
      {/* Shrunk sticky header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-black px-4 sm:px-6 lg:px-8 py-3 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Schedule</h1>
      </div>

      {/* Add top margin so calendar isn’t hidden under header */}
      <div className="mt-6 px-4 sm:px-6 lg:px-8">
        {loadingTasks ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No tasks found.</p>
        ) : (
          <div className="dark:text-white">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              className="rounded-lg shadow-md bg-white dark:bg-gray-800 dark:text-white"
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              view={currentView}
              onView={(view) => setCurrentView(view)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
