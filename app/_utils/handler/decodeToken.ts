import jwt from "jsonwebtoken";

export const decodeToken = (token: any) => {
  try {
    const decoded = jwt.decode(token);
    return decoded?.userId; // Extract the userId
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
