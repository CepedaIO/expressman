import {APIResponse} from "../APIResponse";
import {HandlerError} from "../../types";

export class APIError<IError = HandlerError> extends APIResponse<IError> {
  statusCode = 500;
}