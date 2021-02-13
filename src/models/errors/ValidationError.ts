import {APIError} from "./APIError";
import {HandlerError} from "../../types";

export class ValidationError<IError = HandlerError> extends APIError<IError> {
  statusCode = 400;
}