import 'reflect-metadata';
import { publish } from '../src';
import express = require('express');

const app = express();

publish(app, {
  routeDir:'example/routes'
});

app.listen(8000, () => {
  console.log('Expressman\'s example server started');
});
