import {ClassDeclaration, Type} from "ts-morph";
import {JSONFromType} from "./JSONFromType";
import {JSONFromClass} from "./JSONFromClass";

export class Tracker {
  types:Map<string, { definition:Type, json:any }> = new Map();
  classes:Map<string, { definition:ClassDeclaration, json:any}> = new Map();

  resolve:Map<string, string[]> = new Map();

  constructor() { }

  saveUnresolved(path:string, name:string) {
    if(!this.resolve.has(path)) {
      this.resolve.set(path, []);
    }

    const names = this.resolve.get(path)!;
    this.resolve.set(path, names.concat(name));
  }

  encounteredImportedType(type:Type): string {
    const [importSig, name] = type.getText().split('.');

    const match = /import\("(.+)"\)/.exec(importSig);

    if(!match) {
      throw new Error('Unable to extract path from import');
    }

    const path = match[1];
    this.saveUnresolved(path, name);

    return name;
  }
  encounteredType(type:Type) {
    const identifier = type.getText();
    if(!this.types.has(identifier)) {
      this.types.set(identifier, {
        definition: type,
        json: JSONFromType(type, this)
      });
    }
  }

  encounteredClass(classDec:ClassDeclaration) {
    const identifier = classDec.getName() as string;
    if(!this.classes.has(identifier)) {
      this.classes.set(identifier, {
        definition: classDec,
        json: JSONFromClass(classDec, this)
      });
    }
  }
}