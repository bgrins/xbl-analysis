
var fs = require('fs');
var { getParsedFiles, revsEveryDay: revs} = require('./xbl-files');
var {allSortedBindings} = require('./sorted-bindings');
var prettier = require("prettier");
var data = {};

const inContentBindings = {
  "builtin-mac-browser": 1,
  "builtin-mac-editor": 1,
  "builtin-unix-inputFields": 1,
  "builtin-unix-textAreas": 1,
  "builtin-unix-browser": 1,
  "builtin-unix-editor": 1,
  "builtin-win-inputFields": 1,
  "builtin-win-textAreas": 1,
  "builtin-win-browser": 1,
  "builtin-win-editor": 1,
  "builtin-android-inputFields": 1,
  "builtin-android-textAreas": 1,
  "builtin-android-browser": 1,
  "builtin-android-editor": 1,
  "builtin-emacs-inputFields": 1,
  "builtin-emacs-textAreas": 1,
  "builtin-emacs-browser": 1,
  "builtin-emacs-editor": 1,
  "builtin-mac-inputFields": 1,
  "builtin-mac-textAreas": 1,
  "marquee": 1,
  "marquee-horizontal": 1,
  "marquee-vertical": 1,
  "marquee-horizontal-editable": 1,
  "marquee-vertical-editable": 1,
  "scrollbar-base": 1,
  "scrollbar": 1,
  "thumb": 1,
  "replacement": 1,
  "videoControls": 1,
  "touchControls": 1,
  "noControls": 1,
  "prettyprint": 1,
  "pluginProblem": 1,
  "suppressChangeEvent": 1,
  "date-input": 1,
  "time-input": 1,
  "datetime-input-base": 1,
};

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
    let numInContentBindings = 0;
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
        if (inContentBindings[binding.attrs.id]) {
          numInContentBindings++;
        }
      });
      return docBindings.length;
    }).reduce((a, b) => { return a + b; });
    let loc = [...bindingsLOC.values()].reduce((a, b) => { return a + b; });
    let label = rev.match(/@{(.*)}/)[1];
    console.log(loc);
    data[rev] = {
      numBindings,
      numInContentBindings,
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
