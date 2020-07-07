import {ClassDeclaration, Type} from "ts-morph";
import {JSONFromProperties} from "./JSONFromProperties";

function definitionFromType(type:Type) {
  if(type.isObject()) {
    return {
      type: 'object',
      definition: JSONFromProperties(type.getProperties())
    };
  }
}


export function definitionFromClass(classDec:ClassDeclaration) {
  const handleMethod = classDec.getMethods().find(method => method.getName() === 'handle')!;
  const parameterType = handleMethod.getParameters()[0]!.getType();
  const returnType = handleMethod.getReturnType();

  return {
    parameter: definitionFromType(parameterType),
    return: definitionFromType(returnType)
  };
}