# Magic Wand Tool

This is a basic tool to convert images to csv values that don't require any process on the [Arduino Magic Wand](https://github.com/D34THWINGS/magic-wand), this is helpful for people running under an Arduino Uno Board which doesn't have enough memory to process images.

## Installation

This project requires node >= 6.x and npm >= 3.x, then you'll have to run this simple command:
```
$ npm install -g magic-wand-tool
```

## CLI

```
Usage: mwt [filepath|glob] {options}

Options:

    -o, --out [PATH]            The output directory to save the transformed images in. If none provided outputs to stdout.
    -d, --depth [8bit|12bit]    The color depth of the outputed file, defaults to 12bit.
    -v, --verbose               Displays additional information about image processing.
    
```

## API

#### `processImage(glob, [options])`

This method takes all the images matching the given glob pattern and process them to be compatible with the magic wand Arduino program.

**Arguments:**

- `glob` *(String)*: A pattern matching string to select the files to input. See more [here](https://github.com/isaacs/node-glob).
- `options` *(Object)*:
    - `ouputPath` *(String)*: The directory where to output the results. If none provided, output will be dumped into `process.stdout`.
    - `colorDepth` *(String)*: The color depth of the output files. Either *8bit* or *12bit*.
    - `verbose` *(Boolean)*: Allows to display more information about image processing.
