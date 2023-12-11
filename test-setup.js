

const { JSDOM } = require('jsdom');

// Set up a fake DOM environment
const dom = new JSDOM('<!doctype html><html><body></body></html>');

global.window = dom.window;
global.document = dom.window.document;
