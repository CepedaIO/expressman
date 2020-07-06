import { expect } from 'chai';
import {DependencyContainer, inject, injectable} from "tsyringe";
import ContainerMiddleware from "./ContainerMiddleware";
import Context from "../models/Context";
import {Request, Response} from "express";
import {tokens} from "../tokens";

describe('ContainerMiddleware', function() {
  it('should be able to resolve Request/Response objects in service class', function() {
    @injectable()
    class CUT<ContainerT = DependencyContainer> {
      constructor(
        public context:Context<ContainerT>,
        @inject(tokens.Request) public request:Request,
        @inject(tokens.Response) public response:Response
      ) { }
    }

    const req = { request: 'This is an http request!' };
    const resp = { response: 'This is an http response!', locals: {} };


    // @ts-ignore
    ContainerMiddleware<DependencyContainer>()(req, resp, () => {});
    // @ts-ignore
    const child = resp.locals.container;
    const cutInstance = child.resolve<CUT>(CUT);

    expect(cutInstance.context.request).to.equal(req);
    expect(cutInstance.context.response).to.equal(resp);
    expect(cutInstance.context.container).to.equal(child);
    expect(cutInstance.request).to.equal(req);
    expect(cutInstance.response).to.equal(resp);
  });
});