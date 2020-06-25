import {ClassDeclaration, Project, Type} from "ts-morph";

export class DeclarationParser {
  project:Project = new Project();

  constructor(
    public paths:string[]
  ) {
    this.project.addSourceFilesAtPaths(paths);
  }

  typeToJSON(type:Type) {

  }

  getRouteHandlers(): ClassDeclaration[] {
    return this.project.getSourceFiles().reduce((res, sourceFile) => {
      const iRouteHandlers = sourceFile.getClasses().filter(classDef => {
        return classDef.getImplements().find((implementationDef) => {
          return implementationDef.getText() === 'IRouteHandler';
        });
      });

      return res.concat(iRouteHandlers);
    }, [] as ClassDeclaration[]);
  }
  generateJSON() {
    this.getRouteHandlers().forEach(routeHandler => {
      routeHandler.getMethods().forEach(methodDef => {
        methodDef.getParameters().forEach(parameterDef => {
          const parameterType = parameterDef.getType();
        });
      });
    });
  }
}