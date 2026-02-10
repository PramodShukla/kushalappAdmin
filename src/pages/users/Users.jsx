import React, { useState, useMemo, useEffect } from "react";
import { Search, Eye, Edit, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../services/userapi";

// ---------------- Status Badge ----------------
const statusStyle = (s) =>
  s === "Active"
    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";

// ---------------- Skeleton Row ----------------
const SkeletonRow = () => (
  <tr>
    {[...Array(8)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse" />
      </td>
    ))}
  </tr>
);

const Users = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ---------------- Fetch Users ----------------
  const fetchUsers = async () => {
    try {
      setLoading(true);                                                                            
      const res = await getUsers();
      console.log("API response:", res); // <-- debug to see structure

      // Adjust this depending on your API response
      const users = res?.data?.data || res?.data || [];
      const formatted = users.map((user) => ({
        id: user._id,
        name: user.name,

        mobile: user.phone || "-",              
        gender: user.gender || "-",             
        city: user.address?.city || user.city || "-",  

        planType: user.isPaid ? "Paid" : "Free", 

        createdAt: user.createdAt,
        avatar: user.avatar
          ? `https://api.kushalapp.com/${user.avatar}`
          : "/images/users/default.png",
      }));

      setData(formatted);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------- Filters ----------------
  const filteredUsers = useMemo(() => {
    return data.filter((u) => {
      const textMatch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase());

      const created = new Date(u.createdAt);
      const fromOk = fromDate ? created >= new Date(fromDate) : true;
      const toOk = toDate ? created <= new Date(toDate) : true;

      return textMatch && fromOk && toOk;
    });
  }, [search, fromDate, toDate, data]);

  return (
    <div className="space-y-6">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Users</h1>
        <button
          onClick={() => navigate("/add-user")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* ---------------- Filter Bar ---------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
            />
          </div>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* ---------------- Table ---------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 text-left text-sm">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Gender</th>
                <th className="p-4">City</th>
                <th className="p-4">Plan Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && [...Array(5)].map((_, i) => <SkeletonRow key={i} />)}

              {!loading &&
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {u.name}
                    </td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.mobile}</td>
                    <td className="p-4">{u.gender}</td>
                    <td className="p-4">{u.city}</td>
                    <td className="p-4">{u.planType}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${statusStyle(
                          u.status
                        )}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3">
                      <Eye
                        size={16}
                        className="cursor-pointer"
                        onClick={() => navigate(`/users/view/${u.id}`)}
                      />
                      <Edit
                        size={16}
                        className="cursor-pointer"
                        onClick={() => navigate(`/users/edit/${u.id}`)}
                      />
                    </td>
                  </tr>
                ))}

              {!loading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
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
