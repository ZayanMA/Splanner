"use client";
import { Controller, useForm } from "react-hook-form";
import api from "@/lib/api";
import ReactDOM from "react-dom";
import { Task } from "@/types/task";
import ForeignKeySelect from "@/components/ForeignKeySelect";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TaskModal({
  mode,
  initialData,
  onClose,
  onSuccess,
}: {
  mode: "create" | "edit";
  initialData?: Task;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}) {
  const isEdit = mode === "edit";
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent background scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      due_date: initialData?.due_date || "",
      due_time: "", // handled separately
      priority: initialData?.priority || "medium",
      course: initialData?.course || null,
      tags: initialData?.tags?.join(", ") || "",
    },
  });

  const onSubmit = async (data: any) => {
    setSubmitError(null);

    const dueDate = data.due_date || "";
    const dueTime = data.due_time || "";
    const combinedDueDateTime =
      dueDate && dueTime ? new Date(`${dueDate}T${dueTime}`) : null;

    const payload = {
      title: data.title?.trim() || null,
      description: data.description?.trim() || null,
      due_date: dueDate || null,
      due_time: combinedDueDateTime ? combinedDueDateTime.toISOString() : null,
      priority: data.priority || null,
      course: data.course || null,
      tags: data.tags ? data.tags.split(",").map((t: string) => t.trim()) : [],
    };

    try {
      const res = isEdit
        ? await api.put(`tasks/${initialData?.id}/`, payload)
        : await api.post("tasks/", payload);
      onSuccess(res.data);
      onClose();
    } catch (err: any) {
      console.error("Submission failed", err);
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
        className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
          <h2 className="text-xl font-semibold">
            {isEdit ? "Edit Task" : "Create Task"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-4 space-y-4" id="task-form">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="Title"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">Title is required</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              placeholder="Optional description..."
              rows={4}
              className="w-full resize-y min-h-[100px] p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Course */}
          <div>
            <Controller
              name="course"
              control={control}
              render={({ field }) => (
                <ForeignKeySelect
                  label="Course"
                  value={field.value}
                  onChange={field.onChange}
                  fetchUrl="courses/"
                  placeholder="No course"
                  getLabel={(course) => course.name}
                />
              )}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              {...register("due_date", { required: true })}
              type="date"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.due_date && (
              <p className="text-sm text-red-500 mt-1">Due date is required</p>
            )}
          </div>

          {/* Due Time */}
          <div>
            <label className="block text-sm font-medium mb-1">Due Time</label>
            <input
              {...register("due_time")}
              type="time"
              step="60"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              {...register("priority")}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              {...register("tags")}
              placeholder="Tags (comma separated)"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="text-sm text-red-500 mt-2">{submitError}</div>
          )}
        </form>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="task-form"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
          >
            {isEdit ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
