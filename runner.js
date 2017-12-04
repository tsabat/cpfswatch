#!/usr/bin/env node

const App = require('./app');
const app = new App();
app.start('.', '/tmp', (err) => {
  if (err) console.log(`Error starting App: ${err}`);
});
