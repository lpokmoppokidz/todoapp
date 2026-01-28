import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, Code, Smartphone, Palette } from "lucide-react";

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

const FavoritesModal = ({ favorites, isOpen, onClose, onUnsave }) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white rounded-2xl shadow-2xl border-0">
            <div className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Bookmark size={20} className="fill-amber-500 text-amber-500" />
                  Saved Tasks ({favorites.length})
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  <X size={20} />
                </motion.button>
            </div>
              
            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-6 pb-6">
                {favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No saved tasks yet</p>
                    <p className="text-slate-400 text-sm mt-2">
                      Click the bookmark icon on tasks to save them
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {favorites.map((task) => {
                      const CategoryIcon = categoryIcons[task.category] || Code;
                      const categoryColor = categoryColors[task.category] || "text-slate-500";
                      
                      return (
                        <motion.div
                          key={task._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <CategoryIcon size={14} className={categoryColor} />
                                <span className="text-xs font-mono text-slate-500">
                                  {task.code}
                                </span>
                                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                                  {task.category.replace('_', ' ')}
                                </span>
                              </div>
                              <h4 className="font-semibold text-sm text-slate-900 mb-2 leading-relaxed">
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span>Status: {task.status.replace('_', ' ')}</span>
                                <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUnsave(task._id);
                              }}
                              className="flex-shrink-0 ml-2 p-1 rounded hover:bg-amber-50 transition-colors"
                              title="Unsave task"
                            >
                              <Bookmark 
                                size={16} 
                                className="fill-amber-500 text-amber-500" 
                              />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FavoritesModal;
