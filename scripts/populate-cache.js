
var fs = require('fs');
var { revsEveryDay, getAllFilesForRev } = require('./xbl-files');


function populateCache(rev) {
  if (!rev) {
    throw "Need a rev";
  }

  console.log(`Populating ${rev}`);

  let files = getAllFilesForRev(rev);
  // Allow for revisions like 'master@{2017-09-19}'
  files = files.map(file => {
    return file.replace('/master/', `/${rev}/`);
  });

  if (!fs.existsSync('cache')) {
    fs.mkdirSync('cache');
  }
  var dir = `cache/${rev}`;
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir);
  }
  return Promise.all(files.map(file => {
    var fileName = file.replace(/\//g, '-').split('}-')[1];
    var cachedFilePath = `cache/${rev}/${fileName}`;
    if (fs.existsSync(cachedFilePath)) {
      console.log(`File already exists: ${cachedFilePath}`);
      return new Promise(resolve => {
        resolve();
      });
    }
    console.log(`Requesting file: ${file}`);
    return request(file).then(body => {
      fs.writeFileSync(cachedFilePath, body);
    }).catch(e => {
      console.log("Error requesting: ", file, rev);
      throw "Error requesting file: " + file;
    })
  }));
}

function processRev(rev) {
  return populateCache(rev);
}

const revsToProcess = revsEveryDay.slice(0);

// Cache files in sequence
return revsToProcess.reduce(function (chain, item) {
  return chain.then(processRev.bind(null, item));
}, processRev(revsToProcess.shift()));
