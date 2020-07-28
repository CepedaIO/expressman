import {APIResponse} from "../APIResponse";
import {APIError} from "../../types";

export class UnexpectedError extends APIResponse<APIError> {
  statusCode = 500;
}