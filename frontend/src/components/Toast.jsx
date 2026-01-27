import React, { useEffect } from "react";
import { X, UserPlus } from "lucide-react";

/**
 * Toast Component
 * @param {string} message - The message to display
 * @param {function} onClose - Function to call when closing the toast
 * @param {number} duration - Duration in ms before auto-close (default 3000)
 */
const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in-0 duration-300">
      <div className="flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-md text-slate-900 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 ring-1 ring-black/5">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600">
          <UserPlus size={16} />
        </div>
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
