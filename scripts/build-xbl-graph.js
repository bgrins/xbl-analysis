
var fs = require('fs');
var { getParsedFiles, revsEveryDay: revs} = require('./xbl-files');
var {allSortedBindings} = require('./sorted-bindings');
var prettier = require("prettier");
var data = {};

function processSequential(list, cb) {
  list = list.slice();
  return list.reduce(function (chain, item, i) {
    return chain.then(cb.bind(null, item, i === list.length - 1));
  }, cb(list.shift(), false));
}

function countForRev(rev) {
  console.log(`Looking at ${rev}`);
  return getParsedFiles(rev).then(files => {
    let bindingsLOC = new Map();
    let directoryLOC = {
      'browser': 0,
      'dom': 0,
      'toolkit': 0,
      'mobile': 0,
      'layout': 0,
      'xpfe': 0,
    };
    let directoryBindings = {
      'browser': 0,
      'dom': 0,
      'toolkit': 0,
      'mobile': 0,
      'layout': 0,
      'xpfe': 0,
    };
    let numBindings = files.map(file => {
      let bucketedInDir = null;
      for (let dir in directoryLOC) {
        if (file.url.includes(`}/${dir}/`)) {
          bucketedInDir = dir;
        }
      }
      if (!bucketedInDir) {
        throw `No directory known for: ${file.url}`;
      }

      let lameBindingParse = file.body.split('<binding ').slice(1);
      let docBindings = file.doc.find('binding');
      if (lameBindingParse.length != docBindings.length) {
        throw `Splitting on '<binding ' did not work (${lameBindingParse.length} vs ${docBindings.length})`;
      }
      docBindings.forEach((binding, i) => {
        let loc = lameBindingParse[i].split(/\n/).length;
        directoryLOC[bucketedInDir] += loc;
        directoryBindings[bucketedInDir]++;
        bindingsLOC.set(binding.attrs.id, loc);
      })
      return docBindings.length;
    }).reduce((a, b) => { return a + b; });
    let loc = [...bindingsLOC.values()].reduce((a, b) => { return a + b; });
    let label = rev.match(/@{(.*)}/)[1];
    console.log(loc);
    data[rev] = {
      numBindings,
      loc,
      directoryLOC,
      directoryBindings,
      bindingsLOC: mapToObj(bindingsLOC),
      label,
    };
  });
}

function mapToObj(map) {
  let obj = Object.create(null);
  map = [...map.entries()].sort(([key1, value1], [key2, value2]) => {
    return value2 - value1;
  });
  for (let [k,v] of map) {
      obj[k] = v;
  }
  return obj;
}

// Show even days plus today
revs = revs.filter((r,i) => (i%2) == 0 || i == revs.length - 1);

processSequential(revs, countForRev).then(() => {
  let inOrder = {};
  for (var rev of revs) {
    console.log(rev, data[rev].label, data[rev].numBindings, data[rev].loc);
    inOrder[rev] = data[rev];
  }

  var sortedBindings = {};
  for (var i in allSortedBindings) {
    sortedBindings[i.match(/@{(.*)}/)[1]] = allSortedBindings[i];
  }


  fs.writeFileSync('graph/xbl-counts.js', prettier.format(`
    var DATA = ${JSON.stringify(inOrder)};
    var SORTED_BINDINGS = ${JSON.stringify(sortedBindings)};
  `));
});
