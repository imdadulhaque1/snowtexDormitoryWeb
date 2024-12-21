import jwt from "jsonwebtoken";

export default function protectedRoute(req, res) {
  try {
    const token = req.cookies.token; // Access the cookie
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ message: "Access granted", user: decoded });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
