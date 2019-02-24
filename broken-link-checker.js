// https://github.com/stevenvachon/broken-link-checker
const Blc = require('broken-link-checker');

function brokenLinkChecker() {
  const defaultOptions = {
    acceptedSchemes: ['http', 'https'],
    cacheExpiryTime: 3600000,
    cacheResponses: true,
    excludedKeywords: [],
    excludedSchemes: ['data', 'geo', 'javascript', 'mailto', 'sms', 'tel'],
    excludeExternalLinks: false,
    excludeInternalLinks: false,
    excludeLinksToSamePage: true,
    filterLevel: 1,
    honorRobotExclusions: true,
    maxSockets: Infinity,
    maxSocketsPerHost: 1,
    rateLimit: 0,
    requestMethod: 'head',
    retry405Head: true
  };
  let allUniqueBrokenLinks = [];
  let brokenLinks = [];

  const siteChecker = new Blc.SiteChecker(defaultOptions, {
    link: (result) => {
      if (result.broken === true) {
        brokenLinks.push(result.url.resolved);
      }
    },
    page: (error, pageUrl) => {
      // console.log('>>>>>>>>>>>page-error: ', error);
      if (brokenLinks.length) {
        const brokenLinksLen = brokenLinks.length;
        allUniqueBrokenLinks = [...new Set([...allUniqueBrokenLinks, ...brokenLinks])];
        console.log('');
        console.log('>>>>pageUrl    : ', pageUrl);
        process.stdout.write('====brokenLinks: ');
        for (let i = 0; i < brokenLinksLen; i++) {
          if (i !== 0) {
            console.log('                 ', brokenLinks[i]);
          } else {
            console.log('', brokenLinks[i]);
          }
        }
        brokenLinks = [];
      }
    },
    end: () => {
      allUniqueBrokenLinks.sort();
      console.log('All Unique Broken Links: ==========================');
      for (let i = 0; i < allUniqueBrokenLinks.length; i++) {
        console.log('  ', allUniqueBrokenLinks[i]);
      }
    }
  });

  siteChecker.enqueue('http://localhost:1313/');
}

brokenLinkChecker();
