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

var getBindingSelectorsData = module.exports.getBindingSelectorsData = () => {
  return Promise.all(cssFiles.map(file => {
    return request(file).then(body => {
      return parseBody(body, file);
    });
  })).then(val => [].concat.apply([], val)).then(infoArr => {
    let data = {};
    infoArr.forEach(info => {
      if (info.bindingUrl === "none") {
        data["NONE"] = data["NONE"] || [];
        data["NONE"].push({ selectors: info.selectors, cssFile: info.cssFile });
        return;
      }
      info.bindingIds.forEach(id => {
        data[id] = data[id] || [];
        data[id].push({ selectors: info.selectors, cssFile: info.cssFile });
      });
    });

    let totalMetadata = 0;
    for (var i in data) {
      totalMetadata++;
    }

    return { bindingSelectorMetadata: data, totalMetadata };
  });
};

var mozBindingURLRegexp = new RegExp("\\)[\"\']?" + "(.+?)" + "[\"\']?\\(lru :" + stringReverse("-moz-binding"), "gmi");
var mozBindingNoneRegexp = new RegExp(stringReverse('-moz-binding: ?none'), "gmi");
var selectorRegexp = /\{ ?([^{}\;]+)/gmi;

var urlIdsMap = {
  "platformHTMLBindings.xml": ["builtin-android", "builtin-emacs", "builtin-mac", "builtin-unix", "builtin-win"],
  "customizableui/toolbar.xml": ["customizableui"],
};

function parseBody(body, file) {
  body = stringReverse(body);
  mozBindingURLRegexp.lastIndex = mozBindingNoneRegexp.lastIndex = 0;

  let infoArr = [];
  let found;
  while ((found = mozBindingURLRegexp.exec(body)) !== null) {
    let url = stringReverse(found[1]);
    let bindingIds = [ url.substr(url.indexOf('#') + 1) ];
    for (var i in urlIdsMap) {
      if (url.includes(i)) {
        bindingIds = [].concat(urlIdsMap[i]).map(str => str + '-' + bindingIds[0]);
      }
    }

    let info = {
      cssFile: file,
      bindingUrl: url,
      bindingIds
    };
    selectorRegexp.lastIndex = found.index;
    info.selectors = stringReverse(selectorRegexp.exec(body)[1])
      .replace(/\/\*[^\0]+?\*\//gm, '').replace(/%[^\n]+/g, '').split(',').map(str => str.trim());
    infoArr.push(info);
  }

  while ((found = mozBindingNoneRegexp.exec(body)) !== null) {
    let info = {
      cssFile: file,
      bindingUrl: "none"
    };
    selectorRegexp.lastIndex = found.index;
    info.selectors = stringReverse(selectorRegexp.exec(body)[1])
      .replace(/\/\*[^\0]+?\*\//gm, '').replace(/%[^\n]+/g, '').split(',').map(str => str.trim());
    infoArr.push(info);
  }

  if (!infoArr.length) {
    throw new Error("File " + file + " has no binding?");
  }
  return infoArr;
}

// Test
// getBindingSelectorsData().then(val => console.log(JSON.stringify(val, null, 2)));
