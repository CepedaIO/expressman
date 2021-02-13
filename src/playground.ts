import { resolve } from "path";
import * as TJS from "typescript-json-schema";

const program = TJS.getProgramFromFiles([resolve("route.ts")])
const schema = TJS.generateSchema(program, "Test");

console.log(schema);