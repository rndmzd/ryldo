const API_BASE_URL = 'http://localhost:5000/api';

let authToken = localStorage.getItem('authToken');

// Helper function to validate image paths/URLs
const isValidImagePath = (path) => {
    if (!path) return false;
    // Allow relative paths starting with /
    if (path.startsWith('/')) return true;
    // Allow absolute URLs
    try {
        new URL(path);
        return true;
    } catch (error) {
        return false;
    }
};

export const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();

    // Set the token
    authToken = data.token;
    localStorage.setItem('authToken', data.token);

    // Get the user profile using the new token
    const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    });

    if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile after registration');
    }

    return profileResponse.json();
};

export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
    }
    const data = await response.json();
    authToken = data.token;
    localStorage.setItem('authToken', data.token);
    return data;
};

export const logout = () => {
    authToken = null;
    localStorage.removeItem('authToken');
};

export const getProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

export const getProductsByCharacter = async (characterId) => {
    const response = await fetch(`${API_BASE_URL}/products/character/${characterId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch products by character');
    }
    return response.json();
};

export const getProductsByCategory = async (category) => {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    if (!response.ok) {
        throw new Error('Failed to fetch products by category');
    }
    return response.json();
};

export const getCharacters = async () => {
    const response = await fetch(`${API_BASE_URL}/characters`);
    if (!response.ok) {
        throw new Error('Failed to fetch characters');
    }
    return response.json();
};

// Admin API functions
export const getAllProducts = async () => {
    if (!authToken) {
        throw new Error('Not authenticated');
    }
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch all products');
    }
    return response.json();
};

export const updateProductVisibility = async (productId, isVisible) => {
    if (!authToken) {
        throw new Error('Not authenticated');
    }
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/visibility`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ isVisible }),
    });
    if (!response.ok) {
        throw new Error('Failed to update product visibility');
    }
    return response.json();
};

export const updateProductImages = async (productId, additionalImages) => {
    if (!authToken) {
        throw new Error('Not authenticated');
    }
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/images`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ additionalImages }),
    });
    if (!response.ok) {
        throw new Error('Failed to update product images');
    }
    return response.json();
};

export const updateProduct = async (productData) => {
    if (!authToken) {
        throw new Error('Not authenticated');
    }

    // Validate image paths
    if (productData.image && !isValidImagePath(productData.image)) {
        throw new Error('Invalid image path format');
    }
    if (productData.additionalImages) {
        for (const path of productData.additionalImages) {
            if (!isValidImagePath(path)) {
                throw new Error('Invalid image path format in additional images');
            }
        }
    }

    const response = await fetch(`${API_BASE_URL}/admin/products/${productData._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: productData.image,
            variants: productData.variants,
            additionalImages: productData.additionalImages,
            character: productData.character,
            category: productData.category,
            inStock: productData.inStock,
            isVisible: productData.isVisible
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update product');
    }

    return response.json();
};

// User Profile Management
export const getUserProfile = async () => {
    if (!authToken) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    return response.json();
};

export const updateUserProfile = async (profileData) => {
    if (!authToken) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(profileData),
    });
    if (!response.ok) {
        throw new Error('Failed to update profile');
    }
    return response.json();
};

// Address Management
export const addAddress = async (addressData) => {
    if (!authToken) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/addresses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(addressData),
    });
    if (!response.ok) {
        throw new Error('Failed to add address');
    }
    return response.json();
};

export const updateAddress = async (addressId, addressData) => {
    if (!authToken) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(addressData),
    });
    if (!response.ok) {
        throw new Error('Failed to update address');
    }
    return response.json();
};

export const deleteAddress = async (addressId) => {
    if (!authToken) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete address');
    }
    return response.json();
};

export const setDefaultAddress = async (addressId) => {
    if (!authToken) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}/default`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to set default address');
    }
    return response.json();
};

// Password Reset
export const requestPasswordReset = async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    if (!response.ok) {
        throw new Error('Failed to request password reset');
    }
    return response.json();
};

export const resetPassword = async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
        throw new Error('Failed to reset password');
    }
    return response.json();
};

// Email Verification
export const verifyEmail = async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
        method: 'GET',
    });
    if (!response.ok) {
        throw new Error('Failed to verify email');
    }
    return response.json();
};

export const resendVerificationEmail = async () => {
    if (!authToken) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to resend verification email');
    }
    return response.json();
}; 