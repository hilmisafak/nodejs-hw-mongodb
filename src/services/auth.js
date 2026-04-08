import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { UsersCollection } from "../db/models/user.js";
import { SessionsCollection } from "../db/models/session.js";
import { sendEmail } from "../utils/sendEmail.js";

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(30).toString("base64"),
    refreshToken: crypto.randomBytes(30).toString("base64"),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), //15dk
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30gün
  };
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, "User not found!");
  const resetToken = jwt.sign({ sub: user._id, email }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
  const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>To reset your password, click <a href="${resetUrl}">here</a>!</p>`,
  });
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, "Token is expired or invalid.");
  }
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) throw createHttpError(404, "User not found!");
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  await UsersCollection.updateOne({ _id: user._id }, { password: hashedPassword });
  await SessionsCollection.deleteMany({ userId: user._id });
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
