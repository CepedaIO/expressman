import {DeclarationParser} from "./DeclarationParser";

describe('DeclarationParser', function() {
  this.timeout(0);
  it('should grab classes', function() {
    const parser = new DeclarationParser([
      'src/tests/DeclarationParser/SimpleClass.ts'
    ]);

    const result = parser.generateJSON();
  });
});