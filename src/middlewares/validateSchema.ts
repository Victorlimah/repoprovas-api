import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export function validateSchema(schema: Joi.ObjectSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body, { abortEarly: false });
    if (validation.error) 
      return next({ type: "unprocessable", message: validation.error.message });

    next();
  };
}
