import {resolve} from "path";
import tsconfig from "./../tsconfig.json";
import "./src/routes/GETMember"
import * as TJS from "typescript-json-schema";
/*

const file = resolve("example/src/routes/GETMember.ts");
const program = TJS.getProgramFromFiles(
  [ file ],
  {
    ...tsconfig.compilerOptions,
    rootDir: './'
  }
);

const schema = TJS.generateSchema(program, 'GETMembersInput');
*/