var xmlom = require('xmlom');
var fs = require('fs');
var request = require('request-promise-native');
var moment = require("moment");

process.on('unhandledRejection', (reason, p) => {
  console.log("Exiting due to unhandled rejection!");
  console.log(reason, p);
  process.exit(2);
});

//  egrep -l1 -r -n -i --include="*.xml" "<binding id" .

var allFiles = [
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/browser-tabPreviews.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/tabbrowser.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/urlbarBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/customizableui/content/toolbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/downloads/content/download.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/places/content/menu.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/places/content/tree.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/preferences/handlers.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/search/content/search.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/translation/translation-infobar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/extensions/formautofill/content/formautofill.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/themes/linux/places/organizer.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/dom/xbl/builtin/android/platformHTMLBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/dom/xbl/builtin/emacs/platformHTMLBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/dom/xbl/builtin/mac/platformHTMLBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/dom/xbl/builtin/unix/platformHTMLBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/dom/xbl/builtin/win/platformHTMLBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/dom/xml/resources/XMLPrettyPrint.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/layout/style/xbl-marquee/xbl-marquee.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/components/printing/content/printPreviewBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/components/prompts/content/tabprompts.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/autocomplete.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/browser.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/button.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/checkbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/colorpicker.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimebox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimepopup.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/dialog.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/editor.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/filefield.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/findbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/general.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/groupbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/listbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/menu.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/menulist.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/notification.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/numberbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/popup.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/progressmeter.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/radio.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/remote-browser.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/resizer.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/richlistbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scale.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scrollbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scrollbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/splitter.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/stringbundle.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/tabbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/text.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/textbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/toolbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/toolbarbutton.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/tree.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/videocontrols.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/wizard.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/extensions/content/blocklist.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/extensions/content/extensions.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/extensions/content/xpinstallItem.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/handling/content/handler.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/update/content/updates.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/pluginproblem/content/pluginProblem.xml',
];

var deletedFiles = {
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/spinbuttons.xml': '2018-02-10',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/windows/global/globalBindings.xml': '2017-11-04',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/pageinfo/pageInfo.xml': '2017-11-09',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/extensions/content/setting.xml': '2017-11-15',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/mobile/android/chrome/content/bindings/checkbox.xml': '2017-11-15',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/mobile/android/chrome/content/bindings/settings.xml': '2017-11-15',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/xpfe/components/autocomplete/resources/content/autocomplete.xml': '2017-11-28',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/optionsDialog.xml': '2018-01-04',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/preferences.xml': '2018-01-05',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/expander.xml': '2018-01-06',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimepicker.xml': '2018-01-10',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/preferences/siteListItem.xml': '2018-02-15',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/pageinfo/feeds.xml': '2018-02-19',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/customizableui/content/panelUI.xml': '2018-02-26',
};

var exportedFiles = allFiles.slice();
for (var i in deletedFiles) {
  exportedFiles.push(i);
}
module.exports.files = exportedFiles;

function getAllFilesForRev(rev) {
  var retFiles = allFiles.slice();
  // No rev: anything that's been deleted in the past should also be deleted on master
  if (!rev) {
    return retFiles;
  }

  let dateForRev = moment(rev.match(/master\@\{(.*)\}/)[1]);
  for (var i in deletedFiles) {
    if (dateForRev < moment(deletedFiles[i])) {
      retFiles.push(i);
    }
  }
  return retFiles;
}
module.exports.getAllFilesForRev = getAllFilesForRev;

// Build up an array like:
// '2017-07-01',
// '2017-07-15',
// '2017-08-01',
// ...
function getRevsOverTime(daily = false) {
  let old = moment("2017-10-06");
  let now = moment();
  let revs = [];

  if (daily) {
    // Gather the day before the first
    old.subtract(1, 'days');
    while (old < now) {
      revs.push(old.format('YYYY-MM-DD'));
      old.add(1, 'days');
    }
  } else {
    old = moment("2017-10-01");
    let addDays = false;
    while (old < now) {
      if (addDays) {
        old.add(14, 'days');
        if (old < now) {
          revs.push(old.format('YYYY-MM-DD'));
        }
        old.subtract(14, 'days').add(1, 'month');
      } else {
        revs.push(old.format('YYYY-MM-DD'));
      }
      addDays = !addDays;
    }
  }
  return revs.map(r => `master@{${r}}`);
}
module.exports.revsEveryDay = getRevsOverTime(true);
module.exports.revs = getRevsOverTime();

module.exports.getPrettyRev = rev => {
  if (!rev) {
    return "index";
  }
  return rev.split("{")[1].split("}")[0];
}

