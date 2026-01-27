import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "./TaskCard.jsx";
import { Plus } from "lucide-react";

// [LEARNING NOTE] Scroll Containment
// To make columns scroll independently, the Column must be a Flex container itself.
// The header stays fixed at the top, while the list ('flex-1') takes up all remaining space.
// Using 'overflow-y-auto' on the list ensures scrollbars only appear when needed.

const Column = ({ title, color, count, tasks, onDropTask, renderTaskProps }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case "blue": return "bg-blue-500";
      case "green": return "bg-green-500";
      case "orange": return "bg-orange-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col lg:h-full h-auto w-full min-w-0"
    >
      {/* Column Header */}
      <div className="flex justify-between items-center mb-4 shrink-0 px-1">
        <span className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${getColorClasses(color)} shadow-sm`} />
          <span className="text-sm font-bold text-slate-900 tracking-tight">{title}</span>
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[11px] font-bold">
            {count}
          </span>
        </span>
        <button className="p-1 hover:bg-slate-100 rounded-md text-slate-400 transition-colors">
          <Plus size={16} />
        </button>
      </div>
      
      {/* Scrollable Task List */}
      <div
        className="flex-1 flex flex-col gap-3 overflow-y-auto overflow-x-hidden min-h-[150px] p-2 rounded-xl border-2 border-dashed border-slate-100 hover:border-slate-200 transition-colors scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        onDragOver={(event) => {
          event.preventDefault();
          event.currentTarget.classList.add("border-slate-300", "bg-slate-50/50");
        }}
        onDragLeave={(event) => {
          event.currentTarget.classList.remove("border-slate-300", "bg-slate-50/50");
        }}
        onDrop={(event) => {
          event.currentTarget.classList.remove("border-slate-300", "bg-slate-50/50");
          onDropTask(event);
        }}
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
            >
              <TaskCard task={task} {...renderTaskProps(task)} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
               <span className="text-xl">📭</span>
            </div>
            <p className="text-xs font-medium text-slate-400">No tasks here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Column;
