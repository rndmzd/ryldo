import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import ProductLanding from "./components/ProductLanding";
import ProductsPage from "./components/ProductsPage";
import AdminPage from "./components/AdminPage";
import AgeVerification from "./components/AgeVerification";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import UserProfile from "./components/user/UserProfile";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import EmailVerification from "./components/auth/EmailVerification";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    console.log('App component mounted');
    const nav = document.getElementById('navigation-bar');
    console.log('Navigation element:', nav);
  }, []);

  console.log('App component rendering');

  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh' }}>
          <Navigation />
          <div style={{ paddingTop: '60px' }}>
            <AgeVerification />
            <Routes>
              <Route 
                path="/" 
                element={<ProductLanding cartItems={cartItems} setCartItems={setCartItems} />} 
              />
              <Route path="/shop" element={<ProductsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<EmailVerification />} />
              <Route path="/verify-email" element={<EmailVerification />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
