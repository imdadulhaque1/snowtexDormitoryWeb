import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Decodes a JWT token and checks if it is expired.
 * @param token - The JWT token to check.
 * @returns {boolean} - Returns true if the token is expired, otherwise false.
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode the token (do not verify, just decode)
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || !decoded.exp) {
      console.error("Invalid or malformed token.");
      return true; // Treat as expired if decoding fails
    }

    // Convert token expiration to milliseconds
    const expirationDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();

    console.log(expirationDate <= currentDate);

    return expirationDate <= currentDate; // Check if expired
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Treat as expired in case of errors
  }
};

/**
 * Formats a given date as 'YYYY-MM-DD HH:mm:ss'.
 * @param date - A Date object or an ISO date string.
 * @returns {string} - Returns the formatted date string.
 */
export const formatDate = (date: Date | string): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");
  const hours = String(targetDate.getHours()).padStart(2, "0");
  const minutes = String(targetDate.getMinutes()).padStart(2, "0");
  const seconds = String(targetDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Returns the current date in ISO format.
 * @returns {string} - Current date as ISO string.
 */
export const getCurrentISODate = (): string => {
  return new Date().toISOString();
};
