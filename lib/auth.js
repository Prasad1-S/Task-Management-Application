import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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


export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  console.log(token);
  if (!token) return null;

  return verifyToken(token);
}