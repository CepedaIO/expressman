import request = require('supertest');
import express = require('express');
import { expect } from 'chai';
import {inject} from 'tsyringe';
import {API, Route} from "../decorators";
import {Response} from "express";
import {tokens} from "../tokens";
import {publish} from "./publish";
import RouteMetadata from "./metadata/RouteMetadata";
import {programFor} from "./generateSwagger";

describe('publish', function() {
  this.timeout(0);

  it('should use the result of the handler as the content of the response', async function() {
    @API('/')
    class ResultAsResponse {
      @Route('GET', '/return-as-response')
      returnAsResponse() {
        return { message:'Victory!' };
      }
    }
  
    const app = express();
    await RouteMetadata.generateRoutes(app, {pattern: "**/*.specs.ts"});
    await RouteMetadata.generateSchemas('**/*.specs.ts');
    const result = await request(app).get('/return-as-response');
    expect(result.body.message).to.equal('Victory!');
  });

  it('should use HTTPResponse class for more precise control over response', async function() {
    @API('/')
    class HTTPResponse {
      constructor(
        @inject(tokens.Response) private response:Response
      ) {}
      
      @Route('GET', '/http-response-response')
      httpResponse() {
        return {
          statusCode: 400,
          contentType:'text/plain',
          body: 'This is simple text'
        };
      }
    }
  
    const app = express();
    await RouteMetadata.generateRoutes(app, {pattern: "**/*.specs.ts"});
    await RouteMetadata.generateSchemas('**/*.specs.ts');
    const result = await request(app).get('/http-response-response');

    expect(result.statusCode).to.equal(400);
    expect(result.type).to.equal('text/plain');
    expect(result.text).to.equal('This is simple text');
  });

  it('should be able to use traditional request object for traditional handling', async function() {
    @API('/')
    class TraditionalResponse {
      constructor(
        @inject(tokens.Response) private response:Response
      ) {}
      
      @Route('GET', '/traditional-response')
      traditionalResponse() {
        this.response.status(400).contentType('text/plain').send('This is simple text');
      }
    }
  
    const app = express();
    await RouteMetadata.generateRoutes(app, {pattern: "**/*.specs.ts"});
    await RouteMetadata.generateSchemas('**/*.specs.ts');
    const result = await request(app).get('/traditional-response');

    expect(result.statusCode).to.equal(400);
    expect(result.type).to.equal('text/plain');
    expect(result.text).to.equal('This is simple text');
  });

  it('should automatically publish unhandled errors as 500', async function() {
    @API('/')
    class UnexpectedError {
      constructor() {}
  
      @Route('GET', '/unexpected-error')
      unexpectedError() {
        throw new Error('Oh no!');
      }
    }
  
    const app = express();
    await RouteMetadata.generateRoutes(app, {pattern: "**/*.specs.ts"});
    await RouteMetadata.generateSchemas('**/*.specs.ts');
    const result = await request(app).get('/unexpected-error');

    expect(result.statusCode).to.equal(500);
    expect(result.text).to.equal('Internal Server Error');
  });
});
