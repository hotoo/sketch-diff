const fs = require('fs');
const sketch2json = require('sketch2json');
const Future = require('fluture');
const Immutable = require('immutable-ext');
const diff = require('immutablediff');
const chalk = require('chalk');
const log = console.log;
const readFile = file => Future.node(done => fs.readFile(file, done))

const readToImmutable = path => readFile(path)
.chain(data => Future.fromPromise(() => sketch2json(data), 0))
.map(doc => Immutable.fromJS(doc))

const logDiffs = ([doc1, doc2, diffs]) =>
  diffs.forEach((diff) => {
    let res = [];
    const path = diff.get('path');
    const [_, ...p] = path.split('/');
    if (diff.get('op') === 'add') {
      log(chalk.white(path));
      log(chalk.green(`+ ${JSON.stringify(doc2.getIn(p))}`))
    } else {
      log(chalk.white(path))
      log(chalk.red(`- ${JSON.stringify(doc1.getIn(p))}`))
      log(chalk.green(`+ ${JSON.stringify(doc2.getIn(p))}`))
    }
  })

const main = (file1, file2) => Future.both(
  readToImmutable(file1),
  readToImmutable(file2)
)
.map(([doc1, doc2]) => {
  return [doc1, doc2, diff(doc1, doc2)]
})
.map(logDiffs)

module.exports = main;
