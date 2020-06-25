import {Type} from "ts-morph";
import {JSONFromType} from "./JSONFromType";

export class Tracker {
  skipFirstEncounter:boolean = false;
  references:Map<string, { type:Type, json:any }> = new Map();

  encounteredReference(type:Type) {
    if(this.skipFirstEncounter) {
      this.skipFirstEncounter = false;
      return;
    }

    const identifier = type.getText();
    if(this.references.has(identifier)) {
      //Check if they have the same definition;
    } else {
      this.skipFirstEncounter = true;
      this.references.set(identifier, {
        type,
        json: JSONFromType(type, this)
      });
    }
  }
}