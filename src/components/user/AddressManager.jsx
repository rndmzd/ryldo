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
      const countryCode = COUNTRIES.find((c) => c.name === formData.country)?.code;
      
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
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {addresses.map((address) => (
            <li key={address._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {address.street}
                    </h3>
                    {address.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {address.city}, {address.state} {address.zipCode}
                    <br />
                    {address.country}
                  </p>
                </div>
                <div className="flex space-x-3">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="text-sm text-red-600 hover:text-red-900"
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
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Address
          </button>
        ) : (
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Country Selection */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country
                </label>
                <select
                  name="country"
                  id="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="block text-sm font-medium text-gray-700"
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
                    "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    validationErrors.street
                      ? "border-red-300"
                      : "border-gray-300",
                  )}
                />
                {validationErrors.street && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.street}
                  </p>
                )}
              </div>

              {/* Unit/Apartment/Suite */}
              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apartment, suite, unit, etc. (optional)
                </label>
                <input
                  type="text"
                  name="unit"
                  id="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="Apt 4B, Suite 123, etc."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
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
                      "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                      validationErrors.city
                        ? "border-red-300"
                        : "border-gray-300",
                    )}
                  />
                  {validationErrors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.city}
                    </p>
                  )}
                </div>

                {/* State/Province/Region */}
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {formData.country === "United Kingdom"
                      ? "County"
                      : formData.country === "United States"
                        ? "State"
                        : "Province/Region"}
                  </label>
                  <select
                    name="state"
                    id="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className={cn(
                      "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                      validationErrors.state
                        ? "border-red-300"
                        : "border-gray-300",
                    )}
                  >
                    {getStatesByCountry(
                      COUNTRIES.find((c) => c.name === formData.country)?.code,
                    ).map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.state && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.state}
                    </p>
                  )}
                </div>
              </div>

              {/* Postal Code */}
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  {getPostalCodeLabel(
                    COUNTRIES.find((c) => c.name === formData.country)?.code,
                  )}
                </label>
                <input
                  type="text"
                  name="zipCode"
                  id="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder={getPostalCodePlaceholder(
                    COUNTRIES.find((c) => c.name === formData.country)?.code,
                  )}
                  className={cn(
                    "mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    validationErrors.zipCode
                      ? "border-red-300"
                      : "border-gray-300",
                  )}
                />
                {validationErrors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.zipCode}
                  </p>
                )}
              </div>

              {/* Additional Delivery Instructions */}
              <div>
                <label
                  htmlFor="additionalInfo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delivery Instructions (optional)
                </label>
                <textarea
                  name="additionalInfo"
                  id="additionalInfo"
                  rows="2"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Delivery instructions, gate codes, etc."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isDefault"
                  className="ml-2 block text-sm text-gray-900"
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
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Saving..." : "Save Address"}
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
