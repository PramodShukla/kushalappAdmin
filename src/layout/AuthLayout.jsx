import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div
      className="
      min-h-screen
      flex items-center justify-center
      bg-gradient-to-br
      from-slate-50 via-blue-50 to-indigo-50
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
    "
    >
      <Outlet />
    </div>
  );
}
