var fs = require('fs');
var {getParsedFiles, files} = require('./xbl-files');
var {getJSForBinding, titleCase, formatExtends, getFormattedJSForBinding} = require("./custom-element-utils");
var jsFiles = [];
var extendsMap = new Map();
var sampleElements = [];

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
