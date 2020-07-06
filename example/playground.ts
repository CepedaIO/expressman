import {resolve} from "path";
import tsconfig from "./../tsconfig.json";

import * as TJS from "typescript-json-schema";

const file = resolve("example/routes/GETMember.ts");
const declaration = resolve("src/types.d.ts");
const decl = resolve("example/types.d.ts");
const program = TJS.getProgramFromFiles(
  [ file, declaration, decl ],
  tsconfig.compilerOptions,
  './example'
);

const schema = TJS.generateSchema(program, 'GETMember');
debugger;