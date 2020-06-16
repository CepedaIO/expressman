interface Newable<T> {
  new (...args: any[]): T;
}

interface IContainer<ContainerT> {
  bindValue<T>(token:Newable<T> | symbol, value:T);
  resolve<T>(token:Newable<T> | symbol);
}

type IChildContainer<ContainerT> = IContainer<ContainerT>;

interface IParentContainer<ContainerT> extends IContainer<ContainerT> {
  create():IChildContainer<ContainerT>;
}

interface IHTTPResponse<U> {
  statusCode?: number;
  contentType?: string;
  body: U;
}