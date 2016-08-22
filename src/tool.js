const path = require('path');
const getPixels = require('get-pixels');
const vfs = require('vinyl-fs');
const through = require('through2');
const mime = require('mime');
const File = require('vinyl');

function encodeImage(pixels, colorDepth, pixelCallback) {
  const [nx, ny] = pixels.shape;

  const buffer = new Buffer(nx * ny * 3 / (24 / colorDepth));
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let layer = 0; layer <= 2; layer++) {
        pixelCallback(buffer, pixels.get(i, j, layer), layer);
      }
    }
  }

  return buffer;
}

function encodeTo12bit(pixels) {
  let offset = 0;
  let prev = 0;

  return encodeImage(pixels, 12, (buffer, pixel) => {
    const highOrder = pixel & 0b11110000;
    if (offset % 2 === 0) {
      prev = highOrder >> 4;
    } else {
      prev = highOrder | prev;
      buffer.writeUInt8(prev, (offset - 1) / 2);
    }
    offset++;
  });
}

function encodeTo8bit(pixels) {
  let offset = 0;
  let prev = 0;

  return encodeImage(pixels, 8, (buffer, pixel, layer) => {
    const highOrder = pixel & 0b11100000;
    if (layer === 0) {
      prev = highOrder;
    } else if (layer === 1) {
      prev = (highOrder >> 3) | prev;
    } else {
      prev = (highOrder >> 6) | prev;
      buffer.writeUInt8(prev, (offset - 2) / 3);
    }
    offset++;
  });
}

function transformImage(colorDepth, verbose) {
  return through.obj((file, enc, callback) => {
    getPixels(file.contents, mime.lookup(file.path), (err, pixels) => {
      if (err) {
        return callback(err);
      }

      let buffer;
      switch (colorDepth) {
        case '12bit':
          buffer = encodeTo12bit(pixels);
          break;
        case '8bit':
          buffer = encodeTo8bit(pixels);
          break;
        default:
          throw new Error('Encoding not supported');
      }

      const [nx, ny] = pixels.shape;
      if (verbose) {
        console.log(`Converted colors successfully at: ${colorDepth}`);
        console.log(`- Image size: ${nx}x${ny}`);
        console.log(`- File size: ${buffer.length / 1000}kb`);
      }

      return callback(null, new File({
        path: `${path.basename(file.path).slice(0, -path.extname(file.path).length)}.mwt`,
        contents: buffer,
      }));
    });
  });
}

function dumpStream() {
  return through.obj((vinyl, enc, callback) => callback(null, vinyl.contents))
    .on('data', buffer => process.stdout.write(buffer));
}

exports.processImage = function processImage(glob, { outputPath, colorDepth = '12bit', verbose }) {
  return new Promise((resolve, reject) => {
    const results = [];

    vfs.src(glob)
      .pipe(transformImage(colorDepth, verbose))
      .on('data', (data) => results.push(data))
      .pipe(outputPath ? vfs.dest(outputPath) : dumpStream())
      .on('error', reject)
      .on('end', () => resolve(results));
  });
};
