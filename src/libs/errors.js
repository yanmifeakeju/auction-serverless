import createError, { isHttpError } from 'http-errors';
import { AppError } from './AppError.js';

export const errorHandler = (error) => {
  if (!isHttpError(error)) {
    if (error instanceof AppError) {
      throw new createError.UnprocessableEntity(error.message);
    }
    throw new createError.InternalServerError(error.message);
  }
  throw error;
};

const getInstancePath = (pathString) => {
  let path = '';
  const [, , ...splitPathString] = pathString.split('/');

  for (let i = 0; i < splitPathString.length; i++) {
    path += `.${splitPathString[i]}`;
  }

  return path;
};

export const formatErrorMessage = (error) => {
  switch (error.keyword) {
    case 'required':
      return `Payload missing required property "${error.params.missingProperty}".`;
    case 'format':
      return `"${getInstancePath(error.instancePath)}" is not a valid ${
        error.params.format
      }`;
    case 'minLength':
    case 'maxLength':
    case 'type':
      return `"${getInstancePath(error.instancePath)} ${error.message}`;
    case 'enum':
      return `"${getInstancePath(error.instancePath)}" ${
        error.message
      }: [${error.params.allowedValues.join(', ')}]`;
    case 'additionalProperties':
      return `"${error.params.additionalProperty}" is not allowed.`;
    default:
      break;
  }

  return 'Invalid payload.';
};

export const errorResponseSanitizer = (error) => {
  return {
    statusCode: error.statusCode,
    body: JSON.stringify({
      status: false,
      message: !error.cause
        ? error.message
        : formatErrorMessage(error.cause[0]),
    }),
  };
};
