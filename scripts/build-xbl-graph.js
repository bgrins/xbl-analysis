
var fs = require('fs');
var {getParsedFiles} = require('./xbl-files');
var {allSortedBindings} = require('./sorted-bindings');
var moment = require("moment");
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
      bindingsInstances: allSortedBindings[rev],
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

// Build up an array like:
// '2017-07-01',
// '2017-07-15',
// '2017-08-01',
// ...
let old = moment("2017-07-01");
let now = moment();
let revs = [];
let addDays = false;
while (old < now) {
  if (addDays) {
    old.add(14, 'days');
    if (old < now) {
      revs.push(old.format('YYYY-MM-DD'));
    }
    old.subtract(14, 'days').add(1, 'month');
  } else {
    revs.push(old.format('YYYY-MM-DD'));
  }
  addDays = !addDays;
}
revs = revs.map(r => `master@{${r}}`);

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
