var xmlom = require('xmlom');
var request = require('request-promise-native');

var browserFiles = [
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/base/content/browser-tabPreviews.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/base/content/pageinfo/feeds.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/base/content/pageinfo/pageInfo.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/base/content/tabbrowser.xml',
  // 'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/base/content/urlbarBindings.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/customizableui/content/panelUI.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/customizableui/content/toolbar.xml',
  // 'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/downloads/content/download.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/places/content/menu.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/places/content/tree.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/preferences/handlers.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/preferences/siteListItem.xml',
  // 'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/search/content/search.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/components/translation/translation-infobar.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/extensions/formautofill/content/formautofill.xml',
  'https://hg.mozilla.org/mozilla-central/raw-file/tip/browser/themes/linux/places/organizer.xml',
];
var toolkitFiles = [
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
var allFiles = module.exports.files = browserFiles.concat(toolkitFiles);

module.exports.getParsedFiles = () => {
  return Promise.all(allFiles.map(file => {
    return request(file).then(body => {
      body = body.replace(/#ifdef XP_(.*)/g, '')
                .replace(/#ifndef XP_(.*)/g, '')
                .replace(/#ifdef MOZ_WIDGET_GTK/g, '')
                .replace(/#else/g, '')
                .replace(/#endif/g, '')
                .replace(/^#(.*)/gm, ''); // This one is a special case for preferences.xml which has many lines starting with #
      console.log(`requested ${file}`);
      return xmlom.parseString(body);
    });
  }));
};
