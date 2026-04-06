const { JSDOM } = require("jsdom");

const crawlPage = async (baseURL, currentURL, pages = {}) => {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedCurrentURL = urlNormalise(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    pages[normalizedCurrentURL] = 1;
    console.log(`actively crawling ${currentURL}`);

    try {
        const response = await fetch(currentURL);
        if (response.status > 399) {
            console.log(`error in fetch with status code: ${response.status} on page: ${currentURL}`);
            return pages;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("text/html")) {
            console.log(`non-html response, content type: ${contentType} on page: ${currentURL}`);
            return pages;
        }

        const htmlBody = await response.text();
        console.log(`html content for ${currentURL}:\n${htmlBody}`);
        const nextURLs = getURLsFromHTML(htmlBody, baseURL);
        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages);
        }
    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`);
    }

    return pages;
    console.log(pages.text());
};

const getURLsFromHTML = (htmlBody, baseUrl) => {
    const urls = [];
    const dom = new JSDOM(htmlBody, {
        url: baseUrl,
    });
    const linkElements = dom.window.document.querySelectorAll("a");
    for (const linkElement of linkElements) {
        const href = linkElement.getAttribute("href");
        try {
            const urlObj = new URL(href, baseUrl);
            urls.push(urlObj.href);
        } catch {
            console.log(`invalid url found: ${href}`);
        }
    }
    return urls;
};

const urlNormalise = (urlString) => {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
        return hostPath.slice(0, -1);
    }
    return hostPath;
};

module.exports = {
    urlNormalise,
    getURLsFromHTML,
    crawlPage,
};
