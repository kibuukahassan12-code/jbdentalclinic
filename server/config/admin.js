const isProduction = process.env.NODE_ENV === 'production';

export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || (isProduction ? '' : 'admin@jbdentalclinic.com');
export const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || (isProduction ? '' : '@Admin123#');
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.ADMIN_API_KEY ||
  (isProduction ? '' : 'dev-only-jwt-secret-change-me');
export const JWT_EXPIRY = process.env.JWT_EXPIRY || '8h';

export function validateAdminConfig() {
  if (!JWT_SECRET) {
    throw new Error(
      'Missing JWT secret. Set JWT_SECRET (preferred) or ADMIN_API_KEY before starting the server.'
    );
  }

  if (isProduction && JWT_SECRET.length < 32) {
    throw new Error('JWT secret must be at least 32 characters long in production.');
  }

  if (isProduction && (!ADMIN_EMAIL || !ADMIN_PASSWORD)) {
    throw new Error(
      'Missing admin bootstrap credentials. Set ADMIN_EMAIL and ADMIN_PASSWORD in production.'
    );
  }
}
