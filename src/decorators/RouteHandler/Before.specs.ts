/*
import { expect } from "chai";
import {Before} from "./Before";
import RouteMetadata from "../../services/RouteMetadata";
import {Route} from "./Route";

describe('Before', function() {
  it('should define router handlers that a ran before current route', function() {
    class BEFORECUT {
      handle() {

      }
    }
    
    class CUT {
      @Route('GET', '/')
      @Before(BEFORECUT)
      handle() {

      }
    }

    expect(RouteMetadata.before.get(CUT)).to.deep.equal([ BEFORECUT ]);
  });
});
*/