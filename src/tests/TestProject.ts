import {Project} from "ts-morph";

const project = new Project();

project.addSourceFilesAtPaths([
  'src/tests/DeclarationParser/JSONFromType/*.ts'
]);

export default project;