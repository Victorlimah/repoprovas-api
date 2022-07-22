import Joi from "joi";

export const testSchema = Joi.object({
  name: Joi.string().required(),
  pdfUrl: Joi.string().uri().required(),
  categoryId: Joi.number().required(),
  teacherDisciplineId: Joi.number().required(),
});
