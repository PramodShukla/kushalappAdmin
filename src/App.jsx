import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* Layouts */
import AuthLayout from "./layout/AuthLayout";
import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./layout/ProtectedRoute";

/* Auth */
import Login from "./pages/auth/login";

/* Dashboard */
import Dashboard from "./components/Dashboard/Dashboard";

/* Admin */
import ProfilePage from "./pages/admin/ProfilePage";

/* Users */
import Users from "./pages/users/Users";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";
import UserDetails from "./pages/users/UserDetails";


/* Category */
import Categories from "./pages/category/Categories";
import AddCategory from "./pages/category/AddCategory";
import EditCategory from "./pages/category/EditCategory";
import CategoryDetail from "./pages/category/CategoryDetails";

/* SubCategory */
import SubCategories from "./pages/subcategory/SubCategories";
import AddSubCategory from "./pages/subcategory/AddSubCategory";
import EditSubCategory from "./pages/subcategory/EditSubCategory";
import SubCategoryDetail from "./pages/subcategory/SubCategoryDetails";

/* Providers */
import ProvidersList from "./pages/provider_data/ProvidersList";
import ProviderDetail from "./pages/provider_data/ProviderDetails";
import EditProvider from "./pages/provider_data/EditProvider";
import AddProvider from "./pages/provider_data/AddProvider";

/* Offers */
import Offers from "./pages/offers/Offers";
import AddOffers from "./pages/offers/AddOffers";
import EditOffers from "./pages/offers/EditOffers";
import OfferDetail from "./pages/offers/OfferDetails";
import OffersData from "./pages/offers/OffersData";
import AddOffersData from "./pages/offers/AddOffersData";
import EditOffersData from "./pages/offers/EditOffersData";

/* Slider */
import Slider from "./pages/slider/Slider";
import AddSlider from "./pages/slider/AddSlider";

/* Subscribers */
import Subscribers from "./pages/subscribers/Subscribers";
import AddSubscribers from "./pages/subscribers/AddSubscribers";
import EditSubscribers from "./pages/subscribers/EditSubscribers";
import SubscribersDetail from "./pages/subscribers/SubscribersDetails";


/* Subscriptions */
import Subscriptions from "./pages/subscriptions/Subscriptions";
import AddSubscriptions from "./pages/subscriptions/AddSubscriptions";
import EditSubscriptions from "./pages/subscriptions/EditSubscriptions";
import SubscriptionsDetail from "./pages/subscriptions/SubscriptionsDetails";


/* Notifications */
import Notifications from "./pages/notifications/Notifications";
import AddNotifications from "./pages/notifications/AddNotifications";
import EditNotifications from "./pages/notifications/EditNotifications";
import NotificationsDetail from "./pages/notifications/NotificationsDetails";

/* Addons */
import Addons from "./pages/addon/Addons";
import AddAddons from "./pages/addon/AddAddons";
import EditAddons from "./pages/addon/EditAddons";
import AddonsDetail from "./pages/addon/AddonsDetails";

export default function App() {
  return (
    <>
      {/* Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        {/* ================= AUTH ROUTES ================= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Users */}
          <Route path="/users" element={<Users />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/user-details/:id" element={<UserDetails />} />

          {/* Categories */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/edit-category/:id" element={<EditCategory />} />
          <Route path="/category-details/:id" element={<CategoryDetail />} />

          {/* SubCategories */}
          <Route path="/sub-categories" element={<SubCategories />} />
          <Route path="/add-subcategory" element={<AddSubCategory />} />
          <Route path="/edit-subcategory/:id" element={<EditSubCategory />} />
          <Route
            path="/subcategory-details/:id"
            element={<SubCategoryDetail />}
          />

          {/* ================= PROVIDERS ================= */}
          <Route path="/providers" element={<ProvidersList />} />
          <Route path="/add-provider" element={<AddProvider />} />
          <Route path="/edit-provider/:id" element={<EditProvider />} />
          <Route
            path="/provider-details/:id"
            element={<ProviderDetail />}
          />

          {/* Offers */}
          <Route path="/offers" element={<Offers />} />
          <Route path="/add-offer" element={<AddOffers />} />
          <Route path="/edit-offer/:id" element={<EditOffers />} />
          <Route path="/offer-details/:id" element={<OfferDetail />} />
          <Route path="/offers-data" element={<OffersData />} />
          <Route path="/add-offers-data" element={<AddOffersData />} />
          <Route path="/edit-offers-data/:id" element={<EditOffersData />} />

          {/* Slider */}
          <Route path="/slider" element={<Slider />} />
          <Route path="/add-slider" element={<AddSlider />} />

          {/* Subscribers */}
          <Route path="/subscribers" element={<Subscribers />} />
          <Route path="/add-subscribers" element={<AddSubscribers />} />
          <Route path="/edit-subscribers/:id" element={<EditSubscribers />} />
          <Route
            path="/subscribers-details/:id"
            element={<SubscribersDetail />}
          />
         
       


        {/* ================= SUBSCRIPTIONS ================= */}
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/add-subscriptions" element={<AddSubscriptions />} />
        <Route path="/edit-subscriptions/:id" element={<EditSubscriptions />} />
        <Route
          path="/subscriptions-details/:id"
          element={<SubscriptionsDetail />}
        />
       


        {/* ================= NOTIFICATIONS ================= */}
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/add-notification" element={<AddNotifications />} />
        <Route path="/edit-notification/:id" element={<EditNotifications />} />
        <Route
          path="/notifications-details/:id"
          element={<NotificationsDetail />}
        />
       


        {/* ================= ADDONS ================= */}
        <Route path="/addons" element={<Addons />} />
        <Route path="/add-addon" element={<AddAddons />} />
        <Route path="/edit-addon/:id" element={<EditAddons />} />
        <Route
          path="/addons-details/:id"
          element={<AddonsDetail />}
        />
        </Route>
      </Routes>



    </>
  );
}
