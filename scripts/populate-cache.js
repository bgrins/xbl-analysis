
var fs = require('fs');
var { revsEveryDay, getAllFilesForRev, getPrettyRev} = require('./xbl-files');
var request = require('request-promise-native');
const activeData = 'https://activedata.allizom.org/query';
var moment = require("moment");

if (!fs.existsSync('cache')) {
  fs.mkdirSync('cache');
}
if (!fs.existsSync('cache/instrumentation')) {
  fs.mkdirSync('cache/instrumentation');
}

function populateBindingCache(rev) {
  if (!rev) {
    throw "Need a rev";
  }

  console.log(`populateBindingCache for ${rev}`);

  let files = getAllFilesForRev(rev);
  // Allow for revisions like 'master@{2017-09-19}'
  files = files.map(file => {
    return file.replace('/master/', `/${rev}/`);
  });

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

async function populateUsageData(rev) {
  if (!rev) {
    throw "Need a rev";
  }
  rev = getPrettyRev(rev);

  // Don't have data until now
  if (moment(rev) < moment("2017-11-17") || moment(rev) > moment().subtract(1, 'days')) {
    return;
  }

  console.log(`Fetching usage data for ${rev}`);

  var cachedFilePath = `cache/instrumentation/${rev}/xulsummary.txt`;
  if (fs.existsSync(cachedFilePath)) {
    console.log(`File already exists: ${cachedFilePath}`);
    return;
  }

  const tomorrowRev = moment(rev).add(1, 'days').format('YYYY-MM-DD');
  const query = {
    "sort": { "repo.push.date": "desc" },
    "limit": 1,
    "from": "task.task.artifacts",
    "where": {
      "and": [
        { "eq": { "name": "public/test_info/xulsummary.txt" } },
        { "gte": { "repo.push.date": { "date": rev } } },
        { "lt": { "repo.push.date": { "date": tomorrowRev } } },
      ]
    },
    "select": ["task.artifacts.url", "repo"],
    format: 'list',
  }

  const queryResult = await request({
    url: activeData,
    method: "POST",
    json: query,
  });
  let firstMcPush = queryResult.data.filter(d => d.repo.branch.name === "mozilla-central")[0];
  if (!firstMcPush) {
    console.log(`Skipping result for ${rev} (${queryResult.data.length} pushes, 0 on m-c)`, JSON.stringify(queryResult));
    return;
  }

  let { url } = firstMcPush.task.artifacts;
  console.log(`Found artifact at ${url}`);
  if (!url) {
    throw `Invalid data ${JSON.stringify(queryResult)}`;
  }

  const artifactData = await request({
    url: url,
    gzip: true,
  });

  if (!fs.existsSync(`cache/instrumentation/${rev}`)) {
    fs.mkdirSync(`cache/instrumentation/${rev}`);
  }
  fs.writeFileSync(cachedFilePath, `Fetched from ${url}\n\n${artifactData}`);
}

async function populateCaches(rev) {
  console.log(`Caching bindings for ${revsEveryDay.revs}`);
  await revsEveryDay.reduce(function (chain, item) {
    return chain.then(populateBindingCache.bind(null, item));
  }, populateBindingCache(revsEveryDay[0]));

  console.log(`Caching usage data for ${revsEveryDay.revs}`);
  await revsEveryDay.reduce(function (chain, item) {
    return chain.then(populateUsageData.bind(null, item));
  }, populateUsageData(revsEveryDay[0]));
}
populateCaches();