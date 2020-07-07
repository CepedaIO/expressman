import {MyPayload} from "./MyPayload";
import {MyResult} from "./MyResult";

export class InterfaceDefinition implements IRouteHandler {
  handle(payload:MyPayload): MyResult {
    return { success: true };
  };
}