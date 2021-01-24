import { expect } from "chai";
import {Map} from "./Map";
import Manifest from "../../services/Manifest";

interface iTest {
  firstname:string;
  lastname:string;
}

describe.only('Map', function() {
  it.only('should record map metadata', function() {
    class CUT {
      @Map(['body', 'first-name'])
      firstname: iTest;
    }

    expect(Manifest.map.get(CUT)!['firstname'].path).to.deep.equal(['body', 'first-name']);
  });

  it('should record map metadata', function() {
    class CUT {
      @Map(['body', 'first-name'])
      firstname: string;
    }

    expect(Manifest.map.get(CUT)!['firstname'].path).to.deep.equal(['body', 'first-name']);
  });
});
