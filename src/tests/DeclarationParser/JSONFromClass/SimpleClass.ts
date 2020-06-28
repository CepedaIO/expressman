interface MyPayload {
  firstname: string;
}

interface MyResponse {
  success: boolean;
}

export class SimpleClass implements IRouteHandler {
  // @ts-ignore
  handle(payload:MyPayload): MyResponse {}
}