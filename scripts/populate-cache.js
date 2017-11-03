
var { revsEveryDay, populateCache } = require('./xbl-files');

function processRev(rev) {
  return populateCache(rev);
}

const revsToProcess = revsEveryDay.slice(0);

// Cache files in sequence
return revsToProcess.reduce(function (chain, item) {
  return chain.then(processRev.bind(null, item));
}, processRev(revsToProcess.shift()));
