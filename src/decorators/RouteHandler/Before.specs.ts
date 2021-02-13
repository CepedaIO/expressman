/*
import { expect } from "chai";
import {Before} from "./Before";
import Manifest from "../../services/RouteMetadata";
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

    expect(Manifest.before.get(CUT)).to.deep.equal([ BEFORECUT ]);
  });
});
*/