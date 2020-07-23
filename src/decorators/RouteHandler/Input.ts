import {Newable, RouteHandlerConstructor} from "../../types";
import Manifest from "../../services/Manifest";

export function Input(newable:Newable<any>) {
  return (target:RouteHandlerConstructor) => {
    Manifest.recordInput(target, newable);
  }
}
