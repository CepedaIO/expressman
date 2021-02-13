import { expect } from 'chai';
import {Route} from "./Route";
import RouteMetadata from "../../services/RouteMetadata";

describe('Route', function() {
  it('should define a get route as metadata', function() {
    class CUT {
      @Route('GET', '/')
      handle() {

      }
    }

    const route = RouteMetadata.getRouteDescriptor(CUT, 'handle');
    expect(route.method).to.equal('get');
    expect(route.path).to.equal('/');
  });
});
