import 'mocha';
import { expect } from 'chai';
import {container, DependencyContainer, inject, injectable} from "tsyringe";
import ContainerMiddleware from "./ContainerMiddleware";
import Context from "../models/Context";
import Container from "../models/Container";
import {Request, Response} from "express";
import tokens from "../tokens";

describe('ContainerMiddleware', function() {
  let child:DependencyContainer;

  const provider = {
    create() {
      child = container.createChildContainer();
      return {
        raw: child,
        bind(token, value) {
          this.raw.register(token, {useValue: value});
        },
        resolve(token) {
          return this.raw.resolve(token);
        }
      };
    }
  };

  it('should be able to resolve Request/Response objects in service class', function() {
    @injectable()
    class Cut<ContainerT = DependencyContainer> {
      constructor(
        public context:Context<ContainerT>,
        public container:Container<ContainerT>,
        @inject(tokens.Request) public request:Request,
        @inject(tokens.Response) public response:Response,
        @inject(tokens.Container) public consumerContainer: ContainerT
      ) { }
    }

    const req = { request: 'This is an http request!' };
    const resp = { response: 'This is an http response!' };

    // @ts-ignore
    ContainerMiddleware<DependencyContainer>(provider)(req, resp, () => {});
    const cutInstance = child.resolve<Cut>(Cut);

    expect(cutInstance.context.request).to.equal(req);
    expect(cutInstance.context.response).to.equal(resp);
    expect(cutInstance.request).to.equal(req);
    expect(cutInstance.response).to.equal(resp);
    expect(cutInstance.consumerContainer).to.equal(child);
  });
});