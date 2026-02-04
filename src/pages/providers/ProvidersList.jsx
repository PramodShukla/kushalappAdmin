import React, { useState, useMemo } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";


const usersData = [
  {
    id: 1,
    name: "Shristi Singh",
    email: "shristi@email.com",
    role: "Admin",
    status: "Active",
    joined: "2025-12-10",
    img: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul@email.com",
    role: "Editor",
    status: "Inactive",
    joined: "2025-11-21",
    img: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@email.com",
    role: "User",
    status: "Active",
    joined: "2025-10-05",
    img: "https://i.pravatar.cc/100?img=3",
  },
];

const statusStyle = (s) =>
  s === "Active"
    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

const Users = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ✅ FILTER LOGIC
  const filteredUsers = useMemo(() => {
    return usersData.filter((u) => {
      const matchName = u.name.toLowerCase().includes(search.toLowerCase());

      const joinedDate = new Date(u.joined);
      const fromOk = fromDate ? joinedDate >= new Date(fromDate) : true;
      const toOk = toDate ? joinedDate <= new Date(toDate) : true;

      return matchName && fromOk && toOk;
    });
  }, [search, fromDate, toDate]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage all registered users
          </p>
        </div>

        <button onClick={() => onPageChange("add-users")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"> <Plus size={16} /> Add User </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
        <div className="grid md:grid-cols-4 gap-4">

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg
                         bg-gray-50 dark:bg-slate-800
                         border border-gray-200 dark:border-slate-700
                         text-gray-800 dark:text-white outline-none"
            />
          </div>
{/* FROM DATE */}
<input
  type="date"
  value={fromDate}
  onChange={(e) => setFromDate(e.target.value)}
  className="
    px-3 py-2 rounded-lg
    bg-gray-50 dark:bg-slate-800
    border border-gray-200 dark:border-slate-700
    text-gray-800 dark:text-white
    dark:[&::-webkit-calendar-picker-indicator]:invert
  "
/>

{/* TO DATE */}
<input
  type="date"
  value={toDate}
  onChange={(e) => setToDate(e.target.value)}
  className="
    px-3 py-2 rounded-lg
    bg-gray-50 dark:bg-slate-800
    border border-gray-200 dark:border-slate-700
    text-gray-800 dark:text-white
    dark:[&::-webkit-calendar-picker-indicator]:invert
  "
/>


          {/* CLEAR */}
          <button
            onClick={() => {
              setSearch("");
              setFromDate("");
              setToDate("");
            }}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white hover:opacity-80"
          >
            Clear Filters
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-100 dark:bg-slate-800">
              <tr className="text-left text-sm">
                <th className="p-4 text-slate-900 dark:text-white">User</th>
                <th className="p-4 text-slate-900 dark:text-white">Role</th>
                <th className="p-4 text-slate-900 dark:text-white">Status</th>
                <th className="p-4 text-slate-900 dark:text-white">Joined</th>
                <th className="p-4 text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-gray-200 dark:border-slate-700
                             hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  {/* USER + IMAGE */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.img}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {u.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-gray-700 dark:text-gray-300">
                    {u.role}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${statusStyle(u.status)}`}>
                      {u.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {u.joined}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-md bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">
                        <Eye size={16} />
                      </button>

                      <button className="p-2 rounded-md bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">
                        <Edit size={16} />
                      </button>

                      <button className="p-2 rounded-md bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800">
                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
