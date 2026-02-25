import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import {
  MdDashboard,
  MdCalendarMonth,
  MdRateReview,
  MdSettings,
  MdLogout,
} from "react-icons/md";

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive("/admin")}`}
          >
            <MdDashboard size={24} />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/calendar"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive("/admin/calendar")}`}
          >
            <MdCalendarMonth size={24} />
            <span>Calendar</span>
          </Link>
          <Link
            to="/admin/reviews"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive("/admin/reviews")}`}
          >
            <MdRateReview size={24} />
            <span>Reviews</span>
          </Link>
          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive("/admin/settings")}`}
          >
            <MdSettings size={24} />
            <span>Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-300 hover:bg-red-600 hover:text-white rounded-md transition-colors"
          >
            <MdLogout size={24} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {location.pathname === "/admin" && "Dashboard Overview"}
            {location.pathname === "/admin/calendar" && "Content Calendar"}
            {location.pathname === "/admin/reviews" && "Content Review"}
            {location.pathname === "/admin/settings" && "Settings"}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">admin@xhire.com</span>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
