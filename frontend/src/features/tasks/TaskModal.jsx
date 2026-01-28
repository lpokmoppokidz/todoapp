import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Code, Smartphone, Palette } from "lucide-react";

const categories = [
  { value: "web_development", label: "Web Development", icon: Code },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "design_figma", label: "Design Figma", icon: Palette }
];

const TaskModal = ({ users, taskForm, error, onChange, onClose, onSubmit }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-0">
          <div className="flex flex-row items-center justify-between pb-6 pt-6 px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Create New Task
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-100"
            >
              <X size={24} />
            </motion.button>
          </div>
          <div className="space-y-6 px-6 pb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <div className="space-y-2">
                <label className="text-base font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Task Title
                </label>
                <input
                  value={taskForm.title}
                  onChange={(event) => onChange("title", event.target.value)}
                  placeholder="e.g., Design system color palette update"
                  className="w-full px-4 py-3 text-base border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onChange("category", category.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                        taskForm.category === category.value
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-400 bg-white"
                      }`}
                    >
                      <Icon size={16} className={
                        taskForm.category === category.value ? "text-slate-900" : "text-slate-500"
                      } />
                      <span className="text-xs font-medium">{category.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calendar size={16} />
                Deadline
              </label>
              <input
                type="date"
                value={taskForm.deadline}
                onChange={(event) => onChange("deadline", event.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all duration-200"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Users size={16} />
                Assign team members
              </label>
              <select
                multiple
                value={taskForm.assignees}
                onChange={(event) =>
                  onChange(
                    "assignees",
                    Array.from(event.target.selectedOptions).map((option) => option.value)
                  )
                }
                className="w-full min-h-[100px] p-3 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all duration-200"
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id} className="py-2">
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                Hold Ctrl/Cmd to select multiple members
              </p>
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
              >
                {error}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 pt-4"
            >
              <button
                variant="outline"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="flex-1 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] font-medium"
              >
                Create task
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

export default TaskModal;
