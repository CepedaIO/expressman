import { expect } from "chai";
import {Map} from "./Map";
import InputMetadata from "../../services/InputMetadata";

interface iTest {
  firstname:string;
  lastname:string;
}

describe('Map', function() {
  it('should record map metadata', function() {
    class CUT {
      @Map(['body', 'first-name'])
      firstname: iTest;
    }
    
    expect(InputMetadata.get(CUT)!.propertyMap['firstname']!.path).to.deep.equal(['body', 'first-name']);
  });

  it('should record map metadata', function() {
    class CUT {
      @Map(['body', 'first-name'])
      firstname: string;
    }
  
    InputMetadata.get(CUT)
    expect(InputMetadata.get(CUT)!.propertyMap['firstname']!.path).to.deep.equal(['body', 'first-name']);
  });
});
