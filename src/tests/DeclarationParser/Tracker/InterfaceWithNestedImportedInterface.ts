import {ImportedInterface as AliasOfImportedInterface} from "./ImportedInterface";

interface InterfaceWithNestedImportedInterface {
  field1: string;
  imported: AliasOfImportedInterface
}