import bcrypt from "bcrypt";
import crypto from "crypto";
import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/user.js";
import { SessionsCollection } from "../db/models/session.js";

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), //15dk
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30gün
  };
};

// Kayıt
export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, "Email in use");
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await UsersCollection.create({
    ...payload,
    password: hashedPassword,
  });
};

// Giriş
export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) throw createHttpError(401, "Unauthorized");
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) throw createHttpError(401, "Unauthorized");
  await SessionsCollection.deleteOne({ userId: user._id });
  return await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
};

// Refresh
export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) throw createHttpError(401, "Session not found");
  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, "Refresh token expired");
  }
  const newSession = createSession();
  await SessionsCollection.deleteOne({ _id: sessionId });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

// Çıkış
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};
