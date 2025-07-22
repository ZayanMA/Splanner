import { useState } from "react";
import TaskModal from "./TaskModal";

export default function AddNewActionMenuButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [modalType, setModalType] = useState<null | "task" | "project">(null);

  const openModal = (type: "task" | "project") => {
    setModalType(type);
    setShowMenu(false);
  };

  const closeModal = () => setModalType(null);

  // Staggered animation class generator for horizontal animation
  const getButtonClass = (index: number) =>
    `fixed bottom-6 text-white shadow-lg transition-all duration-300
    transform
    ${showMenu ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"}
    delay-${index * 75}`;

  return (
    <div>
      {/* Extra option buttons */}
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

      {/* Main floating button */}
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
          onSuccess={() => closeModal()}
        />
      )}
    </div>
  );
}
