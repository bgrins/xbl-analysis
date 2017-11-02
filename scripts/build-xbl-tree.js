
var fs = require('fs');
var sortedBindings = require('./sorted-bindings').latest;
var {getParsedFiles, files, revs} = require('./xbl-files');

revs = revs.slice();
const getPrettyRev = rev => {
  if (!rev) {
    return "index";
  }
  return rev.split("{")[1].split("}")[0];
}
const revlinksHTML = revs.map(r=>`<a href='${getPrettyRev(r)}.html'>${getPrettyRev(r)}</a>`).join(" ");
// Get the latest data last (will be written into index.html)
revs.push(undefined);
Promise.all(
  revs.map(rev => {
    return treeForRev(rev);
  })
);

function treeForRev(rev) {
  var idToBinding = {};
  var idToFeatures = {};
  var idToFeatureAttrs = {};
  var featureCounts = Object.create(null);
  var idToUrls = {};
  var idToNumInstances = {};
  var bindingTree = {};
  var outputHTML = [];
  var totalPrintedBindings = 0;
  var totalPrintedFiles = 0;

  function getTotalInstances(binding) {
    if (!sortedBindings[binding]) {
      console.warn(`No usage data for ${binding}`);
    }
    return (bindingTree[binding] || []).reduce((a, val) => {
      return a + getTotalInstances(val);
    }, sortedBindings[binding] || 0);
  }

  function printSingleBinding(binding) {
    totalPrintedBindings++;
    var html = `
      <details open ${idToFeatureAttrs[binding].join(' ')}>
      <summary><a href="${idToUrls[binding]}" target="_blank">${binding}</a> (${idToNumInstances[binding]} total instances)
  `;

    html += `<em>Used features: `;
    html += idToFeatures[binding].map((feature, i) => `<code highlight='${idToFeatureAttrs[binding][i]}'>${feature}</code>`).join(", ");
    html += `</em></summary>`;

    if (bindingTree[binding]) {
      html += `<ul>`
      for (let subBinding of bindingTree[binding]) {
        html += `<li>${printSingleBinding(subBinding)}</li>`
      }
      html += `</ul>`
    }

    html += `</details>`
    return html;
  }

  return getParsedFiles(rev).then(docs => {
    totalPrintedFiles = docs.length;
    docs.forEach(({doc}, i) => {
      doc.find('binding').forEach(binding => {
        idToFeatures[binding.attrs.id] = [];
        idToFeatureAttrs[binding.attrs.id] = [];
        idToUrls[binding.attrs.id] = files[i].replace('raw-file', 'file');

        // Handle the easier features to count, where we just need to detect a node:
        for (let feature of ['resources', 'property', 'field', 'content', 'handler', 'method', 'children', 'constructor', 'destructor']) {
          featureCounts[feature] = featureCounts[feature] || 0;
          let foundFeature = binding.find(feature);
          if (!foundFeature.length && feature === "content") {
            foundFeature = binding.find("xbl:content");
          }
          if (foundFeature.length) {
            featureCounts[feature] += foundFeature.length;
            idToFeatures[binding.attrs.id].push(`${feature} (${foundFeature.length})`);
            idToFeatureAttrs[binding.attrs.id].push(`${feature}`);
          }
        }

        // Count implementation[implements] uses:
        featureCounts['implements'] = featureCounts['implements'] || 0;
        if (binding.find('implementation').length && binding.find('implementation')[0].attrs.implements) {
          featureCounts['implements']++;
          idToFeatures[binding.attrs.id].push(`implements (${binding.find('implementation')[0].attrs.implements})`);
          idToFeatureAttrs[binding.attrs.id].push('implements');
        }

        idToBinding[binding.attrs.id] = (binding.attrs.extends || '').split('#')[1] || "NO_EXTENDS";
      });
    });
  }).then(() => {
    for (let id in idToBinding) {
      bindingTree[idToBinding[id]] = (bindingTree[idToBinding[id]] || []);
      bindingTree[idToBinding[id]].push(id);
    }

    for (let id in idToBinding) {
      idToNumInstances[id] = getTotalInstances(id);
    }

    for (let binding in bindingTree) {
      bindingTree[binding] = bindingTree[binding].sort((a, b) => {
        return idToNumInstances[b] - idToNumInstances[a];
      });
    }

    let candidatesForFlattening = [];
    for (let binding in bindingTree) {
      if (bindingTree[binding].length === 1) {
        let selfInstances = idToNumInstances[bindingTree[binding]];
        let parentInstances = idToNumInstances[binding];
        if (selfInstances == parentInstances) {
          candidatesForFlattening.push(`${bindingTree[binding]} (parent: ${binding}, parent instances: ${parentInstances}, self instances: ${selfInstances})`);
        }
      }
    }
    console.log("idToNumInstances:", idToNumInstances);
    console.log("idToBinding:", idToBinding);
    console.log("bindingTree:", bindingTree);
    console.log(`candidates for flattening (${candidatesForFlattening.length})`, candidatesForFlattening)

    for (let rootBinding of bindingTree["NO_EXTENDS"]) {
      outputHTML.push(printSingleBinding(rootBinding))
    }

    var totalBindings = 0;
    for (let _ in idToBinding) { totalBindings++; }

    if (totalBindings != totalPrintedBindings) {
      console.warn(`There are some orphaned bindings. Expected ${totalBindings} but printed ${totalPrintedBindings}`);
    }

    let featureElements = Object.entries(featureCounts)
                          .map(([key]) => `<div id=${key}></div>`)
                          .join('\n');
    let featureCss = Object.entries(featureCounts)
                          .map(([key]) =>
`#${key}:target ~ * [highlight=${key}] { background: yellow; }
#${key}:target ~ #container details:not([${key}]) > summary { opacity: .5; }`)
                          .join('\n');
    let featureStr = Object.entries(featureCounts)
                            .sort((a, b) => b[1] - a[1])
                            .map(([key,value]) => `
                            <code>${key}</code>: <strong>${value}</strong>`)
                            .join(',');
    let featureHighlightStr = Object.entries(featureCounts)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([key,value]) => `
                                    <a href='#${key}' highlight="${key}">${key}</a>`);
    featureHighlightStr.unshift(`<a href='#'>clear</a>`);

    let revTitle = rev ? (': ' + getPrettyRev(rev)) : '';
    fs.writeFileSync(`tree/${getPrettyRev(rev)}.html`, `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>XBL Component Tree${revTitle}</title>
    <link rel="stylesheet" href="../static/styles.css" />
    <style>
      ${featureCss}
    </style>
    </head>
    <body>
      <main>
        ${featureElements}
        <div id="links">
          <a href="../">Home</a>
          <a href="https://github.com/bgrins/xbl-analysis">Code</a>
        </div>
        <h1>XBL Component Tree${revTitle}</h1>
        <p>About this data:</p>
        <ul>
          <li>This script processes xml files where bindings are declared in toolkit/content/widgets.
              From these ${totalPrintedFiles} files, <strong>${totalBindings}</strong> bindings were detected.</li>
          <li>A child in the tree means that it extends the parent</li>
          <li>Features used: ${featureStr}</li>
          ${rev ? '<a href="index.html">Most recent data</a>' : ('Past data from: ' + revlinksHTML)}
        </ul>
        <p>About "total instances":
          This is a count of how many elements have a particular binding applied
          (including bindings that are not directly appled to the element but created through the <code>extends</code> feature).
          It currently only counts elements created in a new window, so if a binding has 0 instances that does not mean it is unused in Firefox.
        </p>
        <div class='highlights'>
        Highlights: ${featureHighlightStr.join(" | ")}
        </div>
        <div id='container'>
        ${outputHTML.join('')}
        </div>
      </main>
    </body>
  `);
  });
}