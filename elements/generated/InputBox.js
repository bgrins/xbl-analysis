class InputBox extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <children></children>
      <menupopup anonid="input-box-contextmenu" class="textbox-contextmenu" onpopupshowing="var input =
                                       this.parentNode.getElementsByAttribute('anonid', 'input')[0];
                                     if (document.commandDispatcher.focusedElement != input)
                                       input.focus();
                                     this.parentNode._doPopupItemEnabling(this);" oncommand="var cmd = event.originalTarget.getAttribute('cmd'); if(cmd) { this.parentNode.doCommand(cmd); event.stopPropagation(); }">
        <menuitem label="FROM-DTD.undoCmd.label;" accesskey="FROM-DTD.undoCmd.accesskey;" cmd="cmd_undo"></menuitem>
        <menuseparator></menuseparator>
        <menuitem label="FROM-DTD.cutCmd.label;" accesskey="FROM-DTD.cutCmd.accesskey;" cmd="cmd_cut"></menuitem>
        <menuitem label="FROM-DTD.copyCmd.label;" accesskey="FROM-DTD.copyCmd.accesskey;" cmd="cmd_copy"></menuitem>
        <menuitem label="FROM-DTD.pasteCmd.label;" accesskey="FROM-DTD.pasteCmd.accesskey;" cmd="cmd_paste"></menuitem>
        <menuitem label="FROM-DTD.deleteCmd.label;" accesskey="FROM-DTD.deleteCmd.accesskey;" cmd="cmd_delete"></menuitem>
        <menuseparator></menuseparator>
        <menuitem label="FROM-DTD.selectAllCmd.label;" accesskey="FROM-DTD.selectAllCmd.accesskey;" cmd="cmd_selectAll"></menuitem>
      </menupopup>
    `));

    this._setupEventListeners();
  }

  _doPopupItemEnabling(popupNode) {
    var children = popupNode.childNodes;
    for (var i = 0; i < children.length; i++) {
      var command = children[i].getAttribute("cmd");
      if (command) {
        var controller = document.commandDispatcher.getControllerForCommand(command);
        var enabled = controller.isCommandEnabled(command);
        if (enabled)
          children[i].removeAttribute("disabled");
        else
          children[i].setAttribute("disabled", "true");
      }
    }
  }

  _setMenuItemVisibility(anonid, visible) {
    document.getAnonymousElementByAttribute(this, "anonid", anonid).
    hidden = !visible;
  }

  doCommand(command) {
    var controller = document.commandDispatcher.getControllerForCommand(command);
    controller.doCommand(command);
  }

  _setupEventListeners() {

  }
}