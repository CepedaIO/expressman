import {ClassDeclaration} from "ts-morph";
import {Tracker} from "./Tracker";

export function JSONFromClass(classDec:ClassDeclaration, tracker?:Tracker) {
  const handleMethod = classDec.getMethods().find(method => method.getName() === 'handle');

  if(!handleMethod) {
    throw new Error('No handle method declared');
  }

  const parameter = handleMethod.getParameters()[0];
  if(!parameter) {
    throw new Error('No parameter defined for handle method');
  }

  const parameterType = parameter.getType();
  tracker?.encounteredType(parameterType);
  const parameterTypeName = parameterType.getText();

  const returnType = handleMethod.getReturnType();
  tracker?.encounteredType(returnType);
  const returnTypeName = returnType.getText();

  return {
    parameter: {
      type: parameterTypeName
    },
    return: {
      type: returnTypeName
    }
  }
}