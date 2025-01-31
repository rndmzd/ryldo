import React from "react";
import PropTypes from "prop-types";
import AgeVerification from "./AgeVerification";

const ProtectedAdultRoute = ({ children }) => {
  const isAgeVerified = localStorage.getItem("ageVerified") === "true";

  if (!isAgeVerified) {
    return (
      <>
        <AgeVerification />
        {children}
      </>
    );
  }

  return children;
};

ProtectedAdultRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedAdultRoute;
