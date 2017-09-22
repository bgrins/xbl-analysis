
var fs = require('fs');
var sortedBindings = require('./sorted-bindings');
var {getParsedFiles} = require('./xbl-files');
var prettier = require("prettier");
var data = {};

function countForRev(rev) {
  console.log(`Looking at ${rev}`);
  return getParsedFiles(rev).then(files => {
    let bindingsLOC = new Map();
    let numBindings = files.map(file => {
      let lameBindingParse = file.body.split('<binding ').slice(1);
      let docBindings = file.doc.find('binding');
      if (lameBindingParse.length != docBindings.length) {
        throw `Splitting on '<binding ' did not work (${lameBindingParse.length} vs ${docBindings.length})`;
      }
      docBindings.forEach((binding, i) => {
        bindingsLOC.set(binding.attrs.id, lameBindingParse[i].split(/\n/).length);
      })
      return docBindings.length;
    }).reduce((a, b) => { return a + b; });
    let loc = [...bindingsLOC.values()].reduce((a, b) => { return a + b; });
    let label = rev.match(/@{(.*)}/)[1];
    console.log(loc);
    data[rev] = {
      numBindings,
      loc,
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

let revs = [
  'master@{2017-03-01}',
  'master@{2017-04-01}',
  'master@{2017-06-01}',
  'master@{2017-06-01}',
  'master@{2017-07-01}',
  'master@{2017-08-01}',
  'master@{2017-09-01}',
];

Promise.all(
  revs.map(rev => {
    return countForRev(rev);
  })
).then(() => {
  for (var rev of revs) {
  }

  let inOrder = {};
  for (var rev of revs) {
    console.log(rev, data[rev].label, data[rev].numBindings, data[rev].loc);
    inOrder[rev] = data[rev];
  }

  fs.writeFileSync('graph/xbl-counts.js', prettier.format(`
    var DATA = ${JSON.stringify(inOrder)};
  `));
});
