import { expect } from 'chai';
import {Route} from "./Route";
import Manifest from "../../services/RouteMetadata";

describe('Route', function() {
  it('should define a get route as metadata', function() {
    class CUT {
      @Route('GET', '/')
      handle() {

      }
    }

    const entry = Manifest.routes.get(CUT)!;
    
    expect(entry.handle!.method).to.equal('GET');
    expect(entry.handle!.path).to.equal('/');
    expect(entry.handle!.target).to.equal(CUT);
  });
});
