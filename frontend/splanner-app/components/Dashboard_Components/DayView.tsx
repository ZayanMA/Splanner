import React, { useMemo, useState, useEffect } from "react";
import { format, isSameDay, addDays } from "date-fns";
import { useSwipeable } from "react-swipeable";
import { Task } from "@/types/task";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";

type DayViewProps = {
  tasks: Task[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  parseTaskDateTime: (task: Task) => Date;
  dayViewMode: "list" | "radial";
  setDayViewMode: (mode: "list" | "radial") => void;
};

const DayView: React.FC<DayViewProps> = ({
  tasks,
  currentDate,
  setCurrentDate,
  parseTaskDateTime,
  dayViewMode,
  setDayViewMode,
}) => {
  // Swipe direction for animation: "left", "right", or null
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  // Controls if animation is active (for smooth transition)
  const [animating, setAnimating] = useState(false);

  const tasksToday = useMemo(() => {
    return tasks
      .filter((task) => {
        const dt = parseTaskDateTime(task);
        return !isNaN(dt.getTime()) && isSameDay(dt, currentDate);
      })
      .sort((a, b) => parseTaskDateTime(a).getTime() - parseTaskDateTime(b).getTime());
  }, [tasks, currentDate, parseTaskDateTime]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => {
        if (animating) return;
        setSwipeDirection("left");   // Slide out left
        setAnimating(true);

        setTimeout(() => {
        setCurrentDate(addDays(currentDate, 1)); // Update data

        setSwipeDirection("right");  // Prepare slide in from right

        setTimeout(() => {
            setAnimating(false);
            setSwipeDirection(null);  // Reset to default
        }, 300);  // Wait for slide-in animation
        }, 300);  // Wait for slide-out animation
    },
    onSwipedRight: () => {
        if (animating) return;
        setSwipeDirection("right");  // Slide out right
        setAnimating(true);

        setTimeout(() => {
        setCurrentDate(addDays(currentDate, -1));  // Update data

        setSwipeDirection("left");  // Prepare slide in from left

        setTimeout(() => {
            setAnimating(false);
            setSwipeDirection(null);
        }, 300);
        }, 300);
    },
    trackMouse: true,
    });

  const TaskListItem = ({ task }: { task: Task }) => {
    const dt = parseTaskDateTime(task);
    return (
      <div className="p-4 mb-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center bg-white dark:bg-gray-800 transition-shadow hover:shadow-md">
        <div>
          <h3
            className={`font-semibold text-gray-900 dark:text-white ${
              task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""
            }`}
          >
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isNaN(dt.getTime()) ? "Invalid date" : format(dt, "p, MMM d")}
          </p>
          {task.tags && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
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
        {task.completed && <span className="text-green-600 dark:text-green-400 font-bold text-xl">✔</span>}
      </div>
    );
  };

  // Classes for animation on swipe
  // Slide out opposite direction before changing content to new date, then slide in (handled by state & re-render)
  // We do only slide out here, slide in is default state.
  let animationClass = "";
  if (animating && swipeDirection === "left") animationClass = "translate-x-[-100%] opacity-0";
  else if (animating && swipeDirection === "right") animationClass = "translate-x-[100%] opacity-0";
  else animationClass = "translate-x-0 opacity-100";

  return (
    <div {...handlers} className="touch-pan-y max-w-4xl mx-auto px-4">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 py-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between px-2 rounded-b-lg">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 select-none">
          {format(currentDate, "EEEE, MMMM do, yyyy")}
        </p>

        <div className="mt-3 md:mt-0 flex items-center space-x-4">
          {/* Nav buttons */}
          <button
            aria-label="Previous day"
            onClick={() => {
              if (animating) return;
              setSwipeDirection("right");
              setAnimating(true);
              setTimeout(() => {
                setCurrentDate(addDays(currentDate, -1));
                setAnimating(false);
                setSwipeDirection(null);
              }, 300);
            }}
            className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <ChevronLeftIcon fontSize="large" />
          </button>

          <button
            aria-label="Today"
            onClick={() => setCurrentDate(new Date())}
            className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <TodayIcon fontSize="large" />
          </button>

          <button
            aria-label="Next day"
            onClick={() => {
              if (animating) return;
              setSwipeDirection("left");
              setAnimating(true);
              setTimeout(() => {
                setCurrentDate(addDays(currentDate, 1));
                setAnimating(false);
                setSwipeDirection(null);
              }, 300);
            }}
            className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <ChevronRightIcon fontSize="large" />
          </button>

          {/* Day view mode toggle */}
          <div className="ml-6 flex space-x-2">
            <button
              onClick={() => setDayViewMode("list")}
              className={`px-3 py-1 rounded ${
                dayViewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setDayViewMode("radial")}
              className={`px-3 py-1 rounded ${
                dayViewMode === "radial"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              Radial
            </button>
          </div>
        </div>
      </div>

      {/* Content container with swipe animation */}
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow p-4 min-h-[400px] transform transition-all duration-300 ease-in-out ${animationClass}`}
      >
        {dayViewMode === "list" && (
          <>
            {tasksToday.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center select-none">No tasks for today.</p>
            ) : (
              tasksToday.map((task) => <TaskListItem key={task.id} task={task} />)
            )}
          </>
        )}

        {dayViewMode === "radial" && (
          <div className="text-center text-gray-500 dark:text-gray-400 select-none">
            Radial view coming soon!
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-400 dark:text-gray-600 mt-4 select-none">
        Swipe left/right to change days
      </p>
    </div>
  );
};

export default DayView;
