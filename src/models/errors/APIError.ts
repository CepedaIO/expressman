import {APIResponse} from "../APIResponse";
import {HandlerError} from "../../types";

export class APIError extends APIResponse<HandlerError> {
  statusCode = 500;
}