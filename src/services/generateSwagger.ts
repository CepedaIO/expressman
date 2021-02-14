import {generateSwaggerAPI} from "./generateSwaggerAPI";
import YAML from 'yaml';
import {existsSync, writeFileSync} from "fs";

export interface GenerateSwaggerOptions {
  exclude?: string,
}

export async function generateSwagger(pattern:string, outPath:string, options:GenerateSwaggerOptions = {}) {
  if(existsSync(outPath)) {
    return;
  }
  
  const swaggerAPI = await generateSwaggerAPI(pattern, options);
  const document = {
    openapi: '3.0.0',
    info: {
      title: 'Hard coded title',
      description: 'Test for now'
    },
    ...swaggerAPI
  };
  
  const yamlStr = YAML.stringify(document);
  writeFileSync(outPath, yamlStr);
}

generateSwagger('example/src/routes/**/*.ts', 'swagger.yaml');