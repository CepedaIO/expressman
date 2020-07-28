import { expect } from "chai";
import {Map} from "./Map";
import Manifest from "../../services/Manifest";

describe('Map', function() {
  it('should record map metadata', function() {
    class CUT {
      @Map(['body', 'first-name'])
      firstname: string;
    }

    expect(Manifest.map.get(CUT)!['firstname'].path).to.deep.equal(['body', 'first-name']);
  });
});
