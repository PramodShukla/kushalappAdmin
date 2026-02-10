import React, { useState, useEffect, useRef } from "react";
import { Menu, Bell, Settings, Sun, Moon, ChevronDown } from "lucide-react";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";


const Header = ({ onToggle, onMobileMenu }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  /* ---------- APPLY DARK MODE ---------- */
  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ---------- CLICK OUTSIDE CLOSE ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);

      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 md:px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                onMobileMenu && onMobileMenu();
              } else {
                onToggle && onToggle();
              }
            }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5 text-slate-700 dark:text-white" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Welcome back, Admin
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* THEME */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* NOTIFICATIONS */}
          {/* NOTIFICATIONS */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Bell className="w-5 h-5 text-slate-700 dark:text-white" />

              {/* BADGE */}
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                     bg-red-500 text-white text-[10px] font-semibold
                     rounded-full flex items-center justify-center shadow"
              >
                4
              </span>
            </button>

            {notifOpen && (
              <div
                className="absolute right-0 mt-3 w-80
                    bg-white dark:bg-slate-900
                    border border-slate-200 dark:border-slate-700
                    rounded-xl shadow-2xl z-[99999]
                    overflow-hidden"
              >
                {/* HEADER */}
                <div
                  className="flex items-center justify-between px-4 py-3
                      border-b border-slate-200 dark:border-slate-700"
                >
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    Notifications
                  </h3>
                  <button className="text-xs text-blue-600 hover:underline">
                    Mark all read
                  </button>
                </div>

                {/* LIST */}
                <div className="max-h-72 overflow-y-auto">
                  {/* ITEM */}
                  <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      New order received
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Order #1024 • 2 min ago
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="px-4 py-2 text-center border-t border-slate-200 dark:border-slate-700">
                  <button className="text-sm text-blue-600 hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <Settings className="w-5 h-5 text-slate-700 dark:text-white" />
          </button>

          {/* PROFILE */}
          <div ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 border dark:border-slate-700 rounded-lg p-2"
            >
              <img
                src="https://plus.unsplash.com/premium_photo-1670282393309-70fd7f8eb1ef?w=200"
                className="w-8 h-8 rounded-full object-cover"
                alt="profile"
              />
              <ChevronDown
                className={`w-4 h-4 text-slate-700 dark:text-white transition ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="fixed right-6 top-20 w-48 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl shadow-xl p-2 z-[99999]">
                <button className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-800 dark:text-white" onClick={() => navigate("/profile")}>
                  Your Profile
                </button>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
