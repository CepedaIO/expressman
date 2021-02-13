export function Swagger() {
  return (target:any, key: string, descriptor: PropertyDescriptor) => {
    const test = Reflect.getMetadata("design:paramtypes", target, key);
    console.log(test[0].name);
  }
}
