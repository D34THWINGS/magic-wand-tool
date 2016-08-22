const { expect } = require('chai');
const path = require('path');

const { processImage } = require('../src/tool');

describe('MagicWandTool', () => {
  context('when encoding to 12bit colors', () => {
    it('should convert 24bit RGB color to first 12bit', () => {
      // Given
      const testFilePath = path.resolve(__dirname, './test.png');

      // When
      const processPromise = processImage(testFilePath, { colorDepth: '12bit' });

      // Then
      return processPromise.then(([result]) => {
        expect(result.contents.readUInt8(0)).to.equal(0b00001111);
        expect(result.contents.readUInt8(1)).to.equal(0b00000000);
      });
    });
  });

  context('when encoding to 8bit colors', () => {
    it('should convert 8bit red color to first 3bits', () => {
      // Given
      const testFilePath = path.resolve(__dirname, './test.png');

      // When
      const processPromise = processImage(testFilePath, { colorDepth: '8bit' });

      // Then
      return processPromise.then(([result]) => {
        expect(result.contents.readUInt8(0)).to.equal(0b11100000);
      });
    });

    it('should convert 8bit green color to second 3bits', () => {
      // Given
      const testFilePath = path.resolve(__dirname, './test.png');

      // When
      const processPromise = processImage(testFilePath, { colorDepth: '8bit' });

      // Then
      return processPromise.then(([result]) => {
        expect(result.contents.readUInt8(1)).to.equal(0b00000011);
      });
    });

    it('should convert 8bit blue color to last 2bits', () => {
      // Given
      const testFilePath = path.resolve(__dirname, './test.png');

      // When
      const processPromise = processImage(testFilePath, { colorDepth: '8bit' });

      // Then
      return processPromise.then(([result]) => {
        expect(result.contents.readUInt8(2)).to.equal(0b00011100);
      });
    });
  });
});
