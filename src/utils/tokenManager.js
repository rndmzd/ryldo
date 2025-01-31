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
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${message}`, meta);
  },
};

class TokenManager {
  constructor() {
    this.tokenCache = new Map();
    this.tokenRefreshPromises = new Map();
  }

  async getToken(service, credentials) {
    const cacheKey = `${service}_${credentials.clientId}`;

    try {
      // Check if token exists and is valid
      const cachedToken = this.tokenCache.get(cacheKey);
      if (cachedToken && Date.now() < cachedToken.expiresAt) {
        logger.debug(`Using cached token for ${service}`, {
          service,
          expiresIn: Math.floor((cachedToken.expiresAt - Date.now()) / 1000),
        });
        return cachedToken.token;
      }

      // Check if there's already a refresh in progress
      if (this.tokenRefreshPromises.has(cacheKey)) {
        logger.debug(`Waiting for existing token refresh for ${service}`);
        return await this.tokenRefreshPromises.get(cacheKey);
      }

      // Create new token refresh promise
      const refreshPromise = this._refreshToken(service, credentials);
      this.tokenRefreshPromises.set(cacheKey, refreshPromise);

      try {
        const token = await refreshPromise;
        return token;
      } finally {
        this.tokenRefreshPromises.delete(cacheKey);
      }
    } catch (error) {
      logger.error(`Token acquisition failed for ${service}`, {
        service,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async _refreshToken(service, credentials) {
    const cacheKey = `${service}_${credentials.clientId}`;

    logger.info(`Refreshing token for ${service}`, { service });

    try {
      const startTime = Date.now();
      const response = await fetch("https://apis.usps.com/oauth2/v3/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          scope: credentials.scope,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Token refresh failed: ${error.error_description || error.error || "Unknown error"}`,
        );
      }

      const data = await response.json();

      // Calculate absolute expiry time (with 5-minute buffer)
      const expiresAt = Date.now() + data.expires_in * 1000 - 5 * 60 * 1000;

      // Cache the token
      this.tokenCache.set(cacheKey, {
        token: data.access_token,
        expiresAt,
      });

      logger.info(`Token refreshed successfully for ${service}`, {
        service,
        timeToRefresh: Date.now() - startTime,
        expiresIn: data.expires_in,
      });

      return data.access_token;
    } catch (error) {
      logger.error(`Token refresh failed for ${service}`, {
        service,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  clearToken(service, clientId) {
    const cacheKey = `${service}_${clientId}`;
    this.tokenCache.delete(cacheKey);
    logger.info(`Token cleared for ${service}`, { service });
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

export default tokenManager;
