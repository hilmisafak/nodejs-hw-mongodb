import { isHttpError } from "http-errors";

export const errorHandler = (err, _req, res, _next) => {
  const status = isHttpError(err) ? err.status : 500;
  res.status(status).json({
    status,
    message: "Something went wrong",
    data: err.message,
  });
};
