import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../services/api";
import AddressManager from "./AddressManager";

// Common timezones with standard format
const TIMEZONES = [
  { value: "America/New_York", label: "(UTC-05:00) Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "(UTC-06:00) Central Time (US & Canada)" },
  { value: "America/Denver", label: "(UTC-07:00) Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "(UTC-08:00) Pacific Time (US & Canada)" },
  { value: "America/Anchorage", label: "(UTC-09:00) Alaska" },
  { value: "Pacific/Honolulu", label: "(UTC-10:00) Hawaii" },
  { value: "America/Phoenix", label: "(UTC-07:00) Arizona" },
  { value: "Europe/London", label: "(UTC+00:00) London, Edinburgh" },
  { value: "Europe/Paris", label: "(UTC+01:00) Paris, Berlin, Rome" },
  { value: "Europe/Istanbul", label: "(UTC+03:00) Istanbul, Moscow" },
  { value: "Asia/Dubai", label: "(UTC+04:00) Dubai, Abu Dhabi" },
  { value: "Asia/Singapore", label: "(UTC+08:00) Singapore, Kuala Lumpur" },
  { value: "Asia/Tokyo", label: "(UTC+09:00) Tokyo, Seoul" },
  { value: "Asia/Shanghai", label: "(UTC+08:00) Beijing, Shanghai" },
  { value: "Australia/Sydney", label: "(UTC+10:00) Sydney, Melbourne" },
];

const formatDate = (date) => {
  if (!date) return 'Not provided';
  try {
    const [year, month, day] = date.split('T')[0].split('-');
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'addresses'
  const [selectedTimezone, setSelectedTimezone] = useState(localStorage.getItem("preferredTimezone") || Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem("preferredTimezone", selectedTimezone);
  }, [selectedTimezone]);

  const loadProfile = async () => {
    try {
      const data = await getUserProfile();
      console.log('Loaded profile data:', data);
      
      // Ensure dateOfBirth is in the correct format
      const formattedData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
      };
      
      setProfile(formattedData);
      setEditData(formattedData);
    } catch (err) {
      setError("Failed to load profile");
      console.error("Profile load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to:`, value);
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Create a new Date object from the input value and set it to noon UTC
      // This ensures consistent date handling across timezones
      const dateOfBirth = editData.dateOfBirth ? new Date(editData.dateOfBirth + 'T12:00:00Z') : null;
      
      const dataToUpdate = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        phoneNumber: editData.phoneNumber || "",
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
        timezone: selectedTimezone,
      };
      
      console.log('Full update data:', dataToUpdate);
      const updatedProfile = await updateUserProfile(dataToUpdate);
      console.log('Server response:', updatedProfile);
      
      setProfile(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Failed to update profile");
      console.error("Profile update error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("profile")}
              className={`${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`${
                activeTab === "addresses"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Shipping Addresses
            </button>
          </nav>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Profile Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  Personal details and preferences
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700">
              {isEditing ? (
                <form
                  onSubmit={handleSubmit}
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* First Name */}
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={editData.firstName || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={editData.lastName || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Phone number
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={editData.phoneNumber || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Email - Read Only */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={editData.email || ""}
                          disabled
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label
                          htmlFor="dateOfBirth"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          id="dateOfBirth"
                          value={editData.dateOfBirth ? editData.dateOfBirth.split('T')[0] : ''}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      {/* Preferences Section */}
                      <div className="col-span-2 mt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preferences</h3>
                        <div>
                          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Time Zone
                          </label>
                          <select
                            id="timezone"
                            name="timezone"
                            value={selectedTimezone}
                            onChange={(e) => setSelectedTimezone(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            {TIMEZONES.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          isSaving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      {profile.firstName} {profile.lastName}
                    </dd>
                  </div>
                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      {profile.email}
                    </dd>
                  </div>
                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      {profile.phoneNumber || "Not provided"}
                    </dd>
                  </div>
                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date of birth
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      {formatDate(profile.dateOfBirth)}
                    </dd>
                  </div>
                  <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Time Zone
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                      {TIMEZONES.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone}
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </div>
        )}

        {/* Addresses Tab Content */}
        {activeTab === "addresses" && (
          <AddressManager
            addresses={profile.addresses || []}
            onAddressUpdate={loadProfile}
          />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
