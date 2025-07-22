"use client";
import { useForm } from "react-hook-form";
import api from "@/lib/api";


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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      due_date: initialData?.due_date || "",
      priority: initialData?.priority || "medium",
      tags: initialData?.tags?.join(", ") || "",
    },
  });

  const onSubmit = async (data: any) => {
    const payload = {
      title: data.title,
      due_date: data.due_date,
      priority: data.priority,
      tags: data.tags.split(",").map((t: string) => t.trim()),
    };

    try {
      const res = isEdit
        ? await api.put(`tasks/${initialData?.id}/`, payload)
        : await api.post("tasks/", payload);
      onSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-2xl w-full max-w-md shadow-xl transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6">
          {isEdit ? "Edit Task" : "Create Task"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("title", { required: true })}
              placeholder="Title"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">Title is required</p>}
          </div>

          <div>
            <input
              {...register("due_date", { required: true })}
              type="date"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.due_date && <p className="text-sm text-red-500 mt-1">Due date is required</p>}
          </div>

          <select
            {...register("priority")}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            {...register("tags")}
            placeholder="Tags (comma separated)"
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              {isEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
