var fs = require("fs");
var sortedBindings = require("./sorted-bindings").latest;
var {titleCase} = require("./custom-element-utils");

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

var { getBindingSelectorsData } = require("./css-files");
var {
  getParsedFiles,
  files,
  revs,
  getPrettyRev,
  getBindingMetadata
} = require("./xbl-files");

var selectorMetaData = null;
revs = revs.slice();
const revlinksHTML = revs
  .map(r => `<a href='${getPrettyRev(r)}.html'>${getPrettyRev(r)}</a>`)
  .join(" ");

let uniqueImplements = new Set();

// Get the latest data last (will be written into index.html)
revs.push(undefined);

async function run() {
  selectorMetaData = (await getBindingSelectorsData()).bindingSelectorMetadata;
  let { metadataForBindings } = await getBindingMetadata();

  for (var i = 0; i < revs.length; i++) {
    await treeForRev(revs[i], metadataForBindings);
  }
}

async function treeForRev(rev, metadataForBindings) {
  var idToBinding = {};
  var idToFeatures = {};
  var idToFeatureAttrs = {};
  var featureCounts = Object.create(null);
  var idToUrls = {};
  var idToNumInstances = {};
  var bindingTree = {};
  var outputHTML = [];
  var totalPrintedBindings = 0;

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
    let metadata = metadataForBindings[binding] || {};
    let selectors = (selectorMetaData[binding] || [])
      .map(b => `${b.selectors.map(s => `<code>${s}</code>`).join(', ')} (<code title="${b.cssFile.substr(58)}">${b.cssFile.match(/[^\/]+\/[^\/]+\.[^\/]+$/)[0]}</code>)`);
    let source = ` (<a href="${idToUrls[binding]}" target="_blank">source</a>)`;
    let search = ` (<a href="https://searchfox.org/mozilla-central/search?q=${binding}">m-c search</a>)`;
    let bug = "";
    if (metadata.bug) {
      bug = ` (<a href='${metadata.bug}'>bug</a>)`;
      console.log("Got metadata " + binding + " ", metadataForBindings[binding]);
    }

    let name = `<span id="${binding}">${binding}</span>`;
    let resolvedBy = "";

    if (metadata.resolvedBy) {
      resolvedBy = `&nbsp;<u>${escapeHtml(metadata.resolvedBy)}</u>`;
      name = `<strike>${name}</strike>`;
    }

    var converted = `(<a href="https://github.com/bgrins/xbl-analysis/blob/gh-pages/elements/generated/${titleCase(binding)}.js">converted to JS</a>)`;
    var html = `
      <details open ${idToFeatureAttrs[binding].join(" ")}>
      <summary>${name}${source}${converted}${search}${bug}${resolvedBy}
      <div class='metadata'>
  `;

    html += `<em>Used features: `;
    html += idToFeatures[binding]
      .map(
        (feature, i) =>
          `<code highlight='${idToFeatureAttrs[binding][
            i
          ]}'>${feature}</code>`
      )
      .join(", ");
    // XXX: Instance data isn't great right now: https://bugzilla.mozilla.org/show_bug.cgi?id=1443328
    // html += ` <small>(${idToNumInstances[binding]} total instances)</small>`;
    html += `</em>`;
    html += `<br /><em>Selectors: ${selectors.join(", ")}</em>`;
    html += `</div></summary>`;

    if (bindingTree[binding]) {
      html += `<ul>`;
      for (let subBinding of bindingTree[binding]) {
        html += `<li>${printSingleBinding(subBinding)}</li>`;
      }
      html += `</ul>`;
    }

    html += `</details>`;
    return html;
  }

  let docs = await getParsedFiles(rev);
  let totalPrintedFiles = docs.length;
  docs.forEach(({ doc }, i) => {
    doc.find("binding").forEach(binding => {
      idToFeatures[binding.attrs.id] = [];
      idToFeatureAttrs[binding.attrs.id] = [];
      idToUrls[binding.attrs.id] = files[i]
        .replace('https://raw.githubusercontent.com/mozilla/gecko-dev/master/',
                 'https://searchfox.org/mozilla-central/source/');

      // Handle the easier features to count, where we just need to detect a node:
      for (let feature of [
        "resources",
        "property",
        "field",
        "content",
        "handler",
        "method",
        "children",
        "constructor",
        "destructor"
      ]) {
        featureCounts[feature] = featureCounts[feature] || 0;
        let foundFeature = binding.find(feature);
        if (!foundFeature.length && feature === "content") {
          foundFeature = binding.find("xbl:content");
        }
        if (!foundFeature.length && feature === "children") {
          foundFeature = binding.find("xbl:children");
        }
        if (foundFeature.length) {
          featureCounts[feature] += foundFeature.length;
          idToFeatures[binding.attrs.id].push(
            `${feature} (${foundFeature.length})`
          );
          idToFeatureAttrs[binding.attrs.id].push(`${feature}`);
        }
      }

      // Count implementation[implements] uses:
      featureCounts["implements"] = featureCounts["implements"] || 0;
      if (
        binding.find("implementation").length &&
        binding.find("implementation")[0].attrs.implements
      ) {
        let interfaces = binding.find("implementation")[0].attrs.implements.split(",").map(s=>s.trim());
        interfaces.forEach(i=>uniqueImplements.add(i));

        featureCounts["implements"]++;
        idToFeatures[binding.attrs.id].push(
          `implements (${binding.find("implementation")[0].attrs.implements})`
        );
        idToFeatureAttrs[binding.attrs.id].push("implements");
      }

      // Count [role] uses:
      featureCounts["role"] = featureCounts["role"] || 0;
      if (binding.attrs.role) {
        featureCounts["role"]++;
        idToFeatures[binding.attrs.id].push(`role (${binding.attrs.role})`);
        idToFeatureAttrs[binding.attrs.id].push("role");
      }

      // Count [role] uses:
      featureCounts["role"] = featureCounts["role"] || 0;
      if (binding.attrs.role) {
        featureCounts["role"]++;
        idToFeatures[binding.attrs.id].push(`role (${binding.attrs.role})`);
        idToFeatureAttrs[binding.attrs.id].push("role");
      }

      // Count [display] uses:
      featureCounts["display"] = featureCounts["display"] || 0;
      if (binding.attrs.display) {
        featureCounts["display"]++;
        idToFeatures[binding.attrs.id].push(`display (${binding.attrs.display})`);
        idToFeatureAttrs[binding.attrs.id].push("display");
      }

      if (idToBinding[binding.attrs.id]) {
        console.log("Detected duplicate binding: ", binding.attrs.id);
      }
      idToBinding[binding.attrs.id] =
        (binding.attrs.extends || "").split("#")[1] || "NO_EXTENDS";
    });
  });

  console.log("Found the following interfaces", uniqueImplements);
  for (let id in idToBinding) {
    bindingTree[idToBinding[id]] = bindingTree[idToBinding[id]] || [];
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
        candidatesForFlattening.push(
          `${bindingTree[
            binding
          ]} (parent: ${binding}, parent instances: ${parentInstances}, self instances: ${selfInstances})`
        );
      }
    }
  }
  console.log("idToNumInstances:", idToNumInstances);
  console.log("idToBinding:", idToBinding);
  console.log("bindingTree:", bindingTree);
  console.log(
    `candidates for flattening (${candidatesForFlattening.length})`,
    candidatesForFlattening
  );

  for (let rootBinding of bindingTree["NO_EXTENDS"]) {
    outputHTML.push(printSingleBinding(rootBinding));
  }

  var totalBindings = 0;
  for (let _ in idToBinding) {
    totalBindings++;
  }
  if (totalBindings != totalPrintedBindings) {
    console.warn(
      `There are some orphaned bindings. Expected ${totalBindings} but printed ${totalPrintedBindings}`
    );
  }

  let featureElements = Object.entries(featureCounts)
    .map(([key]) => `<div id=${key}></div>`)
    .join("\n");
  let featureCss = Object.entries(featureCounts)
    .map(
      ([key]) =>
        `#${key}:target ~ * [highlight=${key}] { background: yellow; }
#${key}:target ~ #container details:not([${key}]) > summary { opacity: .5; }`
    )
    .join("\n");
  let featureStr = Object.entries(featureCounts)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([key, value]) => `
                          <code>${key}</code>: <strong>${value}</strong>`
    )
    .join(",");
  let featureHighlightStr = Object.entries(featureCounts)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([key, value]) => `
                                  <a href='#${key}' highlight="${key}">${key}</a>`
    );
  featureHighlightStr.unshift(`<a href='#'>clear</a>`);

  let revTitle = rev ? ": " + getPrettyRev(rev) : "";
  fs.writeFileSync(
    `tree/${getPrettyRev(rev)}.html`,
    `
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
          ${rev
            ? '<a href="index.html">Most recent data</a>'
            : "Past data from: " + revlinksHTML}
        </ul>
        <div class='highlights'>
        Highlights: ${featureHighlightStr.join(" | ")}
        </div>
        <div id='container'>
        ${outputHTML.join("")}
        </div>
      </main>
    </body>
  `
  );
}

run();
