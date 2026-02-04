import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { name: "Group A", value: 400, fill: "#0088FE" },
  { name: "Group B", value: 300, fill: "#00C49F" },
  { name: "Group C", value: 300, fill: "#FFBB28" },
  { name: "Group D", value: 200, fill: "#FF8042" },
];

const SalesByRegion = ({ isAnimationActive = true }) => {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          Sales by Region
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Hover over slices to see sales
        </p>
      </div>

      {/* Chart */}
      <div className="h-74">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="70%"
              outerRadius="100%"
              cornerRadius={12}
              paddingAngle={5}
              isAnimationActive={isAnimationActive}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>

            <Tooltip
              formatter={(v) => [`$${v.toLocaleString()}`, "Sales"]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                backdropFilter: "blur(8px)",
                backgroundColor: "rgba(255,255,255,0.85)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Group Display */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {data.map((entry, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: entry.fill }}
            ></div>
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesByRegion;
