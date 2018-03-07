var fs = require("fs");
var { replaceDuplicateIds, getParsedFiles } = require("./xbl-files");
// File pulled from https://treeherder.mozilla.org/#/jobs?repo=try&revision=16993722f144439db3cc9f032f9354f832e1277f&filter-tier=1&filter-tier=2&filter-tier=3&selectedJob=166297561
var text = fs.readFileSync("xblcounts.csv", "utf8");

var lines = text.trim().split("\r\n");
var unique = [...new Set(lines)];

console.log(
  `${lines.length} lines and ${unique.length} unique binding+tagname combos`
);

let tagnames = [
  ...new Set(
    unique.map(l => {
      return l.split(",")[1];
    })
  )
].sort();
console.log(
  `${tagnames.length} tagnames with xbl bindings attached: ${JSON.stringify(tagnames, null, 2)}`
);

let bindings = [
  ...new Set(
    unique.map(l => {
      let url = l.split(",")[0];
      let id = url.split("#")[1];
      for (var i in replaceDuplicateIds) {
        if (url.includes(i)) {
          id = replaceDuplicateIds[i] + "-" + id;
        }
      }
      return id;
    })
  )
].sort();
console.log(
  `${bindings.length} xbl bindings attached: ${JSON.stringify(bindings, null, 2)}`
);

async function getBindingsForRev() {
  let allBindings = [];
  let docs = await getParsedFiles();
  docs.forEach(({ doc }, i) => {
    let bindings = doc.find("binding");
    bindings.forEach(b => allBindings.push(b.attrs.id));
  });
  return allBindings;
}

(async function() {
  let allBindings = await getBindingsForRev();
  console.log(
    `Bindings missing from try run: ${JSON.stringify(arr_diff(bindings, allBindings), null, 2)}`
  );
})();

function arr_diff(a1, a2) {
  var a = [],
    diff = [];

  for (var i = 0; i < a1.length; i++) {
    a[a1[i]] = true;
  }

  for (var i = 0; i < a2.length; i++) {
    if (a[a2[i]]) {
      delete a[a2[i]];
    } else {
      a[a2[i]] = true;
    }
  }

  for (var k in a) {
    diff.push(k);
  }

  return diff;
}