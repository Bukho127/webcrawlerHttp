const {urlNormalise} = require('./crawl');
const {test, expect} = require('@jest/globals');


test('urlNormalise  handles paths without trailing slashes', () => {
  const input = 'https://example.com/path';
  const expectedOutput = 'example.com/path';
  const actualOutput = urlNormalise(input);
  expect(actualOutput).toEqual(expectedOutput);
});

test('urlNormalise handles trailing slashes', () => {
  const input = 'https://example.com/path/';
  const expectedOutput = 'example.com/path';
  const actualOutput = urlNormalise(input);
  expect(actualOutput).toEqual(expectedOutput);
});

test('urlNormalise handles capitalization', () => {
  const input = 'https://EXAMPLE.com/path';
  const expectedOutput = 'example.com/path';
  const actualOutput = urlNormalise(input);
  expect(actualOutput).toEqual(expectedOutput);
});

test('urlNormalise strips protocol', () => {
  const input = 'http://example.com/path';
  const expectedOutput = 'example.com/path';
  const actualOutput = urlNormalise(input);
  expect(actualOutput).toEqual(expectedOutput);
});