import { Routes, Route } from "react-router-dom";

import AuthLayout from "./layout/AuthLayout";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./layout/ProtectedRoute";

import Login from "./pages/auth/login";
import Dashboard from "./components/Dashboard/Dashboard";
import ProfilePage from "./pages/admin/ProfilePage";
import Users from "./pages/users/Users";
import Categories from "./pages/category/Categories";
import AddCategory from "./pages/category/AddCategory";
import EditCategory from "./pages/category/EditCategory";
import CategoryDetail from "./pages/category/CategoryDetails";
import SubCategories from "./pages/subcategory/SubCategories";
import AddSubCategory from "./pages/subcategory/AddSubCategory";
import ProvidersList from "./pages/providers/ProvidersList";
import Offers from "./pages/offers/Offers";
import AddOffers from "./pages/offers/AddOffers";
import Slider from "./pages/slider/Slider";
import AddSlider from "./pages/slider/AddSlider";
import { Toaster } from "react-hot-toast";

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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<Users />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/edit-category/:id" element={<EditCategory />} />
        <Route path="/category-details/:id" element={<CategoryDetail />} />
        <Route path="/sub-categories" element={<SubCategories />} />
        <Route path="/add-subcategory" element={<AddSubCategory />} />
        <Route path="/providers" element={<ProvidersList />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/add-offer" element={<AddOffers />} />
        <Route path="/slider" element={<Slider />} />
        <Route path="/add-slider" element={<AddSlider />} />
      </Route>
    </Routes>
  );
}
