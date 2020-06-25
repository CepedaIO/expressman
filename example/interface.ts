import {IRouteHandler} from "../src/models/IRouteHandler";

interface HandlerResponse {
  firstname: string;
}

interface AlsoHandlerResponse {
  lastname: string;
}

interface Left {
  age: number;
}

interface Right {
  type: string;
}

class Handler implements IRouteHandler<HandlerResponse, any>, Left {
  age = 1;
  handle(req, resp, container): Left & Right {
    return {
      age: 1,
      type: 'something'
    };
  }
}