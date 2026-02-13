import React, { useState } from "react";
import { logout } from "../utils/auth";
import { NavLink, useLocation } from "react-router-dom";
import {
  Zap,
  LayoutDashboard,
  Users as UsersIcon,
  ChevronDown,
  ChevronUp,
  ChartBarStacked,
  TicketPercent,
  LogOut,
  Image
} from "lucide-react";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    id: "users",
    icon: UsersIcon,
    label: "Users",
    subMenu: [
      { id: "all-users", label: "All Users", path: "/users" },
      { id: "add-users", label: "Add Users", path: "/add-users" },
    ],
  },
  {
    id: "providers",
    icon: UsersIcon,
    label: "Providers",
    subMenu: [
      { id: "all-providers", label: "All Providers", path: "/providers" },
      { id: "add-provider", label: "Add Provider", path: "/add-provider" },
    ],
  },
  {
    id: "categories",
    icon: ChartBarStacked ,
    label: "Categories",
    subMenu: [
      { id: "all-categories", label: "All Categories", path: "/categories" },
      { id: "add-category", label: "Add Category", path: "/add-category" },
    ],
  },
   {
    id: "sub-categories",
    icon: ChartBarStacked ,
    label: "Sub Categories",
    subMenu: [
      { id: "all-sub-categories", label: "All Sub Categories", path: "/sub-categories" },
      { id: "add-sub-category", label: "Add Sub Category", path: "/add-subcategory" },
    ],
  },
  {
    id: "offers",
    icon: TicketPercent ,
    label: "Offers",
    subMenu: [
      { id: "all-offers", label: "All Offers", path: "/offers" },
      { id: "add-offer", label: "Add Offer", path: "/add-offer" },
    ],
  },
  {
    id: "slider",
    icon: Image ,
    label: "Slider",
    subMenu: [
      { id: "all-slider", label: "All Slider", path: "/slider" },
      { id: "add-slider", label: "Add Slider", path: "/add-slider" },
    ],
  },
  {
    id: "logout",
    icon: LogOut,
    label: "Logout",
    action: "logout",
    subMenu: null,
  },
];

function Sidebar({ collapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  // Initialize expanded items based on current route
  const initialExpanded = new Set();
  menuItems.forEach((item) => {
    if (
      item.subMenu &&
      item.subMenu.some((sub) => location.pathname.startsWith(sub.path))
    ) {
      initialExpanded.add(item.id);
    }
  });

  const [expandedItems, setExpandedItems] = useState(initialExpanded);

  // Toggle submenu
  const toggleExpanded = (id) => {
    const next = new Set();
    if (!expandedItems.has(id)) {
      next.add(id); // Only one submenu open at a time
    }
    setExpandedItems(next);
  };

  // Handle menu click
  const handleMenuClick = (item) => {
    closeMobile();

    if (item.action === "logout") {
      logout();
      return;
    }

    if (item.path) {
      setExpandedItems(new Set());
    } else if (item.subMenu) {
      toggleExpanded(item.id);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:relative z-50 h-full
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          transition-all duration-300 ease-in-out
          bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
          border-r border-slate-200/50 dark:border-slate-700/50
          flex flex-col
        `}
      >
        {/* LOGO */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                  ADMIN
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isOpen = expandedItems.has(item.id);

            // Only used for styling parent button
            const hasActiveChild =
              item.subMenu &&
              item.subMenu.some((sub) =>
                location.pathname.startsWith(sub.path),
              );

            return (
              <div key={item.id}>
                {/* MAIN MENU ITEM */}
                {item.path ? (
                  <NavLink
                    to={item.path}
                    onClick={() => handleMenuClick(item)}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between p-3 rounded-xl transition ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                  </NavLink>
                ) : (
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition
                      text-slate-800 dark:text-white
                      ${hasActiveChild ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && item.subMenu && (
                      isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    )}
                  </button>
                )}

                {/* SUBMENU */}
                {!collapsed && item.subMenu && isOpen && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.subMenu.map((sub) => (
                      <NavLink
                        key={sub.id}
                        to={sub.path}
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          `block p-2 text-sm rounded-lg transition ${
                            isActive
                              ? "bg-blue-100 dark:bg-slate-700 text-blue-700 dark:text-white"
                              : "text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}

export default Sidebar;
