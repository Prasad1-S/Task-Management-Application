import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

import { cookies } from "next/headers";

export function getUserFromToken() {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  return verifyToken(token);
}