import React from "react";
import { Eye, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import ViewAll from "../Buttons/ViewAll";
import { useNavigate } from "react-router-dom";

const data = [
  { id: "#A123", customer: "Shristi Singh", product: "iPhone 15", amount: 1200, status: "Completed", date: "2026-02-03" },
  { id: "#A124", customer: "Rahul Sharma", product: "MacBook Pro", amount: 1500, status: "Pending", date: "2026-02-02" },
  { id: "#A125", customer: "Anjali Gupta", product: "AirPods", amount: 500, status: "Cancelled", date: "2026-02-01" },
];

const topProducts = [
  { name: "iPhone 15", sales: 1200, revenue: 120000, trend: "up", change: "+10%" },
  { name: "MacBook Pro", sales: 1500, revenue: 225000, trend: "down", change: "-5%" },
  { name: "AirPods", sales: 500, revenue: 50000, trend: "up", change: "+15%" },
];

const TableSection = () => {
  const navigate = useNavigate(); // <-- Fix: initialize navigate

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Latest Orders</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Recent orders from customers</p>
          </div>
          <ViewAll onClick={() => navigate("/orders")}>View All</ViewAll>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/50">
                {["Customer", "Product", "Amount", "Status", "Date", "Actions"].map((title) => (
                  <th
                    key={title}
                    className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-400"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                >
                  <td className="p-4 text-slate-800 dark:text-white text-sm">{order.customer}</td>
                  <td className="p-4 text-slate-800 dark:text-white text-sm">{order.product}</td>
                  <td className="p-4 text-slate-800 dark:text-white text-sm">₹{order.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-800 dark:text-white text-sm">{order.date}</td>
                  <td className="p-4 flex items-center space-x-2">
                    <button title="View Order" className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all duration-200">
                      <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button title="Edit Order" className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-all duration-200">
                      <Edit className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </button>
                    <button title="Delete Order" className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 transition-all duration-200">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Top Products</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Best performing products</p>
          </div>
          <ViewAll onClick={() => navigate("/products")}>View All</ViewAll>
        </div>

        <div className="p-6 space-y-4">
          {topProducts.map((product, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors duration-200 border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{product.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sales: {product.sales.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-800 dark:text-white">
                {product.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span>₹{product.revenue?.toLocaleString() || 0} ({product.change})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableSection;
