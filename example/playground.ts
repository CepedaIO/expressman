import {resolve} from "path";
import { Project, StructureKind } from "ts-morph";

const project = new Project();

const sourceFile = project.addSourceFileAtPath('example/types.d.ts');

const classes = sourceFile.getClasses();
classes.forEach(classDefinition => {
  const name = classDefinition.getName();
  const methods = classDefinition.getMethods();

  const implementDefs = classDefinition.getImplements();
  implementDefs.forEach((implementDef) => {
    const name = implementDef.getText();
    const type = implementDef.getType();
    console.log(type.getText());
    debugger;
  });
  console.log(name);

  methods.forEach(method => {
    const name = method.getName();
    console.log(name);
    const returnType = method.getReturnType();
    const symbol = returnType.getSymbol();
    const unionTypes = returnType.getUnionTypes();
    const intersectionTypes = returnType.getIntersectionTypes();

    if(symbol) {
      console.log('Return type is:', symbol.getName());
    }

    if(unionTypes.length) {
      console.log('Return type is union', returnType.getText());
    }

    if(intersectionTypes.length) {
      console.log('Return type is intersection', returnType.getText());
    }
  });
});

/*

const interfaces = sourceFile.getInterfaces();
interfaces.forEach(interfaceDefinition => {
  console.log(interfaceDefinition.getKindName());
  interfaceDefinition.getProperties().forEach(property => {
    const name = property.getName();
    const type = property.getType();
    const symbol = type.getSymbol();
    const typeText = type.getText();
    const isLiteral = type.isLiteral();
    console.log(name, typeText);
  });
});*/