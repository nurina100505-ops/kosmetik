import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "zila_secret_key";

export interface TokenPayload {
  id: number;
  role: string;
}

export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, SECRET) as TokenPayload;
}