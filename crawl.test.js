const { urlNormalise, getURLsFromHTML } = require("./crawl");
const { test, expect } = require("@jest/globals");

test("urlNormalise  handles paths without trailing slashes", () => {
  const input = "https://example.com/path";
  const expectedOutput = "example.com/path";
  const actualOutput = urlNormalise(input);
  expect(actualOutput).toEqual(expectedOutput);
});

test("urlNormalise handles trailing slashes", () => {
  const input = "https://example.com/path/";
  const expectedOutput = "example.com/path";
  const actualOutput = urlNormalise(input);
  expect(actualOutput).toEqual(expectedOutput);
});

test("urlNormalise handles capitalization", () => {
  const input = "https://EXAMPLE.com/path";
  const expectedOutput = "example.com/path";
  const actualOutput = urlNormalise(input);
  expect(actualOutput).toEqual(expectedOutput);
});

test("urlNormalise strips protocol", () => {
  const input = "http://example.com/path";
  const expectedOutput = "example.com/path";
  const actualOutput = urlNormalise(input);
  expect(actualOutput).toEqual(expectedOutput);
});

test("getURLsFromHTML absolute URLs", () => {
  const inputHTMLBody = `
  <html>
     <body>
        <a href="https://example.com/path">Example.com Path
        </a>
    </body>
  </html>`;

  const inputBaseURL = "https://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expectedOutput = ["https://example.com/path"];
  expect(actual).toEqual(expectedOutput);
});


test("getURLsFromHTML relative URLs", () => {
  const inputHTMLBody = `
  <html>
     <body>
        <a href="/path/">Example.com Path
        </a>
    </body>
  </html>`;

  const inputBaseURL = "https://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expectedOutput = ["https://example.com/path/"];
  expect(actual).toEqual(expectedOutput);
});


test("getURLsFromHTML both absolute and relative URLs", () => {
  const inputHTMLBody = `
  <html>
     <body>
        <a href="https://example.com/absolute">Example.com Absolute
        </a>
        <a href="/relative">Example.com Relative
        </a>
    </body>
  </html>`;

  const inputBaseURL = "https://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expectedOutput = ["https://example.com/absolute", "https://example.com/relative"];
  expect(actual).toEqual(expectedOutput);
});

test("getURLsFromHTML invalid URLs", () => {
  const inputHTMLBody = `
  <html>
     <body>
        <a href="http://[::1">Broken URL
        </a>
    </body>
  </html>`;

  const inputBaseURL = "https://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expectedOutput = [];
  expect(actual).toEqual(expectedOutput);
});
