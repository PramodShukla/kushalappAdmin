import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)} // go back one step
      className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg
                 bg-gray-100 dark:bg-slate-800
                 hover:bg-gray-200 dark:hover:bg-slate-700
                 text-gray-700 dark:text-white transition"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}

export default BackButton;
