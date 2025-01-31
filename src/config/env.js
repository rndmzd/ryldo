import dotenv from "dotenv";

// Simple logger for browser environment
const logger = {
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  },
  info: (message, meta = {}) => {
    console.info(`[INFO] ${message}`, meta);
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${message}`, meta);
  },
};

// Load environment variables
dotenv.config();

// Required environment variables
const requiredEnvVars = {
  USPS: ["USPS_CONSUMER_KEY", "USPS_CONSUMER_SECRET"],
};

// Optional environment variables with defaults
const defaultEnvVars = {
  USPS_API_ENDPOINT: "https://apis.usps.com/addresses/v3",
  NODE_ENV: "development",
};

// Validate environment variables
const validateEnv = () => {
  const missingVars = {};

  // Check required variables
  Object.entries(requiredEnvVars).forEach(([service, vars]) => {
    const missing = vars.filter((varName) => !process.env[varName]);
    if (missing.length > 0) {
      missingVars[service] = missing;
    }
  });

  // Log missing variables
  if (Object.keys(missingVars).length > 0) {
    logger.warn("Missing required environment variables:", { missingVars });
  }

  // Set defaults for optional variables
  Object.entries(defaultEnvVars).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
      logger.debug(`Using default value for ${key}:`, { value });
    }
  });

  return Object.keys(missingVars).length === 0;
};

// Configuration object
const config = {
  usps: {
    consumerKey: process.env.USPS_CONSUMER_KEY,
    consumerSecret: process.env.USPS_CONSUMER_SECRET,
    endpoint: process.env.USPS_API_ENDPOINT,
  },
  env: process.env.NODE_ENV,
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};

// Validate environment variables
validateEnv();

export default config;
