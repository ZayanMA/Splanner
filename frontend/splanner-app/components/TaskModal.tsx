"use client";
import { useForm } from "react-hook-form";
import api from "@/lib/api";

type Task = {
  id?: number;
  title: string;
  due_date: string;
  priority: "low" | "medium" | "high";
  tags: string[];
};

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Task" : "Create Task"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              {...register("title", { required: true })}
              placeholder="Title"
              className="w-full border p-2 rounded"
            />
            {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
          </div>

          <div>
            <input
              {...register("due_date", { required: true })}
              type="date"
              className="w-full border p-2 rounded"
            />
            {errors.due_date && <p className="text-red-500 text-sm">Due date is required</p>}
          </div>

          <select {...register("priority")} className="w-full border p-2 rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            {...register("tags")}
            placeholder="Tags (comma separated)"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {isEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
