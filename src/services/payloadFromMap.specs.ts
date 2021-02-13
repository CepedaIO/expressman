/*
import { expect } from "chai";
import {payloadFromMap} from "./payloadFromMap";

describe('payloadFromMap',function() {
  it('should get payload from input map', async function() {
    // @ts-ignore
    const result = await payloadFromMap({
      body: {
        "first-name": "Bob"
      }
    }, {
      firstname: {
        path: 'body.first-name'
      }
    });

    expect(result.payload).to.deep.equal({
      firstname: "Bob"
    });
  });
});
*/