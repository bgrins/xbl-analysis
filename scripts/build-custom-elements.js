var fs = require('fs');
var {getParsedFiles, files} = require('./xbl-files');
var {getJSForBinding, titleCase, formatExtends} = require("./custom-element-utils");
var js_beautify = require("js-beautify").js_beautify;
var jsFiles = [];
var extendsMap = new Map();
var sampleElements = [];

function getFormattedJSForBinding(binding) {
  let js = [];
  js.push(
`/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

`);

  js.push(js_beautify(
    getJSForBinding(binding),
    {
      indent_size: 2,
      // preserve_newlines: false,
      max_preserve_newlines: 2,
      brace_style: "preserve-inline"
      // keep_array_indentation: true
    }
  ));

  js.push(`

}
`);

  return js.join("");
}

getParsedFiles().then(files => {
  files.forEach(file => {
    file.doc.find("binding").forEach(binding => {
      binding.attrs.id = binding.attrs.id.toLowerCase();
      binding.attrs.extends = binding.attrs.extends && binding.attrs.extends.toLowerCase();
      let fileName = `${titleCase(binding.attrs.id)}.js`;
      let extendsFileName = formatExtends(binding.attrs.extends) ?
                            `${formatExtends(binding.attrs.extends)}.js` : null;
      extendsMap.set(fileName, extendsFileName);

      sampleElements.push(binding.attrs.id);
      jsFiles.push(fileName);
      fs.writeFileSync(`elements/generated/${fileName}`, getFormattedJSForBinding(binding));
    });
  });

  scripts = getOrderedScripts(extendsMap).map(file => `<script src="generated/${file}"></script>`).join('\n');
  var elements = sampleElements.map(element => `<strong>${element}:</strong> <firefox-${element} observes="observe-test-target"></firefox-${element}><br />`).join('\n');
  fs.writeFileSync('elements/index.html', `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Custom Elements</title>
        <style>
        </style>
        <script src="../static/webcomponents-sd-ce.js"></script>
        <script src="base-element.js"></script>
        ${scripts}
      </head>
      <body>
      <h1>Sample Elements</h1>
      <div id="observe-test-target" observeAttributeName="observeAttributeValue"></div>
      ${elements}
      </body>
    </html>
  `);

  console.log("Done processing files");
}).catch(e=>console.error(e));

function getOrderedScripts() {
  // Build a dependency tree to make sure files are outputted in the correct order
  var seen = {};
  var scripts = [];
  var depth = 0;
  var maxDepth = 0;
  function walk(file) {
    if (seen[file]) return;
    seen[file] = true;
    depth++;
    if (extendsMap.get(file)) {
      walk(extendsMap.get(file));
    }
    maxDepth = Math.max(depth, maxDepth);
    depth--;
    scripts.push(file);
  }
  jsFiles.forEach(walk);
  console.log("Maximum extends depth: ", maxDepth);
  return scripts;
}
