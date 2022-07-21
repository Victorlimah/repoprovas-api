import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export function validateSchema(schema: Joi.ObjectSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const validation = await schema.validateAsync(req.body, { abortEarly: false });
    if (validation.error) throw { type: "unprocessable", message: validation.error.details };

    next();
  };
}
