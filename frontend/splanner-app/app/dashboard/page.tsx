'use client'

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import api from "@/lib/api";
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month"); // default view is month

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

  const events = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: new Date(task.due_date),
    end: new Date(task.due_date),
  }));

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Schedule
      </h1>

      {loading ? (
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
  );
}
