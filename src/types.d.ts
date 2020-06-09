interface Newable<T> {
  new (...args: any[]): T;
}

interface IContainer<ContainerT> {
  raw:ContainerT;
  bind<T>(token:Newable<T> | symbol, value:T);
}

interface IContainerProvider<ContainerT> {
  create():IContainer<ContainerT>;
}