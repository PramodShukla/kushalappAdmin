import React from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "Are you sure?",
  type = "default", // danger | success | default
  icon, // ✅ pass custom icon here
}) => {
  if (!open) return null;

  const styles = {
    danger: {
      btn: "bg-red-600 hover:bg-red-700",
      defaultIcon: <AlertTriangle className="w-10 h-10 text-red-500" />,
      ring: "ring-red-200 dark:ring-red-900",
    },
    success: {
      btn: "bg-green-600 hover:bg-green-700",
      defaultIcon: <CheckCircle2 className="w-10 h-10 text-green-500" />,
      ring: "ring-green-200 dark:ring-green-900",
    },
    default: {
      btn: "bg-blue-600 hover:bg-blue-700",
      defaultIcon: <Info className="w-10 h-10 text-blue-500" />,
      ring: "ring-blue-200 dark:ring-blue-900",
    },
  };

  const ui = styles[type] || styles.default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      <div className={`w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl 
                       ring-1 ${ui.ring} animate-[fadeIn_.2s,scaleIn_.2s]`}>

        <div className="p-6 text-center">

          {/* ICON */}
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-slate-800">
              {icon || ui.defaultIcon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold dark:text-white mb-2">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-200 dark:bg-slate-700 
                         hover:bg-gray-300 dark:hover:bg-slate-600 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow
                          ${ui.btn} transition cursor-pointer`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { transform: scale(.9) }
            to { transform: scale(1) }
          }
        `}
      </style>
    </div>
  );
};

export default ConfirmModal;
