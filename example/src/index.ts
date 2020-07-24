import 'reflect-metadata';
import { publish } from '../../src';
import express = require('express');

const app = express();

publish(app, {
  routeDir:'src/routes'
}).then(() =>
  app.listen(8080, () => console.log('Expressman\'s example server started'))
);
