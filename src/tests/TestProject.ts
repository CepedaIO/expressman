import {Project} from "ts-morph";

const project = new Project();

project.addSourceFilesAtPaths([
  'src/tests/DeclarationParser/JSONFromType/*.ts',
  'src/tests/DeclarationParser/JSONFromClass/*.ts',
  'src/tests/DeclarationParser/Tracker/*.ts'
]);

export default project;