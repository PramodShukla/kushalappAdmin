import React from "react";
import RevenueChart from "./RevenueChart";
import SalesByRegion from "./SalesByRegion";

const ChartSection = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <RevenueChart />
      </div>
      <div className="xl:col-span-1">
        <SalesByRegion />
      </div>
    </div>
  );
};

export default ChartSection;
