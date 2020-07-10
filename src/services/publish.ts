import {Application, Request, Response} from "express";
import glob = require("glob");
import Manifest from "./Manifest";
import {trackerFromFiles} from "./DeclarationParser/trackerFromFiles";

interface PublishOptions {
  routeDir:string;
}

export function publish<U>(app:Application, options:PublishOptions) {
  return new Promise((resolve, reject) => {
    glob(`${process.cwd()}/${options.routeDir}/**/*.ts`, (err, files) => {
      if(err) reject(err);
      files.forEach(file => require(file));
      Manifest.generateRoutes(app, options);
      resolve({
        app, files
      });
    });
  });
}
