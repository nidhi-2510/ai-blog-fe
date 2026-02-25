import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout/";
import Dashboard from "./pages/admin/Dashboard";
import CalendarView from "./pages/admin/CalendarView";
import ReviewPage from "./pages/admin/ReviewPage";
import HomePage from "./pages/public/HomePage";
import BlogDetail from "./pages/public/BlogDetail";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./utils/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder components
const SettingsPage = () => <div className="p-4">Settings Page</div>;

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes with Role Protection */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["Admin", "Marketing"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route
              path="calendar"
              element={
                <ProtectedRoute roles={["Admin", "Marketing"]}>
                  <CalendarView />
                </ProtectedRoute>
              }
            />

            <Route
              path="reviews"
              element={
                <ProtectedRoute roles={["Admin"]}>
                  <ReviewPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="settings"
              element={
                <ProtectedRoute roles={["Admin"]}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
