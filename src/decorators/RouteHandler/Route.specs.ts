import { expect } from 'chai';
import {API, Route} from "./Route";
import RouteMetadata from "../../services/metadata/RouteMetadata";

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
  
  it('should collect API metadata', function() {
    @API('/')
    class APIMetadata {
    
    }
    
    const api = RouteMetadata.apis.get(APIMetadata)!;
    expect(api.path).to.equal('/');
    expect(api.filePath).to.include('src/decorators/RouteHandler/Route.specs.ts')
  });
});
