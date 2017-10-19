class FirefoxInputBoxSpell extends FirefoxInputBox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<xul:menupopup anonid="input-box-contextmenu" class="textbox-contextmenu" onpopupshowing="var input =
                                       this.parentNode.getElementsByAttribute('anonid', 'input')[0];
                                     if (document.commandDispatcher.focusedElement != input)
                                       input.focus();
                                     this.parentNode._doPopupItemEnablingSpell(this);" onpopuphiding="this.parentNode._doPopupItemDisabling(this);" oncommand="var cmd = event.originalTarget.getAttribute('cmd'); if(cmd) { this.parentNode.doCommand(cmd); event.stopPropagation(); }">
<xul:menuitem label="&spellNoSuggestions.label;" anonid="spell-no-suggestions" disabled="true">
</xul:menuitem>
<xul:menuitem label="&spellAddToDictionary.label;" accesskey="&spellAddToDictionary.accesskey;" anonid="spell-add-to-dictionary" oncommand="this.parentNode.parentNode.spellCheckerUI.addToDictionary();">
</xul:menuitem>
<xul:menuitem label="&spellUndoAddToDictionary.label;" accesskey="&spellUndoAddToDictionary.accesskey;" anonid="spell-undo-add-to-dictionary" oncommand="this.parentNode.parentNode.spellCheckerUI.undoAddToDictionary();">
</xul:menuitem>
<xul:menuseparator anonid="spell-suggestions-separator">
</xul:menuseparator>
<xul:menuitem label="&undoCmd.label;" accesskey="&undoCmd.accesskey;" cmd="cmd_undo">
</xul:menuitem>
<xul:menuseparator>
</xul:menuseparator>
<xul:menuitem label="&cutCmd.label;" accesskey="&cutCmd.accesskey;" cmd="cmd_cut">
</xul:menuitem>
<xul:menuitem label="&copyCmd.label;" accesskey="&copyCmd.accesskey;" cmd="cmd_copy">
</xul:menuitem>
<xul:menuitem label="&pasteCmd.label;" accesskey="&pasteCmd.accesskey;" cmd="cmd_paste">
</xul:menuitem>
<xul:menuitem label="&deleteCmd.label;" accesskey="&deleteCmd.accesskey;" cmd="cmd_delete">
</xul:menuitem>
<xul:menuseparator>
</xul:menuseparator>
<xul:menuitem label="&selectAllCmd.label;" accesskey="&selectAllCmd.accesskey;" cmd="cmd_selectAll">
</xul:menuitem>
<xul:menuseparator anonid="spell-check-separator">
</xul:menuseparator>
<xul:menuitem label="&spellCheckToggle.label;" type="checkbox" accesskey="&spellCheckToggle.accesskey;" anonid="spell-check-enabled" oncommand="this.parentNode.parentNode.spellCheckerUI.toggleEnabled();">
</xul:menuitem>
<xul:menu label="&spellDictionaries.label;" accesskey="&spellDictionaries.accesskey;" anonid="spell-dictionaries">
<xul:menupopup anonid="spell-dictionaries-menu" onpopupshowing="event.stopPropagation();" onpopuphiding="event.stopPropagation();">
</xul:menupopup>
</xul:menu>
</xul:menupopup>`;
    let comment = document.createComment("Creating firefox-input-box-spell");
    this.prepend(comment);

    Object.defineProperty(this, "_spellCheckInitialized", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._spellCheckInitialized;
        return (this._spellCheckInitialized = false);
      },
      set(val) {
        delete this._spellCheckInitialized;
        return (this._spellCheckInitialized = val);
      }
    });
    Object.defineProperty(this, "_enabledCheckbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._enabledCheckbox;
        return (this._enabledCheckbox = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "spell-check-enabled"
        ));
      },
      set(val) {
        delete this._enabledCheckbox;
        return (this._enabledCheckbox = val);
      }
    });
    Object.defineProperty(this, "_suggestionsSeparator", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._suggestionsSeparator;
        return (this._suggestionsSeparator = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "spell-no-suggestions"
        ));
      },
      set(val) {
        delete this._suggestionsSeparator;
        return (this._suggestionsSeparator = val);
      }
    });
    Object.defineProperty(this, "_dictionariesMenu", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._dictionariesMenu;
        return (this._dictionariesMenu = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "spell-dictionaries-menu"
        ));
      },
      set(val) {
        delete this._dictionariesMenu;
        return (this._dictionariesMenu = val);
      }
    });
  }
  disconnectedCallback() {}

  get spellCheckerUI() {
    if (!this._spellCheckInitialized) {
      this._spellCheckInitialized = true;

      const CI = Components.interfaces;
      if (!(document instanceof CI.nsIDOMXULDocument)) return null;

      var textbox = document.getBindingParent(this);
      if (!textbox || !(textbox instanceof CI.nsIDOMXULTextBoxElement))
        return null;

      try {
        Components.utils.import(
          "resource://gre/modules/InlineSpellChecker.jsm",
          this
        );
        this.InlineSpellCheckerUI = new this.InlineSpellChecker(textbox.editor);
      } catch (ex) {}
    }

    return this.InlineSpellCheckerUI;
  }
  _doPopupItemEnablingSpell(popupNode) {
    var spellui = this.spellCheckerUI;
    if (!spellui || !spellui.canSpellCheck) {
      this._setMenuItemVisibility("spell-no-suggestions", false);
      this._setMenuItemVisibility("spell-check-enabled", false);
      this._setMenuItemVisibility("spell-check-separator", false);
      this._setMenuItemVisibility("spell-add-to-dictionary", false);
      this._setMenuItemVisibility("spell-undo-add-to-dictionary", false);
      this._setMenuItemVisibility("spell-suggestions-separator", false);
      this._setMenuItemVisibility("spell-dictionaries", false);
      return;
    }

    spellui.initFromEvent(document.popupRangeParent, document.popupRangeOffset);

    var enabled = spellui.enabled;
    var showUndo = spellui.canSpellCheck && spellui.canUndo();
    this._enabledCheckbox.setAttribute("checked", enabled);

    var overMisspelling = spellui.overMisspelling;
    this._setMenuItemVisibility("spell-add-to-dictionary", overMisspelling);
    this._setMenuItemVisibility("spell-undo-add-to-dictionary", showUndo);
    this._setMenuItemVisibility(
      "spell-suggestions-separator",
      overMisspelling || showUndo
    );

    // suggestion list
    var numsug = spellui.addSuggestionsToMenu(
      popupNode,
      this._suggestionsSeparator,
      5
    );
    this._setMenuItemVisibility(
      "spell-no-suggestions",
      overMisspelling && numsug == 0
    );

    // dictionary list
    var numdicts = spellui.addDictionaryListToMenu(
      this._dictionariesMenu,
      null
    );
    this._setMenuItemVisibility("spell-dictionaries", enabled && numdicts > 1);

    this._doPopupItemEnabling(popupNode);
  }
  _doPopupItemDisabling() {
    if (this.spellCheckerUI) {
      this.spellCheckerUI.clearSuggestionsFromMenu();
      this.spellCheckerUI.clearDictionaryListFromMenu();
    }
  }
}
customElements.define("firefox-input-box-spell", FirefoxInputBoxSpell);
