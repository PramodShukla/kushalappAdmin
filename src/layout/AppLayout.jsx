import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";

export default function AppLayout() {
  const [sideBarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sideBarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sideBarCollapsed={sideBarCollapsed}
          onToggle={() => setSidebarCollapsed(!sideBarCollapsed)}
          onMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet /> {/* renders pages */}
        </main>
      </div>
    </div>
  );
}
