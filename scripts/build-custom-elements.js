
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
      fs.writeFileSync(`elements/generated/${fileName}`, prettier.format(getJSForBinding(binding)));
    });
  });

  scripts = getOrderedScripts(extendsMap).map(file => `<script src="generated/${file}"></script>`).join('\n');
  var elements = sampleElements.map(element => `<strong>${element}:</strong> <xbl-${element} observes="observe-test-target"></xbl-${element}><br />`).join('\n');
  fs.writeFileSync('elements/index.html', `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Custom Elements</title>
        <style>
        </style>
        <script src="../static/custom-elements.min.js"></script>
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
  let hasExtends = !!formatExtends(binding.attrs.extends);
  js.push(`class ${className} `);
  if (hasExtends) {
    js.push(`extends Xbl${formatExtends(binding.attrs.extends)} `);
  } else {
    js.push(`extends BaseElement `);
  }

  js.push('{')

  let childMarkup = [];
  let content = binding.find("content");
  if (content.length > 1) {
    throw "Unexpected second content field";
  } else if (content.length === 1) {
    function printChild(child) {
      let attrs = '';
      for (var attr in child.attrs) {
        attrs += ' ' + attr.replace('xbl:', '') + '="' + child.attrs[attr].replace('"', '\"').replace(/xbl\:/g, '') + '"';
      }
      let name = child.name === "label" ? 'xbl-text-label' : child.name;
      childMarkup.push(`<${name}${attrs}>`);
      child.children.forEach(printChild);
      childMarkup.push(`</${name}>`);
    }
    content[0].children.forEach(printChild);
  } else {
    console.log("No content for binding", binding.attrs.id);
  }

  if (binding.attrs.id == "checkbox-baseline") {
    childMarkup.unshift("<input type='checkbox' />")
  }

  var innerHTML = content.length ?
        "this.innerHTML = `" + childMarkup.join('\n') + "`;" :
        "";

  js.push(`
    constructor() {
      super();
    }
    connectedCallback() {
      ${hasExtends ? 'super.connectedCallback()' : ''}
      console.log(this, 'connected');

      ${innerHTML}
      let comment = document.createComment('Creating ${elementName}');
      this.prepend(comment);
    }
    disconnectedCallback() { }
  `);

  // <property>
  for (let property of binding.find('property')) {
    if (property.attrs.onset) {
      js.push(`
        set ${property.attrs.name}(val) {
          ${property.attrs.onset}
        }
      `);
    }
    if (property.attrs.onget) {
      js.push(`
        get ${property.attrs.name}() {
          ${property.attrs.onget}
        }
      `);
    }
  }

  // <method>
  // TODO

  js.push('}');

  js.push(`
    customElements.define("${elementName}", ${className});
  `)
  return js.join(' ');
}
