import React, { useMemo, useState } from "react";
import { format, addDays, parseISO } from "date-fns";
import { useSwipeable } from "react-swipeable";
import { Task } from "@/types/task";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";

type WeekViewProps = {
  tasks: Task[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  parseTaskDateTime: (task: Task) => Date;
};

const formatDateForISO = (dateStr: string) => {
  const [dd, mm, yyyy] = dateStr.split("-");
  return `${yyyy}-${mm}-${dd}`;
};

const formatDateDisplay = (date: Date) => format(date, "EEE, MMM d");

const WeekView: React.FC<WeekViewProps> = ({
  tasks,
  currentDate,
  setCurrentDate,
  parseTaskDateTime,
}) => {
  // Same swipe direction & animating state to control animation and direction
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [animating, setAnimating] = useState(false);

  // Calculate start of week (Monday)
  const startWeek = useMemo(() => {
    const d = currentDate;
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    return addDays(d, diff);
  }, [currentDate]);

  // Calculate week end (Sunday)
  const endWeek = useMemo(() => addDays(startWeek, 6), [startWeek]);

  // Group tasks by day string key
  const tasksByWeekDay = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    for (let i = 0; i < 7; i++) {
      const day = addDays(startWeek, i);
      grouped[format(day, "dd-MM-yyyy")] = [];
    }

    tasks.forEach((task) => {
      const dt = parseTaskDateTime(task);
      if (isNaN(dt.getTime())) return;
      const key = format(dt, "dd-MM-yyyy");
      if (key in grouped) grouped[key].push(task);
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort(
        (a, b) => parseTaskDateTime(a).getTime() - parseTaskDateTime(b).getTime()
      );
    });

    return grouped;
  }, [tasks, startWeek, parseTaskDateTime]);

  // Swipe handlers with animation + direction logic (same as DayView)
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (animating) return;
      setSwipeDirection("left");
      setAnimating(true);
      setTimeout(() => {
        setCurrentDate(addDays(currentDate, 7));
        setSwipeDirection("right");
        setTimeout(() => {
          setAnimating(false);
          setSwipeDirection(null);
        }, 300);
      }, 300);
    },
    onSwipedRight: () => {
      if (animating) return;
      setSwipeDirection("right");
      setAnimating(true);
      setTimeout(() => {
        setCurrentDate(addDays(currentDate, -7));
        setSwipeDirection("left");
        setTimeout(() => {
          setAnimating(false);
          setSwipeDirection(null);
        }, 300);
      }, 300);
    },
    trackMouse: true,
  });

  // Task item same styling as DayView's
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
        {task.completed && (
          <span className="text-green-600 dark:text-green-400 font-bold text-xl">✔</span>
        )}
      </div>
    );
  };

  // Animation classes for slide in/out
  let animationClass = "";
  if (animating && swipeDirection === "left") animationClass = "translate-x-[-100%] opacity-0";
  else if (animating && swipeDirection === "right") animationClass = "translate-x-[100%] opacity-0";
  else animationClass = "translate-x-0 opacity-100";

  // Format week range string
  const weekRangeString = `${format(startWeek, "MMM d")} - ${format(endWeek, "MMM d, yyyy")}`;

  return (
    <div {...handlers} className="touch-pan-y max-w-4xl mx-auto px-4">
      {/* Sticky header with navigation buttons and week range */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 py-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between px-2 rounded-b-lg">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 select-none">
          Week: {weekRangeString}
        </p>

        <div className="mt-3 md:mt-0 flex items-center space-x-4">
          {/* Navigation buttons */}
          <button
            aria-label="Previous week"
            onClick={() => {
              if (animating) return;
              setSwipeDirection("right");
              setAnimating(true);
              setTimeout(() => {
                setCurrentDate(addDays(currentDate, -7));
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
            aria-label="Next week"
            onClick={() => {
              if (animating) return;
              setSwipeDirection("left");
              setAnimating(true);
              setTimeout(() => {
                setCurrentDate(addDays(currentDate, 7));
                setAnimating(false);
                setSwipeDirection(null);
              }, 300);
            }}
            className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            <ChevronRightIcon fontSize="large" />
          </button>
        </div>
      </div>

      {/* Content container with animation */}
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg shadow p-4 min-h-[400px] transform transition-all duration-300 ease-in-out ${animationClass}`}
      >
        {Object.entries(tasksByWeekDay).map(([dayKey, dayTasks]) => {
          const dayDate = parseISO(formatDateForISO(dayKey));
          return (
            <div key={dayKey} className="mb-6">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                {formatDateDisplay(dayDate)}
              </h2>
              {dayTasks.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 select-none">No tasks</p>
              ) : (
                dayTasks.map((task) => <TaskListItem key={task.id} task={task} />)
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-gray-400 dark:text-gray-600 mt-4 select-none">
        Swipe left/right to change weeks
      </p>
    </div>
  );
};

export default WeekView;
