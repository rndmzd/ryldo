import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../services/api";
import {
  validateAddress,
  formatPostalCode,
  getStatesByCountry,
  getPostalCodeLabel,
  getPostalCodePlaceholder,
  COUNTRIES,
} from "../../utils/addressValidation";
import { cn } from "../../lib/utils";

const AddressManager = ({ addresses, onAddressUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: getStatesByCountry("US")[0]?.code || "",
    zipCode: "",
    country: "United States",
    isDefault: false,
    unit: "",
    additionalInfo: "",
  });

  const resetForm = () => {
    setFormData({
      street: "",
      city: "",
      state: getStatesByCountry("US")[0]?.code || "",
      zipCode: "",
      country: "United States",
      isDefault: false,
      unit: "",
      additionalInfo: "",
    });
    setError(null);
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    // Handle country change
    if (name === "country") {
      const countryCode = COUNTRIES.find((c) => c.name === value)?.code;
      const states = getStatesByCountry(countryCode);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        state: states[0]?.code || "",
        zipCode: "",
      }));
      return;
    }

    // Format postal code as user types
    if (name === "zipCode") {
      const countryCode = COUNTRIES.find(
        (c) => c.name === formData.country,
      )?.code;
      newValue = formatPostalCode(value, countryCode);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    try {
      // Get country code for validation
      const countryCode = COUNTRIES.find(
        (c) => c.name === formData.country,
      )?.code;

      // Validate address
      const validation = await validateAddress(formData, countryCode);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Prepare address data
      const addressData = {
        ...formData,
        street: formData.unit
          ? `${formData.street} ${formData.unit}`
          : formData.street,
      };

      if (editingId) {
        await updateAddress(editingId, addressData);
      } else {
        await addAddress(addressData);
      }
      onAddressUpdate();
      setIsAdding(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
      unit: address.unit,
      additionalInfo: address.additionalInfo,
    });
    setEditingId(address._id);
    setIsAdding(true);
    setValidationErrors({});
  };

  const handleDelete = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(addressId);
        onAddressUpdate();
      } catch (err) {
        setError("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      onAddressUpdate();
    } catch (err) {
      setError("Failed to set default address");
    }
  };

  return (
    <div className="space-y-6">
      {/* Address List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {addresses.map((address) => (
            <li key={address._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {address.street}
                    </h3>
                    {address.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {address.city}, {address.state} {address.zipCode}
                    <br />
                    {address.country}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add/Edit Address Form */}
      <div className="mt-4">
        {!isAdding ? (
          <button
            onClick={() => {
              setIsAdding(true);
              resetForm();
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Address
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Country Selection */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Country
                </label>
                <select
                  name="country"
                  id="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Street Address */}
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  required
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  className={cn(
                    "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                    validationErrors.street
                      ? "border-red-300 dark:border-red-500 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-500"
                      : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                  )}
                />
                {validationErrors.street && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.street}
                  </p>
                )}
              </div>

              {/* Unit/Apartment/Suite */}
              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Unit/Apt (optional)
                </label>
                <input
                  type="text"
                  name="unit"
                  id="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className={cn(
                      "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                      validationErrors.city
                        ? "border-red-300 dark:border-red-500 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-500"
                        : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                    )}
                  />
                  {validationErrors.city && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.city}
                    </p>
                  )}
                </div>

                {/* State/Province/Region */}
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    State/Province
                  </label>
                  <select
                    name="state"
                    id="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {getStatesByCountry(
                      COUNTRIES.find((c) => c.name === formData.country)?.code,
                    ).map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Postal Code */}
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {getPostalCodeLabel(formData.country)}
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder={getPostalCodePlaceholder(formData.country)}
                  className={cn(
                    "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
                    validationErrors.zipCode
                      ? "border-red-300 dark:border-red-500 text-red-900 dark:text-red-100 placeholder-red-300 dark:placeholder-red-500"
                      : "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                  )}
                />
                {validationErrors.zipCode && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {validationErrors.zipCode}
                  </p>
                )}
              </div>

              {/* Additional Delivery Instructions */}
              <div>
                <label
                  htmlFor="additionalInfo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Additional Information (optional)
                </label>
                <textarea
                  name="additionalInfo"
                  id="additionalInfo"
                  rows={3}
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Default Address Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Set as default shipping address
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

AddressManager.propTypes = {
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zipCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      isDefault: PropTypes.bool.isRequired,
      unit: PropTypes.string,
      additionalInfo: PropTypes.string,
    }),
  ).isRequired,
  onAddressUpdate: PropTypes.func.isRequired,
};

export default AddressManager;
