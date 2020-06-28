import {ClassDeclaration, Project} from "ts-morph";

export function getRouteHandlers(project:Project): ClassDeclaration[] {
  return project.getSourceFiles().reduce((res, sourceFile) => {
    const iRouteHandlers = sourceFile.getClasses().filter(classDef => !!classDef.getDecorator('Route'));
    return res.concat(iRouteHandlers);
  }, [] as ClassDeclaration[]);
}