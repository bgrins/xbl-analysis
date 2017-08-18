class FirefoxInputBox extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

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
    let comment = document.createComment("Creating firefox-input-box");
    this.prepend(comment);
  }
  disconnectedCallback() {}
  _doPopupItemEnabling(popupNode) {
    var children = popupNode.childNodes;
    for (var i = 0; i < children.length; i++) {
      var command = children[i].getAttribute("cmd");
      if (command) {
        var controller = document.commandDispatcher.getControllerForCommand(
          command
        );
        var enabled = controller.isCommandEnabled(command);
        if (enabled) children[i].removeAttribute("disabled");
        else children[i].setAttribute("disabled", "true");
      }
    }
  }
  _setMenuItemVisibility(anonid, visible) {
    document.getAnonymousElementByAttribute(
      this,
      "anonid",
      anonid
    ).hidden = !visible;
  }
  doCommand(command) {
    var controller = document.commandDispatcher.getControllerForCommand(
      command
    );
    controller.doCommand(command);
  }
}
customElements.define("firefox-input-box", FirefoxInputBox);
