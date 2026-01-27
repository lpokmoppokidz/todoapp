import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Column from "./Column.jsx";

// [LEARNING NOTE] Full-Width Fluid Layout
// By removing 'max-w-md' and using 'lg:flex-1' on all column wrappers, 
// we ensure that the columns split the total available width equally.
// This eliminates unused white space on ultra-wide monitors while 
// the 'gap-6' maintains the "space around" feel.

const Board = ({ grouped, isLoading, onDropTask, renderTaskProps }) => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="h-full w-full bg-white lg:bg-slate-50/20 px-0"
  >
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center h-full"
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full mx-auto"
            />
            <p className="text-sm text-slate-500 font-medium tracking-tight">Loading tasks...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          // Ensure we have 'lg:h-full' to prevent vertical overflow of the board itself
          className="h-full w-full flex flex-col overflow-y-auto lg:overflow-y-hidden lg:flex-row lg:p-6 p-4 gap-6 scrollbar-hide lg:scrollbar-default"
        >
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            // Removed 'lg:max-w-md' to allow full expansion
            className="flex-none w-full lg:flex-1 lg:min-h-0 h-auto"
          >
            <Column
              title="To Do"
              color="neutral"
              count={grouped.todo.length}
              tasks={grouped.todo}
              onDropTask={(event) => onDropTask(event, "todo")}
              renderTaskProps={renderTaskProps}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-none w-full lg:flex-1 lg:min-h-0 h-auto"
          >
            <Column
              title="In Progress"
              color="blue"
              count={grouped.in_progress.length}
              tasks={grouped.in_progress}
              onDropTask={(event) => onDropTask(event, "in_progress")}
              renderTaskProps={renderTaskProps}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            // Columns now occupy equal space to fill the entire width
            className="flex-none w-full lg:flex-1 lg:min-h-0 h-auto"
          >
            <Column
              title="Done"
              color="green"
              count={grouped.done.length}
              tasks={grouped.done}
              onDropTask={(event) => onDropTask(event, "done")}
              renderTaskProps={renderTaskProps}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.section>
);

export default Board;
