import React, { useMemo } from "react";
import { isAfter } from "date-fns";
import { Task } from "@/types/task";

type UpcomingTasksViewProps = {
  tasks: Task[];
  parseTaskDateTime: (task: Task) => Date;
};

const UpcomingTasksView: React.FC<UpcomingTasksViewProps> = ({ tasks, parseTaskDateTime }) => {
  const now = new Date();

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const dt = parseTaskDateTime(task);
        return !isNaN(dt.getTime()) && isAfter(dt, now);
      })
      .sort((a, b) => parseTaskDateTime(a).getTime() - parseTaskDateTime(b).getTime());
  }, [tasks, now, parseTaskDateTime]);

  const TaskListItem = ({ task }: { task: Task }) => {
    const dt = parseTaskDateTime(task);
    return (
      <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex justify-between items-center bg-white dark:bg-gray-800">
        <div>
          <h3 className={`font-semibold text-gray-900 dark:text-white ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isNaN(dt.getTime()) ? "Invalid date" : dt.toLocaleString()}
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
    <div className="space-y-4">
      {upcomingTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No upcoming tasks.</p>
      ) : (
        upcomingTasks.map((task) => <TaskListItem key={task.id} task={task} />)
      )}
      {/* TODO: Add infinite scroll */}
    </div>
  );
};

export default UpcomingTasksView;
