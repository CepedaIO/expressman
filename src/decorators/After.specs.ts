import { expect } from "chai";
import {After} from "./After";
import Manifest from "../services/Manifest";
import {Route} from "./Route";

describe('After', function() {
  it('should define router handlers that a ran after current route', function() {
    class AFTERCUT {
      handle() {

      }
    }

    @Route('GET', '/')
    @After(AFTERCUT)
    class CUT {
      handle() {

      }
    }

    expect(Manifest.after.get(CUT)).to.deep.equal([ AFTERCUT ]);
  });
});