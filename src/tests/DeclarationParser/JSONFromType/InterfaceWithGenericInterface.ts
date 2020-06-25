interface NestedInterface {
  firstname: string;
}

interface InterfaceWithGenericInterface {
  id: number;
  contact: Partial<NestedInterface>
}