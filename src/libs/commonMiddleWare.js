import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import { isHttpError } from 'http-errors';

export default (handler) =>
  middy(handler).use([
    httpJsonBodyParser(),
    httpEventNormalizer(),
    httpErrorHandler(),
    (() => {
      return {
        onError(request) {
          if (
            isHttpError(request.error) &&
            request.error.message !== 'Event object failed validation'
          ) {
            request.response = {
              body: JSON.stringify({
                status: false,
                message: request.error.message,
                ...(request.error.message ===
                  'Event object failed validation' ?? {
                  details: request.error.cause,
                }),
              }),
            };
          }
        },
      };
    })(),
  ]);
