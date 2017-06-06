var xmlom = require('xmlom');
var fs = require('fs');
var request = require('sync-request');
var sortedBindings = require('./sorted-bindings');

var files = [
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/autocomplete.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/browser.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/button.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/checkbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/colorpicker.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/datetimebox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/datetimepicker.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/datetimepopup.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/dialog.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/editor.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/expander.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/filefield.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/findbar.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/general.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/groupbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/listbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/menu.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/menulist.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/notification.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/numberbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/optionsDialog.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/popup.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/preferences.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/progressmeter.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/radio.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/remote-browser.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/resizer.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/richlistbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/scale.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/scrollbar.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/scrollbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/spinbuttons.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/splitter.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/stringbundle.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/tabbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/text.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/textbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/toolbar.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/toolbarbutton.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/tree.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/videocontrols.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/wizard.xml',
];

var idToBinding = {};
var idToFeatures = {};
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
  var html = `
      <details open>
      <summary><a href="${idToUrls[binding]}" target="_blank">${binding}</a> (${idToNumInstances[binding]} total instances)
  `;

  html += `<em>Used features: `;
  html += idToFeatures[binding].map(feature => `<code>${feature}</code>`).join(", ");
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

Promise.all(files.map(file => {
  var res = request('GET', file);
  var body = res.getBody('utf8');
  body = body.replace(/#ifdef XP_(.*)/g, '')
             .replace(/#ifndef XP_(.*)/g, '')
             .replace(/#ifdef MOZ_WIDGET_GTK/g, '')
             .replace(/#else/g, '')
             .replace(/#endif/g, '')
             .replace(/^#(.*)/gm, ''); // This one is a special case for preferences.xml which has many lines starting with #

  return xmlom.parseString(body);
})).then(docs => {
  docs.forEach((doc, i) => {
    doc.find('binding').forEach(binding => {
      idToFeatures[binding.attrs.id] = [];
      idToUrls[binding.attrs.id] = files[i].replace('raw-file', 'file');
      for (let feature of ['resources', 'implementation', 'property', 'field', 'content', 'handler', 'method', 'constructor', 'destructor']) {
        if (binding.find(feature).length) {
          idToFeatures[binding.attrs.id].push(`${feature} (${binding.find(feature).length})`);
        }
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

  console.log("idToNumInstances:", idToNumInstances);
  console.log("idToBinding:", idToBinding);
  console.log("bindingTree:", bindingTree);

  for (let rootBinding of bindingTree["NO_EXTENDS"]) {
    outputHTML.push(printSingleBinding(rootBinding))
  }

  var totalBindings = 0;
  for (let _ in idToBinding) { totalBindings++; }

  if (totalBindings != totalPrintedBindings) {
    console.warn(`There are some orphaned bindings. Expected ${totalBindings} but printed ${totalPrintedBindings}`);
  }
  fs.writeFileSync('index.html', `
    <head>
    <meta charset="utf-8">
    <title>XBL Component Tree</title>
    <style>
      li,ul { list-style: none; }
      em { padding-left: 10px; color: #999; }
      summary {padding: 4px 0; position: relative; width: 100%; }
    </style>
    </head>
    <a href="https://github.com/bgrins/xbl-analysis">Link to code</a>
    <h1>XBL Component Tree</h1>
    <p>About this data:</p>
    <ul>
      <li>This script processes xml files where bindings are declared in toolkit/content/widgets</li>
      <li>From these files, <strong>${totalBindings}</strong> bindings were detected.</li>
      <li>A child in the tree means that it extends the parent</li>
      <li>The tree is sorted based on number of instances of the bindings as described below</li>
    </ul>
    <p>About the "total instances" data:</p>
    <ul>
      <li>It is a count of how many elements have a particular binding applied (including bindings that are not directly appled to the element but created through the <code>extends</code> feature)</li>
      <li>It currently only counts elements created in a new window, so if a binding has 0 instances that does not mean it is unused in Firefox</li>
      <li>The data was gathered from <a href="https://treeherder.mozilla.org/#/jobs?repo=try&revision=f240598809552379792fa3d65d91a712884d1978">a try push</a></small></li>
    </ul>
    ${outputHTML.join('')}`
  );
});
