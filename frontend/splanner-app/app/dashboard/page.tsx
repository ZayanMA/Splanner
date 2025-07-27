'use client';

import { useEffect, useState, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay, isAfter, parseISO } from "date-fns";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import useIsMobile from "../../hooks/useIsMobile";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Task } from "@/types/task";

const COLORS = ["#00C49F", "#FF8042", "#FFBB28", "#8884d8", "#0088FE"];

type DayViewMode = "radial" | "list";

const Dashboard = () => {
  const { authenticated, loading } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // UI State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mainView, setMainView] = useState<"week" | "day" | "upcoming" | "insights">("week");
  const [dayViewMode, setDayViewMode] = useState<DayViewMode>("list");

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push("/login");
    }
  }, [authenticated, loading, router]);

  useEffect(() => {
    if (loading || !authenticated) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get("tasks/");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [authenticated, loading]);

  // Helper: parse date+time into Date object
  // FIX: due_date is "yyyy-MM-dd", due_time is ISO datetime string like "2025-07-26T14:56:39.689767Z"
  // We want to combine due_date + time part of due_time
  const parseTaskDateTime = (task: Task) => {
    try {
      if (!task.due_date || !task.due_time) return new Date(NaN);
      // Extract time part from due_time ISO string
      const timePart = task.due_time.split("T")[1]; // e.g. "14:56:39.689767Z"
      if (!timePart) return new Date(task.due_date); // fallback: just date
      // Compose full ISO string with date + time
      const combined = `${task.due_date}T${timePart}`;
      return new Date(combined);
    } catch {
      return new Date(NaN);
    }
  };

  // === WEEK VIEW ===
  // Get start of current week (Monday)
  const startWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Group tasks by day of current week using "dd-MM-yyyy" format keys
  const tasksByWeekDay = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    // Initialize keys for each day of week
    for (let i = 0; i < 7; i++) {
      const day = addDays(startWeek, i);
      grouped[format(day, "dd-MM-yyyy")] = [];
    }

    tasks.forEach((task) => {
      const dt = parseTaskDateTime(task);
      if (isNaN(dt.getTime())) return; // ignore invalid dates

      const key = format(dt, "dd-MM-yyyy"); // must match the keys in grouped
      if (key in grouped) {
        grouped[key].push(task);
      }
    });

    // Sort each day’s tasks by time ascending
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => parseTaskDateTime(a).getTime() - parseTaskDateTime(b).getTime());
    });

    return grouped;
  }, [tasks, startWeek]);

  // === DAY VIEW ===
  // Filter tasks for the current selected day
  const tasksToday = useMemo(() => {
    return tasks
      .filter((task) => {
        const dt = parseTaskDateTime(task);
        return !isNaN(dt.getTime()) && isSameDay(dt, currentDate);
      })
      .sort((a, b) => parseTaskDateTime(a).getTime() - parseTaskDateTime(b).getTime());
  }, [tasks, currentDate]);

  // === UPCOMING TASKS VIEW ===
  // All tasks from now forward, sorted ascending
  const upcomingTasks = useMemo(() => {
    const now = new Date();
    return tasks
      .filter((task) => {
        const dt = parseTaskDateTime(task);
        return !isNaN(dt.getTime()) && isAfter(dt, now);
      })
      .sort((a, b) => parseTaskDateTime(a).getTime() - parseTaskDateTime(b).getTime());
  }, [tasks]);

  // === INSIGHTS DATA ===
  const pieData = [
    { name: "Completed", value: tasks.filter((t) => t.completed).length },
    { name: "Pending", value: tasks.filter((t) => !t.completed).length },
  ];

  // === UI Render Helpers ===
  const formatDateDisplay = (date: Date) => format(date, "EEE, MMM d");

  // === Handlers ===
  const changeDay = (offset: number) => {
    setCurrentDate(addDays(currentDate, offset));
  };

  // === Components for views ===

  // Week View Component
  const WeekView = () => (
    <div className="space-y-6">
      {Object.entries(tasksByWeekDay).map(([dayKey, dayTasks]) => {
        const dayDate = parseISO(formatDateForISO(dayKey));
        return (
          <div key={dayKey} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              {formatDateDisplay(dayDate)}
            </h2>
            {dayTasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No tasks</p>
            ) : (
              dayTasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))
            )}
          </div>
        );
      })}
    </div>
  );

  // Helper to convert "dd-MM-yyyy" to "yyyy-MM-dd" for parseISO
  const formatDateForISO = (dateStr: string) => {
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Day List View Component
  const DayListView = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
      {tasksToday.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No tasks for today.</p>
      ) : (
        tasksToday.map((task) => <TaskListItem key={task.id} task={task} />)
      )}
    </div>
  );

  // Upcoming Tasks View Component
  const UpcomingTasksView = () => (
    <div className="space-y-4">
      {upcomingTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No upcoming tasks.</p>
      ) : (
        upcomingTasks.map((task) => (
          <TaskListItem key={task.id} task={task} />
        ))
      )}
      {/* TODO: Implement infinite scroll here */}
    </div>
  );

  // Insights View Component
  const InsightsView = () => (
    <div className="w-full h-[400px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  // Task List Item (used in all lists)
  const TaskListItem = ({ task }: { task: Task }) => {
    const dt = parseTaskDateTime(task);
    return (
      <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center bg-white dark:bg-gray-800">
        <div>
          <h3 className={`font-semibold text-gray-900 dark:text-white ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isNaN(dt.getTime()) ? "Invalid date" : format(dt, "p, MMM d")}
          </p>
          {task.tags && task.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {task.completed && <span className="text-green-600 dark:text-green-400 font-bold text-lg">✔</span>}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-24 px-4 sm:px-6 lg:px-8">
      {/* Header with main view tabs */}
      <header className="sticky top-0 z-30 bg-white dark:bg-black py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-800 mb-4">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
          {mainView === "week" && "Week Overview"}
          {mainView === "day" && `Tasks for ${format(currentDate, "EEEE, MMM d")}`}
          {mainView === "upcoming" && "Upcoming Tasks"}
          {mainView === "insights" && "Task Insights"}
        </h1>

        <nav className="flex space-x-2">
          {["week", "day", "upcoming", "insights"].map((view) => (
            <button
              key={view}
              onClick={() => setMainView(view as typeof mainView)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mainView === view
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {/* Week Navigation */}
      {mainView === "week" && (
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setCurrentDate(addDays(currentDate, -7))}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
          >
            &lt; Previous Week
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(addDays(currentDate, 7))}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
          >
            Next Week &gt;
          </button>
        </div>
      )}

      {/* Day Navigation and View Mode Toggle */}
      {mainView === "day" && (
        <div className="mb-6 flex items-center space-x-4">
          <button onClick={() => changeDay(-1)} className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded">
            &lt; Prev Day
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded">
            Today
          </button>
          <button onClick={() => changeDay(1)} className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded">
            Next Day &gt;
          </button>

          {/* Day View Mode Toggle */}
          <div className="ml-auto flex space-x-2">
            <button
              onClick={() => setDayViewMode("list")}
              className={`px-3 py-1 rounded ${dayViewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
            >
              List
            </button>
            <button
              onClick={() => setDayViewMode("radial")}
              className={`px-3 py-1 rounded ${dayViewMode === "radial" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"}`}
            >
              Radial
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main>
        {loadingTasks ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading tasks...</p>
        ) : (
          <>
            {mainView === "week" && <WeekView />}
            {mainView === "day" && dayViewMode === "list" && <DayListView />}
            {mainView === "day" && dayViewMode === "radial" && (
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow text-center text-gray-500 dark:text-gray-400">
                {/* Radial view not implemented yet */}
                Radial view coming soon!
              </div>
            )}
            {mainView === "upcoming" && <UpcomingTasksView />}
            {mainView === "insights" && <InsightsView />}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
