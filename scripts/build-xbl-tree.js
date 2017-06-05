var xmlom = require('xmlom');
var fs = require('fs');
var request = require('sync-request');

var files = [
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/autocomplete.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/browser.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/button.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/checkbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/colorpicker.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/datetimebox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/datetimepicker.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/datetimepopup.xml',
  // 'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/dialog.xml', // Preprocessing
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
  // 'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/optionsDialog.xml', // Preprocessing
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/popup.xml',
  // 'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/preferences.xml', // Preprocessing
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
  // 'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/tabbox.xml', // Preprocessing
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/text.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/textbox.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/toolbar.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/toolbarbutton.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/tree.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/videocontrols.xml',
  // 'https://hg.mozilla.org/mozilla-central/raw-file/tip/toolkit/content/widgets/wizard.xml', // Preprocessing
];

var idToBinding = {};
var idToFeatures = {};
var bindingTree = {};
var outputHTML = [];

function printSingleBinding(binding) {
  var html = `
      <details open>
      <summary>${binding}
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
  return xmlom.parseString(res.getBody('utf8'));
})).then(docs => {
  docs.forEach(doc => {
    doc.find('binding').forEach(binding => {
      idToFeatures[binding.attrs.id] = [];
      for (let feature of ['resources', 'implementation', 'property', 'field', 'content', 'handler', 'method', 'constructor', 'destructor']) {
        if (binding.find(feature).length) {
          idToFeatures[binding.attrs.id].push(`${feature} (${binding.find(feature).length})`);
        }
      }

      idToBinding[binding.attrs.id] = (binding.attrs.extends || '').split('#')[1];
    });
  });
}).then(() => {

  for (let id in idToBinding) {
    bindingTree[idToBinding[id]] = (bindingTree[idToBinding[id]] || []);
    bindingTree[idToBinding[id]].push(id);
  }

  console.log("idToBinding:", idToBinding);
  console.log("bindingTree:", bindingTree);

  for (let rootBinding of bindingTree[undefined]) {
    outputHTML.push(printSingleBinding(rootBinding))
  }

  fs.writeFileSync('index.html', `
    <style>
      li,ul { list-style: none; }
      em { padding-left: 10px; color: #999; }
      summary {padding: 4px 0; position: relative; width: 100%; }
    </style>
    <a href="https://github.com/bgrins/xbl-analysis">Link to code</a>
    <h1>List of XBL Components</h1>
    <p>A child in the tree means that it extends the parent</p>
    ${outputHTML.join('')}`
  );
});
