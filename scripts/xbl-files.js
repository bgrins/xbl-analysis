var xmlom = require('xmlom');
var fs = require('fs');
var request = require('request-promise-native');
var moment = require("moment");

var browserFiles = [
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/browser-tabPreviews.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/pageinfo/feeds.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/pageinfo/pageInfo.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/tabbrowser.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/urlbarBindings.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/customizableui/content/panelUI.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/customizableui/content/toolbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/downloads/content/download.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/places/content/menu.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/places/content/tree.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/preferences/handlers.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/preferences/siteListItem.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/search/content/search.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/translation/translation-infobar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/extensions/formautofill/content/formautofill.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/themes/linux/places/organizer.xml',
];
var toolkitFiles = [
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/autocomplete.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/browser.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/button.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/checkbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/colorpicker.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimebox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimepicker.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/datetimepopup.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/dialog.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/editor.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/expander.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/filefield.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/findbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/general.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/groupbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/listbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/menu.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/menulist.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/notification.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/numberbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/optionsDialog.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/popup.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/preferences.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/progressmeter.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/radio.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/remote-browser.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/resizer.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/richlistbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scale.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scrollbar.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/scrollbox.xml',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/spinbuttons.xml',
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
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/windows/global/globalBindings.xml',
];
var allFiles = module.exports.files = browserFiles.concat(toolkitFiles);

// Build up an array like:
// '2017-07-01',
// '2017-07-15',
// '2017-08-01',
// ...
function getRevsOverTime(daily = false) {
  let old = moment("2017-08-01");
  let now = moment();
  let revs = [];

  if (daily) {
    while (old < now) {
      old.add(1, 'days');
      revs.push(old.format('YYYY-MM-DD'));
    }
  } else {
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

function populateCache(rev) {
  if (!rev) {
    throw "Need a rev";
  }

  console.log(`Populating ${rev}`);

  let files = allFiles;
  // Allow for revisions like 'master@{2017-09-19}'
  files = files.map(file => {
    return file.replace('/master/', `/${rev}/`);
  });

  if (!fs.existsSync('cache')) {
    fs.mkdirSync('cache');
  }
  var dir = `cache/${rev}`;
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir);
  }
  return Promise.all(files.map(file => {
    var fileName = file.replace(/\//g, '-').split('}')[1];
    var cachedFilePath = `cache/${rev}/${fileName}`;
    if (fs.existsSync(cachedFilePath)) {
      console.log(`File already exists: ${cachedFilePath}`);
      return new Promise(resolve => {
        resolve();
      });
    }
    console.log(`Requesting file: ${file}`);
    return request(file).then(body => {
      fs.writeFileSync(cachedFilePath, body);
    }).catch(e => {
      console.log("Error requesting: ", file, rev);
      throw "Error requesting file: " + file;
    })
  }));
}
module.exports.populateCache = populateCache;

module.exports.getPrettyRev = rev => {
  if (!rev) {
    return "index";
  }
  return rev.split("{")[1].split("}")[0];
}

module.exports.getParsedFiles = (rev) => {
  let files = allFiles;
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
  body = body.replace(/\&([a-z0-9\-]+)\;/gi, "FROM-DTD-$1"); // Replace DTD entities
  body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2"); // Replace DTD entities
  body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2-$3"); // Replace DTD entities
  body = body.replace(/\&([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\.([a-z0-9\-]+)\;/gi, "FROM-DTD-$1-$2-$3-$4"); // Replace DTD entities
  
  // This file creates a binding with a duplicate ID from the base binding
  if (file.includes("themes/windows/global/globalBindings.xml")) {
    body = body.replace('id="radio"', 'id="windows-radio"');
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