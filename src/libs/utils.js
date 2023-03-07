import createError, { isHttpError } from 'http-errors';

export const errorHandler = (error) => {
  console.log(error);

  if (!isHttpError(error)) throw new createError.InternalServerError(error);
  throw error;
};
