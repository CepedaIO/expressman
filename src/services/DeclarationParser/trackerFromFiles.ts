import {Project} from "ts-morph";
import {Tracker} from "./Tracker";
import {getRouteHandlers} from "./getRouteHandlers";

export function trackerFromFiles(files:string[]): Tracker {
  const project = new Project();

  project.addSourceFilesAtPaths(files);
  const routerHandlers = getRouteHandlers(project);

  const tracker = new Tracker();
  routerHandlers.forEach(routeHandler => tracker.encounteredClass(routeHandler));

  return tracker;
}