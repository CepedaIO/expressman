import {Application} from "express";
import Manifest from "./Manifest";

export function publish<U>(app:Application) {
  Manifest.generateRoutes(app);
}