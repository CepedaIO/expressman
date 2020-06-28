import {resolve} from "path";
import {Application} from "express";
import glob from 'glob';
import Manifest from "./Manifest";
import {trackerFromFiles} from "./DeclarationParser/trackerFromFiles";

interface PublishOptions {
  routeDir:string;
}

export function publish<U>(app:Application, options:PublishOptions) {
  Manifest.generateRoutes(app);

  glob(`${options.routeDir}/**/*.ts`, options, (err, _files) => {
    const files = _files.map(file => resolve(file));
    const tracker = trackerFromFiles(files);
    files.forEach(file => require(file));

    debugger;
  });
}