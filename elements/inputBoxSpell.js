class XblInputBoxSpell extends XblInputBox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

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
    let name = document.createElement("span");
    name.textContent = "Creating xbl-input-box-spell ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-input-box-spell", XblInputBoxSpell);
