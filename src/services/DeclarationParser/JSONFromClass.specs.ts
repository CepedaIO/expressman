import project from "../../tests/TestProject";
import {expect} from "chai";
import {JSONFromClass} from "./JSONFromClass";
import {Tracker} from "./Tracker";

describe('JSONFromClass', function() {
  this.timeout(0);

  it('should json a RouterHandler class', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromClass/SimpleClass.ts')!;
    const classDef = sourceFile.getClasses()[0];
    const tracker = new Tracker();

    tracker.encounteredClass(classDef);

    expect(tracker.types.get('MyPayload')!.json).to.deep.equal({
      firstname: 'string'
    });

    expect(tracker.types.get('MyResponse')!.json).to.deep.equal({
      success: 'boolean'
    });

    expect(tracker.classes.get('SimpleClass')!.json).to.deep.equal({
      parameter: { type:'MyPayload' },
      return: { type:'MyResponse' }
    });
  });
});