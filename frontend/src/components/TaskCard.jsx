import React from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Flag, CheckCircle, User, Bookmark, Code, Smartphone, Palette } from "lucide-react";

const categoryIcons = {
  web_development: Code,
  mobile: Smartphone,
  design_figma: Palette
};

const categoryColors = {
  web_development: "text-blue-500",
  mobile: "text-green-500", 
  design_figma: "text-purple-500"
};

const TaskCard = ({
  task,
  isCreator,
  isExpanded,
  isSaved,
  category,
  initials,
  onToggle,
  onAdvance,
  onToggleSave,
  onDragStart
}) => {
  const CategoryIcon = categoryIcons[category] || Code;
  const categoryColor = categoryColors[category] || "text-slate-500";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="cursor-pointer"
    >
    <div className={`p-5 shadow-md hover:shadow-lg transition-all duration-200 border-0 rounded-xl ${
        task.status === "done" 
          ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" 
          : "bg-white hover:bg-slate-50"
      }`}
      onClick={onToggle}
      draggable={isCreator}
      onDragStart={onDragStart}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <CategoryIcon 
            size={18} 
            className={
              task.status === "done" ? "text-slate-400" : categoryColor
            } 
          />
          <span className={`text-sm font-mono font-semibold ${
            task.status === "done" ? "text-slate-400" : "text-slate-600"
          }`}>
            {task.code}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="opacity-60 hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-amber-50"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleSave();
            }}
            title="Save task"
          >
            <Bookmark 
              size={18} 
              className={`${
                task.status === "done" ? "text-slate-400" : "text-slate-600"
              } ${
                isSaved && "fill-amber-500 text-amber-500"
              }`} 
            />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="opacity-60 hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-slate-100"
            type="button"
            title="More options"
          >
            <MoreHorizontal 
              size={18} 
              className={task.status === "done" ? "text-slate-400" : "text-slate-600"}
            />
          </motion.button>
        </div>
      </div>
      
      <h3 className={`font-bold text-base mb-4 leading-relaxed ${
        task.status === "done" 
          ? "text-white line-through" 
          : "text-slate-900"
      }`}>
        {task.title}
      </h3>
      
      <div className="flex justify-between items-center mb-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-2"
        >
          {task.status === "done" ? (
            <CheckCircle 
              size={16} 
              className="text-green-400" 
            />
          ) : (
            <Flag 
              size={16} 
              className={task.status === "todo" ? "text-slate-400" : "text-orange-400"} 
            />
          )}
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            task.status === "done" 
              ? "bg-green-500/20 text-green-400" 
              : task.status === "todo" 
                ? "bg-slate-100 text-slate-600"
                : "bg-orange-100 text-orange-600"
          }`}>
            {task.status === "done" ? "Completed" : task.status === "todo" ? "To Do" : "In Progress"}
          </span>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white flex items-center justify-center text-sm font-semibold text-slate-600"
          title={task.createdBy?.name || "Unassigned"}
        >
          {initials}
        </motion.div>
      </div>
      
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-slate-200 pt-3 mt-3 space-y-3"
        >
          <div>
            <p className={`text-xs mb-1 ${
              task.status === "done" ? "text-slate-400" : "text-slate-500"
            }`}>
              Assigned to
            </p>
            <p className={`text-sm font-medium ${
              task.status === "done" ? "text-slate-200" : "text-slate-700"
            }`}>
              {task.assignees?.length
                ? task.assignees.map((assignee) => assignee.name).join(", ")
                : "Unassigned"}
            </p>
          </div>
          
          {isCreator && task.status !== "done" && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                className={`w-full text-xs font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                  task.status === "done" 
                    ? "bg-slate-700 hover:bg-slate-600 text-white" 
                    : "bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg"
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  onAdvance();
                }}
              >
                {task.status === "todo" ? "Move to In Progress" : "Move to Done"}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  </motion.div>
  );
};

export default TaskCard;
