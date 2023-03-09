import createError, { isHttpError } from 'http-errors';
import { AppError } from './AppError.js';

export const errorHandler = (error) => {
  console.log(error);

  if (!isHttpError(error)) {
    if (error instanceof AppError) {
      throw new createError.UnprocessableEntity(error.message);
    }
    throw new createError.InternalServerError(error.message);
  }
  throw error;
};
