#!/usr/bin/env node

'use strict';
const fs = require('fs');
const child_process = require('child_process');
try {
  child_process.execSync('./build.js', {
    stdio: 'inherit'
  });
  console.log();
} catch (error) {
  console.log(error);
  process.exit(0);
}

process.argv.push('./dist/');
require('http-server/bin/http-server');

const last = {};
const options = {
  interval: 2500
};

function rebuild(which, curr) {
  if (!last[which] || last[which].mtime !== curr.mtime) {
    last.which = curr;

    console.log();
    console.log('-'.repeat(80));
    console.log(`\n${ which } changed, rebuilding...`);
    try {
      child_process.execSync('./build.js', {
        stdio: 'inherit'
      });
      console.log();
    } catch (error) {
      console.log(error);
    }
  }
}

fs.watchFile('./index.html', options, (curr, prev) => rebuild('index.html', curr, prev));
fs.watchFile('./build.js', options, (curr, prev) => rebuild('build.js', curr, prev));
