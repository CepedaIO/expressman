import 'reflect-metadata';
import { publish } from 'expressman';
import express = require('express');

const app = express();

publish(app, {
  routeDir:'src/routes'
}).then((result) => {
  app.listen(8080, () => {
    console.log('Expressman\'s example server started');
  });
});
