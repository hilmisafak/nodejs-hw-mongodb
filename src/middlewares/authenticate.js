import createHttpError from "http-errors";
import { SessionsCollection } from "../db/models/session.js";
import { UsersCollection } from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) return next(createHttpError(401, "Please provide Authorization header"));

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return next(createHttpError(401, "Auth header should be: Bearer <accessToken>"));
  }
  let token = match[1].trim();
  // Swagger UI already adds "Bearer "; kullanıcı bazen token'a tekrar "Bearer " ekliyor.
  if (/^Bearer\s+/i.test(token)) {
    token = token.replace(/^Bearer\s+/i, "").trim();
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) return next(createHttpError(401, "Session not found"));
  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, "Access token expired"));
  }
  const user = await UsersCollection.findById(session.userId);
  if (!user) return next(createHttpError(401, "User not found"));
  req.user = user;
  next();
};
