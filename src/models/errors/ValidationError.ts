import {ExpectedError} from "./ExpectedError";

export class ValidationError extends ExpectedError {
  statusCode = 400;
}