import 'reflect-metadata';
import { publish } from '../src';
import express = require('express');
import './routes';

const app = express();

publish(app);

app.listen(8000, () => {
  console.log('Expressions example server started');
});
