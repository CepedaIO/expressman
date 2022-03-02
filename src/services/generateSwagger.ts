import {generateSwaggerAPI} from "./generateSwaggerAPI";
import YAML from 'yaml';
import {existsSync, readFileSync, writeFileSync} from "fs";
import * as TJS from "typescript-json-schema";
import glob from "glob";

const cache:Map<string, TJS.Program> = new Map();

export interface SwaggerOptions {
  path: string;
  define: {
    title: string;
    description: string;
  };
  outpath?: string;
  exclude?: string;
  recreate?: boolean;
}

export async function programFor(routePattern:string, excludePattern?:string): Promise<TJS.Program> {
  return new Promise(async (resolve, reject) => {
    const pattern = `${process.cwd()}/${routePattern}`;
    let excludedFiles:string[] = [];
    
    if(cache.has(pattern)) {
      resolve(cache.get(pattern)!);
    }
    
    if(excludePattern) {
      excludedFiles = await new Promise((resolve, reject) => {
        glob(excludePattern, (err, files) => {
          if(err) { return reject(err); }
          resolve(files);
        });
      });
    }
    
    glob(pattern, (err, files) => {
      if(err) { return reject(err); }
      const excludedSet = new Set(excludedFiles.values());
      const remaining = files.filter(file => !excludedSet.has(file) && !file.includes('.d.ts'));
      remaining.forEach(file => require(file));
      const program = TJS.getProgramFromFiles(remaining, {
        esModuleInterop: true,
        skipLibCheck: true
      });
      cache.set(pattern, program);
      resolve(program);
    });
  });
}

export async function generateSwagger(pattern:string, options:SwaggerOptions) {
  if(options.outpath && existsSync(options.outpath) && !options.recreate) {
    const yamlStr = readFileSync(options.outpath, 'utf-8');
    const swaggerJSON = YAML.parse(yamlStr);
    return swaggerJSON;
  }
  
  const swaggerAPI = await generateSwaggerAPI();
  const document = {
    openapi: '3.0.0',
    info: {
      title: options.define.title,
      description: options.define.description
    },
    ...swaggerAPI
  };
  
  const yamlStr = YAML.stringify(document);
  
  if(options.outpath) {
    writeFileSync(options.outpath, yamlStr);
  }
  
  return document;
}