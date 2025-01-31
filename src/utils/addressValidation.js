import tokenManager from "./tokenManager";
import config from "../config/env";
import API_BASE_URL from "../services/api";
// import { validateAddress as validateAddressAPI } from '../services/api';

// Country data
export const COUNTRIES = [{ code: "US", name: "United States" }];

// US States
export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// Canadian Provinces
export const CA_PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

// UK Counties
export const UK_COUNTIES = [
  { code: "BKM", name: "Buckinghamshire" },
  { code: "CAM", name: "Cambridgeshire" },
  { code: "CHS", name: "Cheshire" },
  { code: "DBY", name: "Derbyshire" },
  { code: "DEV", name: "Devon" },
  // Add more UK counties as needed
];

// Australian States
export const AU_STATES = [
  { code: "NSW", name: "New South Wales" },
  { code: "QLD", name: "Queensland" },
  { code: "SA", name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "VIC", name: "Victoria" },
  { code: "WA", name: "Western Australia" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NT", name: "Northern Territory" },
];

// NZ Regions
export const NZ_REGIONS = [
  { code: "AUK", name: "Auckland" },
  { code: "BOP", name: "Bay of Plenty" },
  { code: "CAN", name: "Canterbury" },
  { code: "WGN", name: "Wellington" },
  // Add more NZ regions as needed
];

// Validation functions
export const validateStreetAddress = (street) => {
  // Enhanced street address validation
  // Must contain:
  // - At least one number
  // - Letters
  // - Optional unit/apt/suite numbers
  // - Common street types (St, Ave, Rd, etc.)
  // - Allow special characters for unit numbers (#, -, /, etc.)
  const hasNumber = /\d+/.test(street);
  const hasLetters = /[a-zA-Z]+/.test(street);
  const validFormat = /^[a-zA-Z0-9\s#.,/&'"()-]+$/i.test(street);
  const minLength = street.length >= 5;
  const commonWords =
    /(street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|circle|cir|court|ct|boulevard|blvd|place|pl|square|sq|suite|ste|apartment|apt|unit|#)/i.test(
      street,
    );

  if (!hasNumber)
    return { isValid: false, error: "Address must include a street number" };
  if (!hasLetters)
    return { isValid: false, error: "Address must include street name" };
  if (!validFormat)
    return { isValid: false, error: "Address contains invalid characters" };
  if (!minLength) return { isValid: false, error: "Address is too short" };
  if (!commonWords)
    return {
      isValid: false,
      error: "Address must include a valid street type (St, Ave, Rd, etc.)",
    };

  return { isValid: true };
};

// Fix regex pattern without unnecessary escapes
export const sanitizeAddress = (address) => {
  return address.replace(/[#.,/&'"]/g, "");
};

// Update functions to use the response data
export const validatePostalCode = async (postalCode, country) => {
  try {
    if (!postalCode || !country) {
      console.error('Missing required parameters for postal code validation');
      return false;
    }

    const response = await fetch(
      `${API_BASE_URL}/validate/postal-code/${encodeURIComponent(postalCode)}?country=${encodeURIComponent(country)}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Postal code validation server error:', errorText);
      return false;
    }

    const result = await response.json();
    return result.isValid;
  } catch (error) {
    console.error("Error validating postal code:", error);
    return false;
  }
};

export const validateCity = (city, _countryCode) => {
  // Enhanced city validation with international support
  // Allow letters, spaces, hyphens, apostrophes, and periods
  const cityRegex = /^[a-zA-Z\s\-.']{2,}$/i;
  const isValid = cityRegex.test(city);

  return {
    isValid,
    error: isValid ? null : "Please enter a valid city name",
  };
};

export const formatPostalCode = (postalCode, _countryCode) => {
  // Only handle US ZIP codes
  return postalCode
    .replace(/[^0-9-]/g, "")
    .replace(/^(\d{5})-?(\d{4})?$/, (_, p1, p2) => (p2 ? `${p1}-${p2}` : p1));
};

export const getStatesByCountry = (countryCode) => {
  return countryCode === "US" ? US_STATES : [];
};

export const getPostalCodePlaceholder = (countryCode) => {
  return countryCode === "US" ? "12345 or 12345-6789" : "";
};

// Updated USPS API configuration
const POSTAL_SERVICES = {
  US: {
    endpoint: config.usps.endpoint,
    credentials: {
      clientId: config.usps.consumerKey,
      clientSecret: config.usps.consumerSecret,
      scope: "addresses",
    },
  },
};

// Updated function to verify address with USPS
const verifyUSPSAddress = async (address) => {
  try {
    // Get OAuth token using token manager
    const token = await tokenManager.getToken(
      "USPS",
      POSTAL_SERVICES.US.credentials,
    );

    const params = new URLSearchParams({
      streetAddress: address.street,
      secondaryAddress: address.unit || "",
      city: address.city,
      state: address.state,
      ZIPCode: address.zipCode.split("-")[0],
      ZIPPlus4: address.zipCode.split("-")[1] || "",
    });

    const response = await fetch(
      `${POSTAL_SERVICES.US.endpoint}/address?${params}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    // Handle token expiration
    if (response.status === 401) {
      // Clear the invalid token
      tokenManager.clearToken("USPS", POSTAL_SERVICES.US.credentials.clientId);

      // Retry once with new token
      const newToken = await tokenManager.getToken(
        "USPS",
        POSTAL_SERVICES.US.credentials,
      );
      const retryResponse = await fetch(
        `${POSTAL_SERVICES.US.endpoint}/address?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${newToken}`,
            Accept: "application/json",
          },
        },
      );

      if (!retryResponse.ok) {
        throw new Error("Address verification failed after token refresh");
      }

      return await processUSPSResponse(retryResponse);
    }

    return await processUSPSResponse(response);
  } catch (error) {
    console.error("USPS address verification error:", error);
    throw error;
  }
};

// Helper function to process USPS API response
const processUSPSResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();

    // Handle specific error cases based on API response
    switch (response.status) {
      case 400:
        console.warn("Address validation error:", errorData.error.message);
        return {
          isValid: false,
          errors: {
            general: errorData.error.message,
          },
        };
      case 404:
        console.warn("Address not found:", errorData.error.message);
        return {
          isValid: false,
          errors: {
            general: "Address could not be found or verified",
          },
        };
      case 429:
        console.warn(
          "Rate limit exceeded, retry after:",
          response.headers.get("Retry-After"),
        );
        throw new Error("Rate limit exceeded");
      default:
        throw new Error(
          errorData.error.message || "Address verification failed",
        );
    }
  }

  const data = await response.json();

  // Check for warnings
  if (data.warnings && data.warnings.length > 0) {
    console.warn("Address validation warnings:", data.warnings);
  }

  // Process additional information
  const additionalInfo = data.additionalInfo || {};
  const isDeliverable = additionalInfo.DPVConfirmation === "Y";

  // Return standardized address with validation info
  return {
    isValid: isDeliverable,
    standardizedAddress: {
      street:
        data.address.streetAddressAbbreviation || data.address.streetAddress,
      unit: data.address.secondaryAddress || "",
      city: data.address.cityAbbreviation || data.address.city,
      state: data.address.state,
      zipCode: `${data.address.ZIPCode}${data.address.ZIPPlus4 ? "-" + data.address.ZIPPlus4 : ""}`,
      country: "United States",
    },
    additionalInfo: {
      deliveryPoint: additionalInfo.deliveryPoint,
      carrierRoute: additionalInfo.carrierRoute,
      isBusiness: additionalInfo.business === "Y",
      isVacant: additionalInfo.vacant === "N",
      isCMRA: additionalInfo.DPVCMRA === "Y",
      isCentralDelivery: additionalInfo.centralDeliveryPoint === "Y",
    },
    corrections: data.corrections || [],
    matches: data.matches || [],
  };
};

// Updated verifyAddressWithPostalDB function
export const verifyAddressWithPostalDB = async (address) => {
  try {
    const countryCode = COUNTRIES.find((c) => c.name === address.country)?.code;
    if (!countryCode || countryCode !== "US") {
      console.warn("Only US addresses can be verified");
      return {
        isValid: false,
        errors: { general: "Only US addresses can be verified" },
      };
    }

    return await verifyUSPSAddress(address);
  } catch (error) {
    console.error("Address verification error:", error);
    return {
      isValid: false,
      errors: { general: "Address verification failed" },
    };
  }
};

export const getPostalCodeLabel = (_countryCode) => {
  return "ZIP Code";
};

export const validateAddress = async (address, countryCode) => {
  const errors = {};

  // Basic validation
  if (!address.street) errors.street = "Street address is required";
  if (!address.city) errors.city = "City is required";
  if (!address.state) errors.state = "State is required";
  if (!address.zipCode) errors.zipCode = "ZIP code is required";

  // ZIP code validation
  if (address.zipCode) {
    const isValid = await validatePostalCode(address.zipCode, countryCode);
    if (!isValid) {
      errors.zipCode = "Invalid ZIP code format";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
