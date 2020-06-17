import 'mocha';
import 'reflect-metadata';
import { expect } from 'chai';
import {Route} from "./Route";
import Manifest from "../services/Manifest";

describe('Route', function() {
  @Route('GET', '/')
  class CUT {
    handle() {

    }
  }

  it('should define a get route as metadata', function() {
    const entry = Manifest.entries['GET /'];

    expect(entry.method).to.equal('GET');
    expect(entry.path).to.equal('/');
    expect(entry.target).to.equal(CUT);
  });
});