import { useState } from "react";
import TaskModal from "./TaskModal";
import { CheckCircle } from "lucide-react";
import { Task } from "@/types/task";

interface Props {
  onTaskCreated: (task: Task) => void;
}

export default function AddNewActionMenuButton({ onTaskCreated }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [modalType, setModalType] = useState<null | "task" | "project">(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const openModal = (type: "task" | "project") => {
    setModalType(type);
    setShowMenu(false);
  };

  const closeModal = () => setModalType(null);

  const handleSuccess = (task: Task) => {
    onTaskCreated(task); // <-- update parent task list
    closeModal();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const getButtonClass = (index: number) =>
    `fixed bottom-6 text-white shadow-lg transition-all duration-300
    transform
    ${showMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"}
    delay-${index * 75}`;

  return (
    <div>
      {/* Floating success animation */}
      {showSuccess && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center animate-fadeInOut">
          <div className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-lg font-semibold transition-all">
            <CheckCircle className="w-6 h-6 text-white" /> Task Created!
          </div>
        </div>
      )}

      {/* Floating buttons */}
      <button
        onClick={() => openModal("task")}
        aria-label="Create new task"
        className={`${getButtonClass(1)} right-[90px] w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700`}
      >
        📝
      </button>
      <button
        onClick={() => openModal("project")}
        aria-label="Create new project"
        className={`${getButtonClass(2)} right-[150px] w-12 h-12 rounded-full bg-green-600 hover:bg-green-700`}
      >
        🗂️
      </button>

      {/* Main FAB */}
      <button
        onClick={() => setShowMenu((prev) => !prev)}
        aria-label="Open action menu"
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg text-3xl flex items-center justify-center transition-transform duration-300 ${
          showMenu ? "rotate-45" : "rotate-0"
        }`}
      >
        +
      </button>

      {/* Modals */}
      {modalType === "task" && (
        <TaskModal
          mode="create"
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
