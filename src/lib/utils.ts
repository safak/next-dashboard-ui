/**
 * Utility functions for the application
 */

/**
 * Gets the correct path for assets considering the basePath in production
 */
export function getImagePath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/next-dashboard-ui' : '';
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
} 