class XblInputBox extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
</children>
<menupopup anonid="input-box-contextmenu" class="textbox-contextmenu" onpopupshowing="var input =                                        this.parentNode.getElementsByAttribute('anonid', 'input')[0];                                      if (document.commandDispatcher.focusedElement != input)                                        input.focus();                                      this.parentNode._doPopupItemEnabling(this);" oncommand="var cmd = event.originalTarget.getAttribute('cmd'); if(cmd) { this.parentNode.doCommand(cmd); event.stopPropagation(); }">
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
</menupopup>`;
    let comment = document.createComment("Creating xbl-input-box");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-input-box", XblInputBox);
