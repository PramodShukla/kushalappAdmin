import React from "react";

const ActionButton = ({ onClick, icon: Icon, children, className = "", type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default ActionButton;
