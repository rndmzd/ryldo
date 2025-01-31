import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff, Plus, Edit, X } from "lucide-react";
import { Button } from "./ui/button";
import DOMPurify from "dompurify";
import {
  getAllProducts,
  updateProductVisibility,
  updateProduct,
  login,
  logout,
} from "../services/api";

// Fallback image as a data URL of a simple placeholder
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU3RUIiLz48cGF0aCBkPSJNODAgOTBINzBWMTEwSDgwVjkwWiIgZmlsbD0iIzZCNzI4MCIvPjxwYXRoIGQ9Ik0xMzAgOTBIMTIwVjExMEgxMzBWOTBaIiBmaWxsPSIjNkI3MjgwIi8+PHBhdGggZD0iTTEwMCAxMzBDMTEzLjgwNyAxMzAgMTI1IDExOC44MDcgMTI1IDEwNUMxMjUgOTEuMTkyOSAxMTMuODA3IDgwIDEwMCA4MEM4Ni4xOTI5IDgwIDc1IDkxLjE5MjkgNzUgMTA1Qzc1IDExOC44MDcgODYuMTkyOSAxMzAgMTAwIDEzMFoiIGZpbGw9IiM2QjcyODAiLz48L3N2Zz4=";

const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(PLACEHOLDER_IMAGE);
    }
  };

  return (
    <img src={imgSrc} alt={alt} className={className} onError={handleError} />
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const validateUrl = (path, strict = false) => {
  if (!path) return true;
  if (!strict) {
    // During typing, just check if it starts with / or http:// or https://
    return (
      !path.trim() ||
      path.startsWith("/") ||
      path.startsWith("http://") ||
      path.startsWith("https://")
    );
  }
  // For submission, allow relative paths or valid URLs
  if (path.startsWith("/")) return true;
  try {
    new URL(path);
    return true;
  } catch (error) {
    return false;
  }
};

const ImageManager = ({ product, onUpdate }) => {
  const [images, setImages] = useState(product.additionalImages || []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;

    if (!validateUrl(newImageUrl, true)) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)",
      );
      return;
    }

    const updatedImages = [...images, newImageUrl.trim()];
    setImages(updatedImages);
    setNewImageUrl("");
    setError("");
    onUpdate(updatedImages);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onUpdate(updatedImages);
  };

  const handleUrlChange = (e) => {
    const path = e.target.value;
    setNewImageUrl(DOMPurify.sanitize(path));
    if (path && !validateUrl(path)) {
      setError(
        "Image path must start with / for relative paths, or http:// or https:// for URLs",
      );
    } else {
      setError("");
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-4">Additional Images</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newImageUrl}
              onChange={handleUrlChange}
              placeholder="/images/products/example.jpg"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleAddImage}
              disabled={!!error || !newImageUrl.trim()}
            >
              Add Image
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-sm text-gray-500">
            Enter a relative path (e.g., /images/products/example.jpg) or full
            URL
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-50 rounded-lg overflow-hidden"
            >
              <ImageWithFallback
                src={url}
                alt={`Additional view ${index + 1}`}
                className="w-full h-full object-contain"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ImageManager.propTypes = {
  product: PropTypes.shape({
    additionalImages: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

const VariantManager = ({ product, onUpdate }) => {
  const [variants, setVariants] = useState(product.variants || []);
  const [showAddForm, setShowAddForm] = useState(false);

  const sizes =
    product.category === "Drinkware"
      ? ["Small (8 oz)", "Medium (12 oz)", "Large (16 oz)"]
      : ["XS", "Small", "Medium", "Large", "XL", "2XL", "3XL"];

  const colors = ["Black", "White", "Navy", "Gray"];

  const handleAddVariant = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newVariant = {
      size: formData.get("size"),
      color:
        product.category !== "Drinkware" ? formData.get("color") : undefined,
      price: parseFloat(formData.get("price")),
      inStock: true,
    };
    const updatedVariants = [...variants, newVariant];
    setVariants(updatedVariants);
    onUpdate(updatedVariants);
    setShowAddForm(false);
  };

  const handleUpdateVariant = (index, updates) => {
    const updatedVariants = variants.map((v, i) =>
      i === index ? { ...v, ...updates } : v,
    );
    setVariants(updatedVariants);
    onUpdate(updatedVariants);
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
    onUpdate(updatedVariants);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Variants</h3>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddVariant}
          className="mb-4 p-4 border rounded-lg space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Size</label>
              <select
                name="size"
                className="w-full p-2 border rounded"
                required
              >
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            {product.category !== "Drinkware" && (
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <select
                  name="color"
                  className="w-full p-2 border rounded"
                  required
                >
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                name="price"
                step="0.01"
                defaultValue={product.price}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Variant</Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="flex-1">
              <p className="font-medium">
                {variant.size}
                {variant.color && ` - ${variant.color}`}
              </p>
              <p className="text-sm text-gray-600">
                ${variant.price.toFixed(2)} -{" "}
                {variant.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleUpdateVariant(index, { inStock: !variant.inStock })
                }
              >
                {variant.inStock ? "Mark Out of Stock" : "Mark In Stock"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveVariant(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

VariantManager.propTypes = {
  product: PropTypes.shape({
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.string.isRequired,
        color: PropTypes.string,
        price: PropTypes.number.isRequired,
        inStock: PropTypes.bool.isRequired,
      }),
    ),
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

const ProductEditor = ({ product, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate URL before submission
    if (!validateUrl(editedProduct.image, true)) {
      setError(
        "Please enter a valid image URL (must start with http:// or https://)",
      );
      return;
    }

    try {
      // Ensure we're using the MongoDB _id
      const productToUpdate = {
        ...editedProduct,
        _id: product._id, // Use MongoDB _id
      };
      await onUpdate(productToUpdate);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleImageChange = (e) => {
    const path = e.target.value;
    setEditedProduct({ ...editedProduct, image: path });

    if (path && !validateUrl(path)) {
      setError(
        "Image path must start with / for relative paths, or http:// or https:// for URLs",
      );
    } else {
      setError("");
    }
  };

  return (
    <div className="p-4 border rounded-lg mb-4">
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-xl">{product.name}</h3>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Price:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              ,
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Category:</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {product.category}
              </span>
              ,
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(!isEditing);
              setError("");
              setEditedProduct(product);
              if (!isExpanded) setIsExpanded(true);
            }}
          >
            {isEditing ? (
              <X className="h-4 w-4" />
            ) : (
              <Edit className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
              {error}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editedProduct.name}
                  onChange={(e) =>
                    setEditedProduct({ ...editedProduct, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={editedProduct.description}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Base Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editedProduct.price}
                  onChange={(e) =>
                    setEditedProduct({
                      ...editedProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Main Image Path/URL
                </label>
                <input
                  type="text"
                  value={editedProduct.image}
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded"
                  required
                  placeholder="/images/products/example.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter a relative path (e.g., /images/products/example.jpg) or
                  full URL
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setError("");
                    setEditedProduct(product);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!!error}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <p>{product.description}</p>
            </div>
          )}

          <div className="mt-4 space-y-4">
            <VariantManager
              product={product}
              onUpdate={(variants) => onUpdate({ ...product, variants })}
            />
            <ImageManager
              product={product}
              onUpdate={(images) =>
                onUpdate({ ...product, additionalImages: images })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

ProductEditor.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    inStock: PropTypes.bool.isRequired,
    hasVariants: PropTypes.bool.isRequired,
    variants: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.string.isRequired,
        color: PropTypes.string,
        price: PropTypes.number.isRequired,
        inStock: PropTypes.bool.isRequired,
      }),
    ),
    additionalImages: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

const LoginForm = ({ onLogin }) => {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      await login(username, password);
      onLogin();
    } catch (error) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

const AdminPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn]);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to load products:", error);
    }
  };

  const handleVisibilityToggle = async (product) => {
    try {
      await updateProductVisibility(product._id, !product.isVisible);
      setProducts(
        products.map((p) =>
          p._id === product._id ? { ...p, isVisible: !p.isVisible } : p,
        ),
      );
    } catch (error) {
      console.error("Error updating product visibility:", error);
    }
  };

  const handleProductUpdate = async (product) => {
    try {
      const updatedProduct = await updateProduct(product);
      setProducts(
        products.map((p) => (p._id === product._id ? updatedProduct : p)),
      );
    } catch (error) {
      console.error("Error updating product:", error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>

        <div className="space-y-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow">
              <div className="p-4 flex justify-between items-center border-b">
                <Button
                  variant="ghost"
                  onClick={() => handleVisibilityToggle(product)}
                >
                  {product.isVisible ? (
                    <Eye className="h-4 w-4 mr-2" />
                  ) : (
                    <EyeOff className="h-4 w-4 mr-2" />
                  )}
                  {product.isVisible ? "Visible" : "Hidden"}
                </Button>
              </div>
              <ProductEditor product={product} onUpdate={handleProductUpdate} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
