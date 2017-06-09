
var fs = require('fs');
var {getParsedFiles, files} = require('./xbl-files');
var prettier = require("prettier");
var jsFiles = [];
var extendsMap = new Map();
var sampleElements = [];

getParsedFiles().then(docs => {
  console.log(docs);
  docs.forEach(doc => {
    doc.find("binding").forEach(binding => {
      binding.attrs.id = binding.attrs.id.toLowerCase();
      binding.attrs.extends = binding.attrs.extends && binding.attrs.extends.toLowerCase();
      let fileName = `${titleCase(binding.attrs.id)}.js`;
      let extendsFileName = formatExtends(binding.attrs.extends) ?
                            `${formatExtends(binding.attrs.extends)}.js` : null;
      extendsMap.set(fileName, extendsFileName);

      sampleElements.push(binding.attrs.id);
      jsFiles.push(fileName);
      fs.writeFileSync(`elements/${fileName}`, prettier.format(getJSForBinding(binding)));
    });
  });

  scripts = getOrderedScripts(extendsMap).map(file => `<script src="${file}"></script>`).join('\n');
  var elements = sampleElements.map(element => `<xbl-${element}></xbl-${element}><br />`).join('\n');
  fs.writeFileSync('elements/index.html', `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Custom Elements</title>
        <style>
        </style>
        <script src="../static/custom-elements.min.js"></script>
        ${scripts}
      </head>
      <body>
      <h1>Sample Elements</h1>
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
  console.log(maxDepth);
  return scripts;
}

function formatExtends(ext) {
  if (!ext || ext.startsWith("xul:")) {
    return null;
  }
  return titleCase(ext.split('#')[1]);
}

function titleCase(str) {
  return str[0].toUpperCase() + str.substr(1).replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function getJSForBinding(binding) {
  let js = [];
  let elementName = 'xbl-' + binding.attrs.id;
  let className = titleCase(elementName);
  js.push(`class ${className} `);
  if (formatExtends(binding.attrs.extends)) {
    js.push(`extends Xbl${formatExtends(binding.attrs.extends)} `);
  } else {
    js.push(`extends HTMLElement `);
  }

  js.push('{')

  js.push(`
    constructor() {
      super();
    }
    connectedCallback() {
      this.textContent = "Hello ${elementName}";
      this.setAttribute('foo', 'bar');
    }
    disconnectedCallback() { }
  `);

  js.push('}');

  js.push(`
    customElements.define("${elementName}", ${className});
  `)
  return js.join(' ');
}
