import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navigation from "./components/Navigation.jsx";
import ProductLanding from "./components/ProductLanding.jsx";
import ProductsPage from "./components/ProductsPage.jsx";
import AdminPage from "./components/AdminPage.jsx";
import AgeVerification from "./components/AgeVerification.jsx";
import RegisterForm from "./components/auth/RegisterForm.jsx";
import LoginForm from "./components/auth/LoginForm.jsx";
import UserProfile from "./components/user/UserProfile.jsx";
import ForgotPassword from "./components/auth/ForgotPassword.jsx";
import ResetPassword from "./components/auth/ResetPassword.jsx";
import EmailVerification from "./components/auth/EmailVerification.jsx";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    console.log("App component mounted");
    const nav = document.getElementById("navigation-bar");
    console.log("Navigation element:", nav);
  }, []);

  console.log("App component rendering");

  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh" }}>
          <Navigation />
          <div style={{ paddingTop: "60px" }}>
            <AgeVerification />
            <Routes>
              <Route
                path="/"
                element={
                  <ProductLanding
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                  />
                }
              />
              <Route path="/shop" element={<ProductsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/verify-email/:token"
                element={<EmailVerification />}
              />
              <Route path="/verify-email" element={<EmailVerification />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
