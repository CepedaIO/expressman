import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {container as parent} from "tsyringe";

export class ChildContainer implements  IChildContainer<DependencyContainer> {
  constructor(
    public child:DependencyContainer
  ) { }

  bindValue(token, value) {
    return this.child.register(token, { useValue:value })
  }

  resolve(token) {
    return this.child.resolve(token);
  }
}

export class ParentContainer implements IParentContainer<DependencyContainer> {
  create() {
    const child = parent.createChildContainer();
    return new ChildContainer(child);
  }


  bindValue(token, value) {
    return parent.register(token, { useValue:value });
  }

  resolve(token) {
    return parent.resolve(token);
  }
}