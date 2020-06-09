export default class Container<ContainerT> implements IContainer<ContainerT> {
  constructor(container:IContainer<ContainerT>) {
    Object.assign(this, container);
  }

  bind<T>(token:Newable<T> | symbol, value:T) {

  }
}