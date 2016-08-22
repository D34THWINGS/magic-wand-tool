const yargs = require('yargs');

const { processImage } = require('./src/tool');

const { argv } = yargs
  .alias('v', 'verbose')
  .alias('d', 'depth')
  .alias('o', 'out');

processImage(argv._, {
  outputPath: argv.out,
  colorDepth: argv.depth,
  verbose: argv.verbose,
});

exports.processImage = (path, options = {}) => processImage(path, options);
