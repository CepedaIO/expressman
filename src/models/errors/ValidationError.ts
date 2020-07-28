import {APIError} from "./APIError";

export class ValidationError extends APIError {
  statusCode = 400;
}