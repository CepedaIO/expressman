import { expect } from 'chai';
import gatherSymbols from "./gatherSymbols";

interface arg1 {}
interface arg2 {}
interface return1 {}
interface return2 {}

class TimelineEntriesController {
  async CreateEntry(payload: arg1): Promise<return1> {
    return {};
  }
  
  async GetEntries(payload: arg2): Promise<return2> {
    return {};
  }
}

describe('gatherSymbols', function() {
  it('should index method names and return types', function() {
    const result = gatherSymbols('src/utils/gatherSymbols.specs.ts');
    expect(result.methods.get('CreateEntry')!.arg).to.equal('arg1');
    expect(result.methods.get('CreateEntry')!.return).to.equal('return1');
    expect(result.methods.get('GetEntries')!.arg).to.equal('arg2');
    expect(result.methods.get('GetEntries')!.return).to.equal('return2');
  });
});
