import { verifyJwtToken } from "../utils/jwt.js";
import { createError } from "../utils/createError.js";

const getTokenFromRequest = (req) => {
  const headerToken = req.headers.authorization;
  if (headerToken && headerToken.startsWith("Bearer ")) {
    return headerToken.split(" ")[1];
  }

  const cookieHeader = req.headers.cookie || "";
  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("token="));

  if (!cookie) return null;
  return decodeURIComponent(cookie.split("=")[1]);
};

export const verifyToken = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      throw createError("Authentication token required", 401);
    }

    req.user = verifyJwtToken(token);
    next();
  } catch (error) {
    next(createError("Invalid or expired token", 401));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(createError("Authentication token required", 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(createError("Forbidden", 403));
  }

  next();
};
