import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ChartBarStacked, Users } from "lucide-react";

const statCards = [
  {
    title: "Total Category",
    value: "12",
    change: "20.1%",
    trend: "up",
    icon: ChartBarStacked,
    textColor: "text-green-600 dark:text-green-400",
    iconColor: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    progress: 80,
  },
  {
    title: "Total SubCategory",
    value: "2",
    change: "12%",
    trend: "up",
    icon: ChartBarStacked,
    textColor: "text-blue-600 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    progress: 60,
  },
  {
    title: "Total Providers",
    value: "1",
    change: "5.4%",
    trend: "down",
    icon: Users,
    textColor: "text-red-600 dark:text-red-400",
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    progress: 40,
  },
  {
    title: "Total Users",
    value: "573",
    change: "8%",
    trend: "up",
    icon: Users,
    textColor: "text-purple-600 dark:text-purple-400",
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    progress: 70,
  },
];

const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((card, i) => {
        const Icon = card.icon;
        const TrendIcon =
          card.trend === "up" ? ArrowUpRight : ArrowDownRight;

        return (
          <div
            key={i}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6
            border border-slate-200/50 dark:border-slate-700/50
            hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20
            transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {card.title}
                </p>

                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {card.value}
                </h3>

                <div className={`flex items-center space-x-2 mt-2 ${card.textColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{card.change}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    vs last month
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-all duration-300`}
              >
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${card.progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
