class XblInputBoxSpell extends XblInputBox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<menupopup anonid="input-box-contextmenu" class="textbox-contextmenu" onpopupshowing="var input =                                        this.parentNode.getElementsByAttribute('anonid', 'input')[0];                                      if (document.commandDispatcher.focusedElement != input)                                        input.focus();                                      this.parentNode._doPopupItemEnablingSpell(this);" onpopuphiding="this.parentNode._doPopupItemDisabling(this);" oncommand="var cmd = event.originalTarget.getAttribute('cmd'); if(cmd) { this.parentNode.doCommand(cmd); event.stopPropagation(); }">
<menuitem label="&spellNoSuggestions.label;" anonid="spell-no-suggestions" disabled="true">
</menuitem>
<menuitem label="&spellAddToDictionary.label;" accesskey="&spellAddToDictionary.accesskey;" anonid="spell-add-to-dictionary" oncommand="this.parentNode.parentNode.spellCheckerUI.addToDictionary();">
</menuitem>
<menuitem label="&spellUndoAddToDictionary.label;" accesskey="&spellUndoAddToDictionary.accesskey;" anonid="spell-undo-add-to-dictionary" oncommand="this.parentNode.parentNode.spellCheckerUI.undoAddToDictionary();">
</menuitem>
<menuseparator anonid="spell-suggestions-separator">
</menuseparator>
<menuitem label="&undoCmd.label;" accesskey="&undoCmd.accesskey;" cmd="cmd_undo">
</menuitem>
<menuseparator>
</menuseparator>
<menuitem label="&cutCmd.label;" accesskey="&cutCmd.accesskey;" cmd="cmd_cut">
</menuitem>
<menuitem label="&copyCmd.label;" accesskey="&copyCmd.accesskey;" cmd="cmd_copy">
</menuitem>
<menuitem label="&pasteCmd.label;" accesskey="&pasteCmd.accesskey;" cmd="cmd_paste">
</menuitem>
<menuitem label="&deleteCmd.label;" accesskey="&deleteCmd.accesskey;" cmd="cmd_delete">
</menuitem>
<menuseparator>
</menuseparator>
<menuitem label="&selectAllCmd.label;" accesskey="&selectAllCmd.accesskey;" cmd="cmd_selectAll">
</menuitem>
<menuseparator anonid="spell-check-separator">
</menuseparator>
<menuitem label="&spellCheckToggle.label;" type="checkbox" accesskey="&spellCheckToggle.accesskey;" anonid="spell-check-enabled" oncommand="this.parentNode.parentNode.spellCheckerUI.toggleEnabled();">
</menuitem>
<menu label="&spellDictionaries.label;" accesskey="&spellDictionaries.accesskey;" anonid="spell-dictionaries">
<menupopup anonid="spell-dictionaries-menu" onpopupshowing="event.stopPropagation();" onpopuphiding="event.stopPropagation();">
</menupopup>
</menu>
</menupopup>`;
    let comment = document.createComment("Creating xbl-input-box-spell");
    this.prepend(comment);
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
customElements.define("xbl-input-box-spell", XblInputBoxSpell);
