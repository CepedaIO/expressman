import request = require('supertest');
import express = require('express');
import { expect } from 'chai';
import {inject} from 'tsyringe';
import {Route} from "../decorators";
import {Response} from "express";
import tokens from "../tokens";
import Manifest from "./Manifest";
import {IHTTPResponse, IRouteHandler} from "../types";

describe('publish', function() {
  this.timeout(0);
  let app;

  beforeEach(function() {
    app = express();
  });

  it('should use the result of the handler as the content of the response', async function() {
    @Route('GET', '/return-as-response')
    class CUT {
      handle() {
        return { message:'Victory!' };
      }
    }

    Manifest.generateRoutes(app);
    const result = await request(app).get('/return-as-response');
    expect(result.body.message).to.equal('Victory!');
  });

  it('should use HTTPResponse class for more precise control over response', async function() {
    @Route('GET', '/http-response-response')
    class CUT {
      handle() {
        return {
          statusCode: 400,
          contentType:'text/plain',
          body: 'This is simple text'
        };
      }
    }

    Manifest.generateRoutes(app);
    const result = await request(app).get('/http-response-response');

    expect(result.statusCode).to.equal(400);
    expect(result.type).to.equal('text/plain');
    expect(result.text).to.equal('This is simple text');
  });

  it('should be able to use traditional request object for traditional handling', async function() {
    @Route('GET', '/traditional-response')
    class CUT {
      constructor(
        @inject(tokens.Response) private response:Response
      ) {}

      handle() {
        this.response.status(400).contentType('text/plain').send('This is simple text');
      }
    }

    Manifest.generateRoutes(app);
    const result = await request(app).get('/traditional-response');

    expect(result.statusCode).to.equal(400);
    expect(result.type).to.equal('text/plain');
    expect(result.text).to.equal('This is simple text');
  });

  it('should allow ability to handle error and return a response', async function() {
    @Route('GET', '/traditional-response')
    class CUT implements IRouteHandler {
      constructor(
        @inject(tokens.Response) private response:Response
      ) {}

      handle() {
        throw new Error('Oh no!');
      }

      catch(err: Error): IHTTPResponse<string>{
        return {
          statusCode:500,
          contentType:'text/plain',
          body:'Internal Server Error'
        };
      }
    }

    Manifest.generateRoutes(app);
    const result = await request(app).get('/traditional-response');

    expect(result.statusCode).to.equal(500);
    expect(result.text).to.equal('Internal Server Error');
  });
});
