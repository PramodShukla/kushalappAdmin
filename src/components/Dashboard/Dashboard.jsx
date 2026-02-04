import React from "react";
import StatsGrid from "./StatsGrid";
import ChartSection from "./ChartSection";
import TableSection from "./TableSection";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* stats grid */}
      <StatsGrid />
      {/* CHART SECTION */}
      <ChartSection />

      {/* tablesection */}
      <TableSection />
    </div>
  );
};

export default Dashboard;
