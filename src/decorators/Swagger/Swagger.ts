import SwaggerMetadata from "../../services/metadata/SwaggerMetadata";

export function Swagger() {
  return (target:any, property: string, descriptor: PropertyDescriptor) => {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target, property);
    const returnType = Reflect.getMetadata("design:returntype", target, property);
    
    const input = paramTypes[0] && paramTypes[0].name !== "Object" ? paramTypes[0] : null;
    const output = returnType && returnType.name !== "Object" ? returnType : null;

    SwaggerMetadata.createSwagger(target.constructor, property, input, output);
  }
}
