import { Request, Response, NextFunction } from "express";

const errors = {
  "unauthorized": 401,
  "conflict": 409,
  "unprocessable": 422,
  "NotFound": 404,
}

export function errorHandler( err, _req: Request, res: Response, _next: NextFunction ) {
  const message = err.message || "Something went wrong";

  const status = errors[err.type] || 500;
  res.status(status).json({ message });
}
