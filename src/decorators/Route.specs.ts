import 'mocha';
import 'reflect-metadata';
import { expect } from 'chai';
import {Route} from "./Route";
import {ROUTE_KEY} from "../constants";

describe('Route', function() {
  @Route('GET', '/')
  class Cut {

  }

  it('should define a get route as metadata', function() {
    const result = Reflect.getMetadata(ROUTE_KEY, Cut);
    expect(result).to.deep.equal({
      method: 'GET',
      path: '/'
    });
  });
});