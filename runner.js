#!/usr/bin/env node

var App = require('./app');
var app = new App();
app.start('.', '/tmp');
