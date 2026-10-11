import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import ParkingLots from "./pages/ParkingLots";
import Slots from "./pages/Slots";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import Payment from "./pages/Payment";
import MyBookings from "./pages/MyBookings";

import "./App.css";

function Layout({ children }) {
  return (
    <>
      <Navbar />

      <div className="app-content">
        {children}
      </div>

      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/parkinglots"
            element={<ParkingLots />}
          />

          {/* Authenticated user pages */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/userdashboard"
              element={<UserDashboard />}
            />

            <Route
              path="/slots/:lotId"
              element={<Slots />}
            />

            <Route
              path="/booking"
              element={<Booking />}
            />

            <Route
              path="/bookingconfirmation"
              element={<BookingConfirmation />}
            />

            <Route
              path="/payment"
              element={<Payment />}
            />

            <Route
              path="/mybookings"
              element={<MyBookings />}
            />
          </Route>

          {/* Owner pages */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["OWNER"]} />
            }
          >
            <Route
              path="/ownerdashboard"
              element={<OwnerDashboard />}
            />
          </Route>

          {/* Admin pages */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]} />
            }
          >
            <Route
              path="/admindashboard"
              element={<AdminDashboard />}
            />
          </Route>

          {/* Unknown route */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}