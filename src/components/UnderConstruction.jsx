import React, { useState } from "react";
import { Card } from "./ui/card";
import AgeVerification from "./AgeVerification";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Make sure this matches your server port

const UnderConstruction = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to subscribe");
      }

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus("error");
      setMessage(
        error.message || "Failed to subscribe. Please try again later.",
      );
    }
  };

  return (
    <>
      <AgeVerification />
      <div className="min-h-screen bg-gradient-to-br from-circus-red via-gray-900 to-circus-blue flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative circus elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-circus-yellow/10 rounded-full blur-3xl animate-spin-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-circus-red/10 rounded-full blur-3xl animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-circus-blue/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
        </div>

        {/* Branding */}
        <div className="fixed top-8 w-full text-center">
          <div className="relative inline-block">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-circus-red/30 via-circus-yellow/30 to-circus-red/30 blur-xl rounded-full"></div>

            {/* Text with combined animations */}
            <h1 className="relative font-walter text-6xl md:text-8xl py-6 animate-float">
              <span className="relative inline-block text-circus-yellow animate-glow [text-shadow:2px_2px_2px_rgba(0,0,0,0.5)]">
                Ry&apos;s Circus
                <span className="text-white"> Merch Shop</span>
              </span>
            </h1>
          </div>
        </div>

        <Card className="max-w-3xl w-full bg-gray-900/70 shadow-2xl backdrop-blur-sm border-2 border-circus-yellow/20 mt-16 relative z-10">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="flex items-center justify-center">
              <div className="relative w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-circus-red via-circus-yellow to-circus-blue rounded-lg blur opacity-25 animate-pulse"></div>
                <img
                  src="/images/product-placeholder.png"
                  alt="Featured Product"
                  className="relative rounded-lg object-cover w-full h-[400px] border border-circus-yellow/20"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/600x400?text=Coming+Soon";
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-5">
              <h1 className="text-4xl font-bold font-walter bg-gradient-to-r from-circus-red via-circus-yellow to-circus-blue text-transparent bg-clip-text leading-tight pb-1">
                Something exciting is on the way...
              </h1>
              <p className="text-xl text-gray-300 font-walter">
                The stream critters are working hard to bring you an exceptional
                shopping experience. Check back soon, because the fun is about to
                begin!
              </p>
              <div className="space-y-3 pt-2">
                <p className="text-sm text-circus-yellow font-walter">
                  Want to be the first to know when we launch?
                </p>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 bg-gray-900/50 border border-circus-yellow/20 rounded-md focus:outline-none focus:ring-2 focus:ring-circus-yellow/50 text-gray-200 placeholder-gray-500 font-walter"
                      required
                      disabled={status === "loading" || status === "success"}
                    />
                    <button
                      type="submit"
                      disabled={status === "loading" || status === "success"}
                      className={`min-w-[120px] px-4 py-2 rounded-md text-white font-medium transition-all font-walter ${
                        status === "loading"
                          ? "bg-gray-700"
                          : status === "success"
                            ? "bg-green-600"
                            : "bg-gradient-to-r from-circus-red via-circus-yellow to-circus-blue hover:opacity-90"
                      }`}
                    >
                      {status === "loading"
                        ? "..."
                        : status === "success"
                          ? "Subscribed!"
                          : "Notify Me"}
                    </button>
                  </div>
                  {message && (
                    <p
                      className={`text-sm font-walter ${
                        status === "error" ? "text-circus-red" : "text-green-400"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default UnderConstruction;
