import {Type} from "ts-morph";

export function JSONFromPrimitive(type: Type) {
  if(type.isString()) { return 'string'; }
  if(type.isBoolean()) { return 'boolean'; }
  if(type.isNumber()) { return 'number'; }
  if(type.isNull()) { return 'null'; }
  if(type.isUndefined()) { return 'undefined'; }
  if(type.isLiteral()) { return type.getText().replace(/['"]+/g, '') }
}