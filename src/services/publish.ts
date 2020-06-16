import {Application} from "express";
import Manifest from "./Manifest";

export function publish<U>(app:Application, parent:IParentContainer<U>) {
  Manifest.generateRoutes(app, parent);
}