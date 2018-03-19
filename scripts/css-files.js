var fs = require('fs');
var request = require('request-promise-native');

process.on('unhandledRejection', (reason, p) => {
  console.log("Exiting due to unhandled rejection!");
  console.log(reason, p);
  process.exit(2);
});

function stringReverse(str) {
  return str.split('').reverse().join('');
}

var cssFiles = [
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/browser.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/base/content/tabbrowser.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/downloads/content/downloads.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/places/content/places.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/preferences/handlers.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/components/search/content/searchbarBindings.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/extensions/formautofill/content/formautofill.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/themes/linux/browser.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/themes/linux/places/organizer.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/browser/themes/shared/downloads/progressmeter.inc.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/layout/style/contenteditable.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/layout/style/res/forms.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/layout/style/res/html.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/layout/style/res/number-control.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/layout/svg/svg.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/mobile/android/themes/geckoview/content.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/minimal-xul.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/widgets/videocontrols.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/content/xul.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/extensions/content/blocklist.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/extensions/content/extensions.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/extensions/content/xpinstallConfirm.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/handling/content/handler.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/mozapps/update/content/updates.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/pluginproblem/content/pluginProblemBinding.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/pluginproblem/content/pluginReplaceBinding.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/linux/global/global.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/linux/mozapps/viewsource/viewsource.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/osx/global/global.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/osx/global/nativescrollbars.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/windows/global/global.css',
  'https://raw.githubusercontent.com/mozilla/gecko-dev/master/toolkit/themes/windows/global/xulscrollbars.css'
];

var getParsedFiles = module.exports.getParsedFiles = () => {
  return Promise.all(cssFiles.map(file => {
    return request(file).then(body => {
      return parseBody(body, file);
    });
  })).then(val => [].concat.apply([], val));
};

var mozBindingURLRegexp = new RegExp("\\)[\"\']?" + "(.+?)" + "[\"\']?\\(lru :" + stringReverse("-moz-binding"), "gmi");
var mozBindingNoneRegexp = new RegExp(stringReverse('-moz-binding: ?none'), "gmi");
var selectorRegexp = /\{ ?([^{}\;]+)/gmi;

function parseBody(body, file) {
  body = stringReverse(body);
  mozBindingURLRegexp.lastIndex = mozBindingNoneRegexp.lastIndex = 0;
  let infoArr = [];
  let found;
  while ((found = mozBindingURLRegexp.exec(body)) !== null) {
    let info = {
      cssFile: file,
      bindingUrl: stringReverse(found[1])
    };
    selectorRegexp.lastIndex = found.index;
    info.selector = stringReverse(selectorRegexp.exec(body)[1]).replace(/\/\*[^\0]+?\*\//gm, '').replace(/^%.+$/g, '').trim();
    infoArr.push(info);
  }

  while ((found = mozBindingNoneRegexp.exec(body)) !== null) {
    let info = {
      cssFile: file,
      bindingUrl: "none"
    };
    selectorRegexp.lastIndex = found.index;
    info.selector = stringReverse(selectorRegexp.exec(body)[1]).replace(/\/\*[^\0]+?\*\//gm, '').replace(/^%.+$/g, '').trim();
    infoArr.push(info);
  }

  if (!infoArr.length) {
    throw new Error("File " + file + " has no binding?");
  }
  return infoArr;
}

// Test
getParsedFiles().then(val => console.log(JSON.stringify(val, null, 2)));
