/**
 * Environment configuration
 * This centralizes all environment variables used in the application
 */

// API configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT ?? '10000', 10);

// Feature flags
export const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
export const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

// Application info
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0';
export const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? 'development';

// Analytics configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';
export const ENABLE_USER_TRACKING = process.env.NEXT_PUBLIC_ENABLE_USER_TRACKING === 'true';
export const ANALYTICS_DOMAIN = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN ?? '';
