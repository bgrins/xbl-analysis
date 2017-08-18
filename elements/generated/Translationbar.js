class XblTranslationbar extends XblNotification {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="notification-inner" flex="1" inherits="type">
<hbox anonid="details" align="center" flex="1">
<image class="translate-infobar-element messageImage" anonid="messageImage">
</image>
<panel anonid="welcomePanel" class="translation-welcome-panel" type="arrow" align="start">
<image class="translation-welcome-logo">
</image>
<vbox flex="1" class="translation-welcome-content">
<description class="translation-welcome-headline" anonid="welcomeHeadline">
</description>
<description class="translation-welcome-body" anonid="welcomeBody">
</description>
<hbox align="center">
<xbl-text-label anonid="learnMore" class="plain text-link" onclick="openUILinkIn('https://support.mozilla.org/kb/automatic-translation', 'tab'); this.parentNode.parentNode.parentNode.hidePopup();">
</xbl-text-label>
<spacer flex="1">
</spacer>
<button class="translate-infobar-element" anonid="thanksButton" onclick="this.parentNode.parentNode.parentNode.hidePopup();">
</button>
</hbox>
</vbox>
</panel>
<deck anonid="translationStates" selectedIndex="0">
<hbox class="translate-offer-box" align="center">
<xbl-text-label class="translate-infobar-element" value="&translation.thisPageIsIn.label;">
</xbl-text-label>
<menulist class="translate-infobar-element" anonid="detectedLanguage">
<menupopup>
</menupopup>
</menulist>
<xbl-text-label class="translate-infobar-element" value="&translation.translateThisPage.label;">
</xbl-text-label>
<button class="translate-infobar-element" label="&translation.translate.button;" anonid="translate" oncommand="document.getBindingParent(this).translate();">
</button>
<button class="translate-infobar-element" label="&translation.notNow.button;" anonid="notNow" oncommand="document.getBindingParent(this).closeCommand();">
</button>
</hbox>
<vbox class="translating-box" pack="center">
<xbl-text-label class="translate-infobar-element" value="&translation.translatingContent.label;">
</xbl-text-label>
</vbox>
<hbox class="translated-box" align="center">
<xbl-text-label class="translate-infobar-element" value="&translation.translatedFrom.label;">
</xbl-text-label>
<menulist class="translate-infobar-element" anonid="fromLanguage" oncommand="document.getBindingParent(this).translate()">
<menupopup>
</menupopup>
</menulist>
<xbl-text-label class="translate-infobar-element" value="&translation.translatedTo.label;">
</xbl-text-label>
<menulist class="translate-infobar-element" anonid="toLanguage" oncommand="document.getBindingParent(this).translate()">
<menupopup>
</menupopup>
</menulist>
<xbl-text-label class="translate-infobar-element" value="&translation.translatedToSuffix.label;">
</xbl-text-label>
<button anonid="showOriginal" class="translate-infobar-element" label="&translation.showOriginal.button;" oncommand="document.getBindingParent(this).showOriginal();">
</button>
<button anonid="showTranslation" class="translate-infobar-element" label="&translation.showTranslation.button;" oncommand="document.getBindingParent(this).showTranslation();">
</button>
</hbox>
<hbox class="translation-error" align="center">
<xbl-text-label class="translate-infobar-element" value="&translation.errorTranslating.label;">
</xbl-text-label>
<button class="translate-infobar-element" label="&translation.tryAgain.button;" anonid="tryAgain" oncommand="document.getBindingParent(this).translate();">
</button>
</hbox>
<vbox class="translation-unavailable" pack="center">
<xbl-text-label class="translate-infobar-element" value="&translation.serviceUnavailable.label;">
</xbl-text-label>
</vbox>
</deck>
<spacer flex="1">
</spacer>
<button type="menu" class="translate-infobar-element options-menu-button" anonid="options" label="&translation.options.menu;">
<menupopup class="translation-menupopup cui-widget-panel cui-widget-panelview                                   cui-widget-panelWithFooter PanelUI-subView" onpopupshowing="document.getBindingParent(this).optionsShowing();">
<menuitem anonid="neverForLanguage" oncommand="document.getBindingParent(this).neverForLanguage();">
</menuitem>
<menuitem anonid="neverForSite" oncommand="document.getBindingParent(this).neverForSite();" label="&translation.options.neverForSite.label;" accesskey="&translation.options.neverForSite.accesskey;">
</menuitem>
<menuseparator>
</menuseparator>
<menuitem oncommand="openPreferences('paneGeneral', {origin:'translationInfobar'});" label="&translation.options.preferences.label;" accesskey="&translation.options.preferences.accesskey;">
</menuitem>
<menuitem class="subviewbutton panel-subview-footer" oncommand="document.getBindingParent(this).openProviderAttribution();">
<deck anonid="translationEngine" selectedIndex="0">
<hbox class="translation-attribution">
<xbl-text-label>
</xbl-text-label>
<image src="chrome://browser/content/microsoft-translator-attribution.png" aria-label="Microsoft Translator">
</image>
<xbl-text-label>
</xbl-text-label>
</hbox>
<xbl-text-label class="translation-attribution">
</xbl-text-label>
</deck>
</menuitem>
</menupopup>
</button>
</hbox>
<toolbarbutton ondblclick="event.stopPropagation();" anonid="closeButton" class="messageCloseButton close-icon tabbable" inherits="hidden=hideclose" tooltiptext="&closeNotification.tooltip;" oncommand="document.getBindingParent(this).closeCommand();">
</toolbarbutton>
</hbox>`;
    let comment = document.createComment("Creating xbl-translationbar");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set state(val) {
    let deck = this._getAnonElt("translationStates");

    let activeElt = document.activeElement;
    if (activeElt && deck.contains(activeElt)) activeElt.blur();

    let stateName;
    for (let name of ["OFFER", "TRANSLATING", "TRANSLATED", "ERROR"]) {
      if (Translation["STATE_" + name] == val) {
        stateName = name.toLowerCase();
        break;
      }
    }
    this.setAttribute("state", stateName);

    if (val == Translation.STATE_TRANSLATED) this._handleButtonHiding();

    deck.selectedIndex = val;
  }

  get state() {
    return this._getAnonElt("translationStates").selectedIndex;
  }
  init(aTranslation) {
    this.translation = aTranslation;
    let bundle = Cc["@mozilla.org/intl/stringbundle;1"]
      .getService(Ci.nsIStringBundleService)
      .createBundle("chrome://global/locale/languageNames.properties");
    let sortByLocalizedName = function(aList) {
      return aList
        .map(code => [code, bundle.GetStringFromName(code)])
        .sort((a, b) => a[1].localeCompare(b[1]));
    };

    // Fill the lists of supported source languages.
    let detectedLanguage = this._getAnonElt("detectedLanguage");
    let fromLanguage = this._getAnonElt("fromLanguage");
    let sourceLanguages = sortByLocalizedName(
      Translation.supportedSourceLanguages
    );
    for (let [code, name] of sourceLanguages) {
      detectedLanguage.appendItem(name, code);
      fromLanguage.appendItem(name, code);
    }
    detectedLanguage.value = this.translation.detectedLanguage;

    // translatedFrom is only set if we have already translated this page.
    if (aTranslation.translatedFrom)
      fromLanguage.value = aTranslation.translatedFrom;

    // Fill the list of supported target languages.
    let toLanguage = this._getAnonElt("toLanguage");
    let targetLanguages = sortByLocalizedName(
      Translation.supportedTargetLanguages
    );
    for (let [code, name] of targetLanguages) toLanguage.appendItem(name, code);

    if (aTranslation.translatedTo) toLanguage.value = aTranslation.translatedTo;

    if (aTranslation.state) this.state = aTranslation.state;

    // Show attribution for the preferred translator.
    let engineIndex = Object.keys(Translation.supportedEngines).indexOf(
      Translation.translationEngine
    );
    if (engineIndex != -1) {
      this._getAnonElt("translationEngine").selectedIndex = engineIndex;
    }

    const kWelcomePref = "browser.translation.ui.welcomeMessageShown";
    if (
      Services.prefs.prefHasUserValue(kWelcomePref) ||
      this.translation.browser != gBrowser.selectedBrowser
    )
      return;

    this.addEventListener(
      "transitionend",
      function() {
        // These strings are hardcoded because they need to reach beta
        // without riding the trains.
        let localizedStrings = {
          en: [
            "Hey look! It's something new!",
            "Now the Web is even more accessible with our new in-page translation feature. Click the translate button to try it!",
            "Learn more.",
            "Thanks"
          ],
          "es-AR": [
            "\xA1Mir\xE1! \xA1Hay algo nuevo!",
            "Ahora la web es a\xFAn m\xE1s accesible con nuestra nueva funcionalidad de traducci\xF3n integrada. \xA1Hac\xE9 clic en el bot\xF3n traducir para probarla!",
            "Conoc\xE9 m\xE1s.",
            "Gracias"
          ],
          "es-ES": [
            "\xA1Mira! \xA1Hay algo nuevo!",
            "Con la nueva funcionalidad de traducci\xF3n integrada, ahora la Web es a\xFAn m\xE1s accesible. \xA1Pulsa el bot\xF3n Traducir y pru\xE9bala!",
            "M\xE1s informaci\xF3n.",
            "Gracias"
          ],
          pl: [
            "Sp\xF3jrz tutaj! To co\u015B nowego!",
            "Sie\u0107 sta\u0142a si\u0119 w\u0142a\u015Bnie jeszcze bardziej dost\u0119pna dzi\u0119ki opcji bezpo\u015Bredniego t\u0142umaczenia stron. Kliknij przycisk t\u0142umaczenia, aby spr\xF3bowa\u0107!",
            "Dowiedz si\u0119 wi\u0119cej",
            "Dzi\u0119kuj\u0119"
          ],
          tr: [
            "Bak\u0131n, burada yeni bir \u015Fey var!",
            "Yeni sayfa i\xE7i \xE7eviri \xF6zelli\u011Fimiz sayesinde Web art\u0131k \xE7ok daha anla\u015F\u0131l\u0131r olacak. Denemek i\xE7in \xC7evir d\xFC\u011Fmesine t\u0131klay\u0131n!",
            "Daha fazla bilgi al\u0131n.",
            "Te\u015Fekk\xFCrler"
          ],
          vi: [
            "Nh\xECn n\xE0y! \u0110\u1ED3 m\u1EDBi!",
            "Gi\u1EDD \u0111\xE2y ch\xFAng ta c\xF3 th\u1EC3 ti\u1EBFp c\u1EADn web d\u1EC5 d\xE0ng h\u01A1n n\u1EEFa v\u1EDBi t\xEDnh n\u0103ng d\u1ECBch ngay trong trang.  Hay nh\u1EA5n n\xFAt d\u1ECBch \u0111\u1EC3 th\u1EED!",
            "T\xECm hi\u1EC3u th\xEAm.",
            "C\u1EA3m \u01A1n"
          ]
        };

        let locale = Services.locale.getAppLocaleAsLangTag();
        if (!(locale in localizedStrings)) locale = "en";
        let strings = localizedStrings[locale];

        this._getAnonElt("welcomeHeadline").setAttribute("value", strings[0]);
        this._getAnonElt("welcomeBody").textContent = strings[1];
        this._getAnonElt("learnMore").setAttribute("value", strings[2]);
        this._getAnonElt("thanksButton").setAttribute("label", strings[3]);

        let panel = this._getAnonElt("welcomePanel");
        panel.openPopup(
          this._getAnonElt("messageImage"),
          "bottomcenter topleft"
        );

        Services.prefs.setBoolPref(kWelcomePref, true);
      },
      { once: true }
    );
  }
  _getAnonElt(aAnonId) {}
  translate() {
    if (this.state == Translation.STATE_OFFER) {
      this._getAnonElt("fromLanguage").value = this._getAnonElt(
        "detectedLanguage"
      ).value;
      this._getAnonElt("toLanguage").value = Translation.defaultTargetLanguage;
    }

    this.translation.translate(
      this._getAnonElt("fromLanguage").value,
      this._getAnonElt("toLanguage").value
    );
  }
  closeCommand() {
    this.close();
    this.translation.infobarClosed();
  }
  _handleButtonHiding() {
    let originalShown = this.translation.originalShown;
    this._getAnonElt("showOriginal").hidden = originalShown;
    this._getAnonElt("showTranslation").hidden = !originalShown;
  }
  showOriginal() {
    this.translation.showOriginalContent();
    this._handleButtonHiding();
  }
  showTranslation() {
    this.translation.showTranslatedContent();
    this._handleButtonHiding();
  }
  optionsShowing() {
    // Get the source language name.
    let lang;
    if (this.state == Translation.STATE_OFFER)
      lang = this._getAnonElt("detectedLanguage").value;
    else {
      lang = this._getAnonElt("fromLanguage").value;

      // If we have never attempted to translate the page before the
      // service became unavailable, "fromLanguage" isn't set.
      if (!lang && this.state == Translation.STATE_UNAVAILABLE)
        lang = this.translation.detectedLanguage;
    }

    let langBundle = Cc["@mozilla.org/intl/stringbundle;1"]
      .getService(Ci.nsIStringBundleService)
      .createBundle("chrome://global/locale/languageNames.properties");
    let langName = langBundle.GetStringFromName(lang);

    // Set the label and accesskey on the menuitem.
    let bundle = Cc["@mozilla.org/intl/stringbundle;1"]
      .getService(Ci.nsIStringBundleService)
      .createBundle("chrome://browser/locale/translation.properties");
    let item = this._getAnonElt("neverForLanguage");
    const kStrId = "translation.options.neverForLanguage";
    item.setAttribute(
      "label",
      bundle.formatStringFromName(kStrId + ".label", [langName], 1)
    );
    item.setAttribute(
      "accesskey",
      bundle.GetStringFromName(kStrId + ".accesskey")
    );
    item.langCode = lang;

    // We may need to disable the menuitems if they have already been used.
    // Check if translation is already disabled for this language:
    let neverForLangs = Services.prefs.getCharPref(
      "browser.translation.neverForLanguages"
    );
    item.disabled = neverForLangs.split(",").indexOf(lang) != -1;

    // Check if translation is disabled for the domain:
    let uri = this.translation.browser.currentURI;
    let perms = Services.perms;
    item = this._getAnonElt("neverForSite");
    item.disabled =
      perms.testExactPermission(uri, "translate") == perms.DENY_ACTION;
  }
  neverForLanguage() {
    const kPrefName = "browser.translation.neverForLanguages";

    let val = Services.prefs.getCharPref(kPrefName);
    if (val) val += ",";
    val += this._getAnonElt("neverForLanguage").langCode;

    Services.prefs.setCharPref(kPrefName, val);

    this.closeCommand();
  }
  neverForSite() {
    let uri = this.translation.browser.currentURI;
    let perms = Services.perms;
    perms.add(uri, "translate", perms.DENY_ACTION);

    this.closeCommand();
  }
  openProviderAttribution() {
    Translation.openProviderAttribution();
  }
}
customElements.define("xbl-translationbar", XblTranslationbar);
