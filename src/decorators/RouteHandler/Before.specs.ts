import { expect } from "chai";
import {Before} from "./Before";
import Manifest from "../../services/Manifest";
import {Route} from "./Route";

describe('Before', function() {
  it('should define router handlers that a ran before current route', function() {
    class BEFORECUT {
      handle() {

      }
    }

    @Route('GET', '/')
    @Before(BEFORECUT)
    class CUT {
      handle() {

      }
    }

    expect(Manifest.before.get(CUT)).to.deep.equal([ BEFORECUT ]);
  });
});
