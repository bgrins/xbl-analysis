var fs = require('fs');
var {getParsedFiles, files} = require('./xbl-files');
var {getJSForBinding, titleCase, formatExtends} = require("./custom-element-utils");

getParsedFiles().then(parsedFiles => {
  var jsObj = [];
  parsedFiles.forEach(({file, doc, body}) => {
    jsObj.push({file, body});
  });

  var lis = jsObj.map(({file}, i) => {
    return `<li><a href='#' data-index=${i}>${file}</a></li>`;
  }).join("\n");

  fs.writeFileSync('converter/index.html', `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>XBL To Custom Element Converter</title>
    <link rel="stylesheet" href="../static/styles.css" />
    <script src="../static/xmlom.js"></script>
    <style>
    main {
      display: grid;
      grid-template-rows: auto 1fr;
      height: 100vh;
      width: 100vw;
      position: absolute;
      top: 0;
      left: 0;
    }
    header {
      padding: 1em;
    }
    div {
      display: grid;
      overflow: hidden;
      grid-template-columns: auto 1fr 1fr;
    }
    textarea, pre {
      box-sizing: border-box;
      margin: 10px;
      padding: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: monospace;
      font-size: 12px;
    }
    ul {
      min-width: 100px;
      margin: 10px;
      padding: 0;
      overflow: scroll;
    }
    li {
      margin: 0;
      padding: 0;
      list-style: none;
      word-break: keep-all;
    }
    </style>
    <script>
      var files = ${JSON.stringify(jsObj)};
    </script>
  </head>
  <body>
  <main>
  <header>
  <a href="../">Home</a>
  <a href="https://github.com/bgrins/xbl-analysis">Code</a>
  <h1>XBL To Custom Element Converter</h1>
  </header>
  <div>
    <ul>
    ${lis}
    </ul>
    <textarea>
    ${jsObj[10].body}
    </textarea>
    <pre></pre>
  </div>
  </main>
    <script>
    ${getJSForBinding.toString()}
    ${titleCase.toString()}
    ${formatExtends.toString()}

    var worker = new Worker("../static/prettier-worker.js");
    var textarea = document.querySelector("textarea");
    var pre = document.querySelector("pre");
    function createPreview() {
      var body = textarea.value;
      body = body.replace(/\&([a-z0-9\-]+)\;/gi, "FROM-DTD-$1"); // Replace DTD entities
      body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2"); // Replace DTD entities
      body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2-$3"); // Replace DTD entities
      body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2-$3-$4"); // Replace DTD entities
      var parsed = xmlom.parseString(body, {
        xmlns: true,
      });
      parsed.then(doc => {
        console.log(doc, doc.find("binding"));
        let js = doc.find("binding").map(binding => {
          return getJSForBinding(binding);
        }).join("\\n");
        pre.textContent = "Parsing...";

        worker.postMessage({text: js});
        worker.addEventListener("message", function(message) {
          pre.textContent = message.data.formatted;
        }, {once: true});
      }).catch(e => {
        pre.textContent =  "Error parsing XML:\\n" + e;
      });
    }
    textarea.addEventListener("input", createPreview);
    createPreview();

    document.querySelector("ul").addEventListener("click", function(e) {
      if (e.originalTarget.localName === "a") {
        e.preventDefault();
        textarea.value = files[e.originalTarget.dataset.index].body;
        createPreview();
      }
    });
    </script>
  </body>
  </html>
`);

});