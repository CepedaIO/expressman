interface MyPayload {
  firstname:string;
}

interface MyResult {
  success:boolean;
}

export class InterfaceDefinition implements IRouteHandler {
  handle(payload:MyPayload): MyResult {
    return { success: true };
  };
}