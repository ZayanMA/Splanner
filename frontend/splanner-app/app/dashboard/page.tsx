'use client';

import React, { useState, useEffect, useCallback } from "react";
import { addDays, parseISO } from "date-fns";
import WeekView from "@/components/Dashboard_Components/WeekView";
import DayView from "@/components/Dashboard_Components/DayView";
import UpcomingTasksView from "@/components/Dashboard_Components/UpcomingTasksView";
import InsightsView from "@/components/Dashboard_Components/InsightsView";

import type { Task } from "@/types/task";
import api from "@/lib/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Views state
  const [mainView, setMainView] = useState<"week" | "day" | "upcoming" | "insights">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayViewMode, setDayViewMode] = useState<"list" | "radial">("list");


  useEffect(() => {
    const fetchTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await api.get("tasks/");
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, []);

  // Parse due_date + due_time into a Date object for sorting/display
  const parseTaskDateTime = (task: Task) => {
    // If due_time is a full ISO timestamp, parse it directly
    if (task.due_time) {
      const dt = parseISO(task.due_time);
      if (!isNaN(dt.getTime())) return dt;
    }

    // Fallback: parse due_date only
    if (task.due_date) {
      const dt = parseISO(task.due_date);
      if (!isNaN(dt.getTime())) return dt;
    }

    // Invalid
    return new Date(NaN);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <header className="mb-6 flex justify-center space-x-4">
        {["week", "day", "upcoming", "insights"].map((view) => (
          <button
            key={view}
            onClick={() => setMainView(view as any)}
            className={`px-4 py-2 rounded ${
              mainView === view
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </header>


      {/* Main content */}
      <main>
        {loadingTasks ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading tasks...</p>
        ) : (
          <>
            {mainView === "week" && (
              <WeekView
                tasks={tasks}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                parseTaskDateTime={parseTaskDateTime}
              />
            )}
            {mainView === "day" && (
              <DayView
                tasks={tasks}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                parseTaskDateTime={parseTaskDateTime}
                dayViewMode={dayViewMode}
                setDayViewMode={setDayViewMode}
              />
            )}
            {mainView === "upcoming" && <UpcomingTasksView tasks={tasks} parseTaskDateTime={parseTaskDateTime} />}
            {mainView === "insights" && <InsightsView tasks={tasks} />}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
