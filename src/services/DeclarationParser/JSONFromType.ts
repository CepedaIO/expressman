import {Symbol, Type} from "ts-morph";
import {Tracker} from "./Tracker";

function isGeneric(type:Type) {
  return type.isObject() && type.getText().includes('<');
}

export function JSONFromProperties(properties:Symbol[], tracker?:Tracker) {
  return properties.reduce((res, property) => {
    const valueDec = property.getValueDeclaration();
    if(valueDec) {
      const valueType = valueDec.getType();

      if(valueType.isInterface() || isGeneric(valueType)) {
        tracker?.encounteredReference(valueType);

         //When parsing properties we use references in place of schema
        return {
          ...res,
          [property.getName()]: valueType.getText()
        }
      }

      return {
        ...res,
        [property.getName()]: JSONFromType(valueDec.getType())
      };
    }

    if(property.
    return res;
  }, {} as any);
}

export function JSONFromPrimitive(type: Type) {
  if(type.isString()) { return 'string'; }
  if(type.isBoolean()) { return 'boolean'; }
  if(type.isNumber()) { return 'number'; }
  if(type.isNull()) { return 'null'; }
  if(type.isUndefined()) { return 'undefined'; }
  if(type.isLiteral()) { return type.getText().replace(/['"]+/g, '') }
}

export function JSONFromType(type: Type, tracker?:Tracker) {
  if(type.isInterface() || type.isObject()) {
    if(type.isInterface()) {
      tracker?.encounteredReference(type)
    }

    return JSONFromProperties(type.getProperties(), tracker);
  }

  return JSONFromPrimitive(type);
}