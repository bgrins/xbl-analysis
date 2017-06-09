
var fs = require('fs');
var {getParsedFiles, files} = require('./xbl-files');
var jsFiles = [];

getParsedFiles().then(docs => {
  console.log(docs);
  docs.forEach(doc => {
    let classes = [];
    doc.find("binding").forEach(binding => {
      classes.push(getJSForBinding(binding))
    });

    let fileName = `${doc.find("bindings")[0].attrs.id}.js`;
    jsFiles.push(fileName);
    fs.writeFileSync(`elements/${fileName}`, classes.join("\n"));
  });

  let scripts = jsFiles.map(file => `<script src="${file}"></script>`).join('\n');
  fs.writeFileSync('elements/index.html', `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Custom Elements</title>
        <style>
        </style>
        ${scripts}
      </head>
      <body>
      Hi
      </body>
    </html>
  `);
});

function camelCased(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function getJSForBinding(binding) {
  let js = [];

  js.push(`class ${camelCased(binding.attrs.id)} `);
  if (binding.attrs.extends) {
    js.push(`extends ${camelCased(binding.attrs.extends.split('#')[1])} `);
  } else {
    js.push(`extends HTMLElement `);
  }

  js.push('{')

  js.push(`
    constructor() {
      super();
    }
    connectedCallback() { }
    disconnectedCallback() { }
  `);

  js.push('}')
  return js.join(' ');
}