module.exports.getParsedFiles = (rev) => {
  let files = getAllFilesForRev(rev);
  if (rev) {
    // Allow for revisions like 'master@{2017-09-19}'
    files = files.map(file => {
      return file.replace('/master/', `/${rev}/`);
    });
  }

  return Promise.all(files.map(file => {
    if (rev) {
      var fileName = file.replace(/\//g, '-').split('}-')[1];
      var cachedFilePath = `cache/${rev}/${fileName}`;
      if (fs.existsSync(cachedFilePath)) {
        var body = fs.readFileSync(cachedFilePath, 'utf8');
        return parseBody(body, file);
      }
    }
    return request(file).then(body => {
      return parseBody(body, file);
    });
  }));
};

function parseBody(body, file) {
  body = preprocessFile(body);
  body = body.replace(/^#(.*)/gm, ''); // This one is a special case for preferences.xml which has many lines starting with #
  body = body.replace(/\&amp\;\&amp\;/g, 'RESETTHISBACK'); // See https://dxr.mozilla.org/mozilla-central/source/xpfe/components/autocomplete/resources/content/autocomplete.xml#1325
  body = body.replace(/\&([a-z0-9\-]+)\;/gi, "FROM-DTD-$1"); // Replace DTD entities
  body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2"); // Replace DTD entities
  body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2-$3"); // Replace DTD entities
  body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2-$3-$4"); // Replace DTD entities
  body = body.replace(/RESETTHISBACK/g, '&amp;&amp;');
  // This file creates a binding with a duplicate ID from the base binding


  var replaceDuplicateIds = {
    "themes/windows/global/globalBindings.xml": "windows",
    "builtin/android": "builtin-android",
    "builtin/emacs": "builtin-emacs",
    "builtin/mac": "builtin-mac",
    "builtin/unix": "builtin-unix",
    "builtin/win": "builtin-win",
    "xpfe/components/autocomplete/resources/content/autocomplete.xml": "xpfe",
    "mobile/android/chrome/content/bindings/checkbox.xml": "android",
    "components/customizableui/content/toolbar.xml": "customizableui",
  }
  exports.replaceDuplicateIds = replaceDuplicateIds;

  for (var i in replaceDuplicateIds) {
    if (file.includes(i)) {
      body = body.replace(/\<binding id=\"([a-zA-Z\-]+)\"/gi, `<binding id="${replaceDuplicateIds[i]}-$1"`);
    }
  }

  return xmlom.parseString(body, { xmlns: true }).then(doc => {
    return { doc, body, url: file, file: file.split('/').reverse()[0] };
  }, (e=> {
    console.log("Error parsing: ", file, e);
  }));
}

function preprocessFile(content) {
  // This maps the text of a "#if" to its truth value. We need to do some cheap parsing
  // to prevent duplicate
  const ifMap = {
    "#ifdef MOZ_PHOTON_THEME": true,
    "#ifdef MOZ_WIDGET_GTK": false,
    "#ifndef XP_WIN": false,
    "#ifndef XP_MACOSX": true,
    "#ifdef XP_MACOSX": false,
    "#ifdef XP_UNIX": false,
    "#ifdef XP_WIN": true,
  };

  let lines = content.split("\n");
  let ignoring = false;
  let newLines = [];
  let continuation = false;
  for (let line of lines) {
    if (line.startsWith("#if")) {
      if (!(line in ifMap)) {
        throw new Error("missing line in ifMap: " + line);
      }
      ignoring = !ifMap[line];
    } else if (line.startsWith("#else")) {
      ignoring = !ignoring;
    } else if (line.startsWith("#endif")) {
      ignoring = false;
    }

    if (!ignoring) {
      newLines.push(line);
    }
  }
  return newLines.join("\n");
}

function getBindingMetadata() {
  var metadataForBindings = {};
  var totalMetadata = 0;
  return request("https://docs.google.com/spreadsheets/d/e/2PACX-1vSBOysww1PcGcB19Ew_NOUpPnQMGkP1RQGAOAoYMRvgVMWWhmcdjyOfLjvEDCC_F6nobE7Hu6ooaj7Q/pub?gid=0&single=true&output=csv").then(response => {
    var rows = response.split("\n");
    console.log(`Found ${rows.length} rows from spreadsheet`);
    response.split("\n").forEach((row) => {
      var cols = row.split(",");
      var id = cols[1];
      var bug = cols[2];
      var type = cols[3];
      if (bug) {
        metadataForBindings[id] = {
          bug,
          type
        }
      }
    });

    for (var i in metadataForBindings) {
      totalMetadata++;
    }

    console.log("Processed metadata: ", metadataForBindings);
    return {metadataForBindings, totalMetadata};
  });
}
exports.getBindingMetadata = getBindingMetadata;