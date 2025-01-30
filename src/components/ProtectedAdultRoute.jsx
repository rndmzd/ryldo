import React from 'react';
import { Navigate } from 'react-router-dom';
import AgeVerification from './AgeVerification';

const ProtectedAdultRoute = ({ children }) => {
    const isAgeVerified = localStorage.getItem('ageVerified') === 'true';

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

export default ProtectedAdultRoute; 