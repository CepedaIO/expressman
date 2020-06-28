import {Symbol, Type} from "ts-morph";
import {Tracker} from "./Tracker";
import {JSONFromType} from "./JSONFromType";

function isGeneric(type:Type) {
  return type.isObject() && type.getText().includes('<');
}

function isImported(type: Type) {
  const text = type.getText();
  return text.includes('import(');
}


export function JSONFromProperties(properties:Symbol[], tracker?:Tracker) {
  return properties.reduce((res, property) => {
    const valueDec = property.getValueDeclaration();
    if(valueDec) {
      const type = valueDec.getType();

      if(type.isInterface() || isGeneric(type)) {
        tracker?.encounteredType(type);

        if(isImported(type)) {
          tracker?.encounteredImportedType(type);

          return {
            ...res,
            [property.getName()]: type.getText().split('.')[1]
          };
        }

        //When parsing properties we use references in place of schema
        return {
          ...res,
          [property.getName()]: type.getText()
        }
      }

      return {
        ...res,
        [property.getName()]: JSONFromType(valueDec.getType())
      };
    }

    return res;
  }, {} as any);
}