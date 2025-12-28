import jwt from "jsonwebtoken";
import { getAppMetadata } from "../utils/helpers.js";


const { build } = getAppMetadata();

const JWT_SECRET = build.extraMetadata.env.JWT_SECRET;
const JWT_EXPIRES_IN = build.extraMetadata.env.JWT_EXPIRES_IN;


export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): UserResponseAuth {
  return jwt.verify(token, JWT_SECRET) as UserResponseAuth;
}
