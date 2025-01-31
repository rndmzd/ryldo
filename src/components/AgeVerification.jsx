import React, { useState, useEffect } from "react";

const AgeVerification = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVerified = localStorage.getItem("ageVerified");
    if (!hasVerified) {
      setIsOpen(true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem("ageVerified", "true");
    setIsOpen(false);
    document.body.style.overflow = "unset";
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Age Verification Required
          </h2>
          <div className="space-y-4 mb-8">
            <p className="text-gray-700 text-lg">
              Welcome to our site. You must be 18 years or older to enter.
            </p>
            <p className="text-gray-600">
              By entering this site, you confirm that:
            </p>
            <ul className="text-gray-600 text-left list-disc pl-6 space-y-2">
              <li>You are at least 18 years old</li>
              <li>It is legal to view adult content in your location</li>
              <li>You wish to view adult-oriented content</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleVerify}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              I am 18 or older - Enter Site
            </button>
            <button
              onClick={handleDecline}
              className="w-full bg-gray-100 text-gray-600 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              I am under 18 - Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
