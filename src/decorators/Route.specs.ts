import { expect } from 'chai';
import {Route} from "./Route";
import Manifest from "../services/Manifest";

describe('Route', function() {
  it('should define a get route as metadata', function() {
    @Route('GET', '/')
    class CUT {
      handle() {

      }
    }

    const entry = Manifest.route.get('GET /')!;

    expect(entry.method).to.equal('GET');
    expect(entry.path).to.equal('/');
    expect(entry.target).to.equal(CUT);
  });
});