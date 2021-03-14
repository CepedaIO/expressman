import { expect } from "chai";
import {Map} from "./Map";
import InputMetadata from "../../services/metadata/InputMetadata";

interface iTest {
  firstname:string;
  lastname:string;
}

describe('Map', function() {
  it('should record map metadata', function() {
    class MapProperty {
      @Map(['body', 'first-name'])
      firstname: iTest;
    }
    
    expect(InputMetadata.get(MapProperty)!.propertyMap['firstname']!.path).to.deep.equal(['body', 'first-name']);
  });
});
