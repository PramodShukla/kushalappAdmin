import { Routes, Route } from "react-router-dom";

import AuthLayout from "./layout/AuthLayout";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./layout/ProtectedRoute";

import Login from "./pages/auth/login";
import Dashboard from "./components/Dashboard/Dashboard";
import Users from "./pages/Users/Users";
import Categories from "./pages/category/Categories";

export default function App() {
  return (
    <Routes>
      {/* ================= AUTH ROUTES ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* ================= PROTECTED APP ROUTES ================= */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}
