/**
 * Configuration placeholder (Future Implementation)
 */
export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'future-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
