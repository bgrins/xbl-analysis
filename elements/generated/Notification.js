class XblNotification extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

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

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  set value(val) {
    this.setAttribute("value", val);
    return val;
  }

  get value() {
    return this.getAttribute("value");
  }

  set image(val) {
    this.setAttribute("image", val);
    return val;
  }

  get image() {
    return this.getAttribute("image");
  }

  set type(val) {
    this.setAttribute("type", val);
    return val;
  }

  get type() {
    return this.getAttribute("type");
  }

  set priority(val) {
    this.setAttribute("priority", val);
    return val;
  }

  get priority() {
    return parseInt(this.getAttribute("priority")) || 0;
  }

  set persistence(val) {
    this.setAttribute("persistence", val);
    return val;
  }

  get persistence() {
    return parseInt(this.getAttribute("persistence")) || 0;
  }
}
customElements.define("xbl-notification", XblNotification);
