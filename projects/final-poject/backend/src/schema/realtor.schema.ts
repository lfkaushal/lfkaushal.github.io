import Joi from 'joi';
import { getSignupSchema } from './auth.schema';

export const getRealtorSignupSchema = getSignupSchema.keys({
  photo: Joi.string().required(),
  phone: Joi.string().required(),
  website: Joi.string().uri().required(),
  rating: Joi.number().integer().min(0).max(5).default(0),
});
