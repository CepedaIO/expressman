import {APIResponse} from "../APIResponse";
import {APIError} from "../../types";

export class ExpectedError extends APIResponse<APIError> {
  statusCode = 406;
}