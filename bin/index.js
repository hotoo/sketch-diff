#!/usr/bin/env node
const chalk = require('chalk');
const differer = require('../src');

if (process.argv.length < 4) {
  console.log(chalk.red('💀 pass 2 Sketch files!'));
  process.exit(0);
}

const [_, __, file1, file2] = process.argv;

console.log(`💎 diffing ${file1} & ${file2}`)
differer(file1,file2).fork(
  console.error,
  console.log
);
