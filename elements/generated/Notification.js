class XblNotification extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="notification-inner" flex="1" xbl:inherits="type">
<hbox anonid="details" align="center" flex="1" oncommand="this.parentNode.parentNode._doButtonCommand(event);">
<image anonid="messageImage" class="messageImage" xbl:inherits="src=image,type,value">
</image>
<description anonid="messageText" class="messageText" flex="1" xbl:inherits="xbl:text=label">
</description>
<spacer flex="1">
</spacer>
<children>
</children>
</hbox>
<toolbarbutton ondblclick="event.stopPropagation();" class="messageCloseButton close-icon tabbable" xbl:inherits="hidden=hideclose" tooltiptext="&closeNotification.tooltip;" oncommand="document.getBindingParent(this).dismiss();">
</toolbarbutton>
</hbox>`;
    let comment = document.createComment("Creating xbl-notification");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-notification", XblNotification);
