class FirefoxNotification extends XULElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <xul:hbox class="notification-inner" flex="1" inherits="type">
        <xul:hbox anonid="details" align="center" flex="1" oncommand="this.parentNode.parentNode._doButtonCommand(event);">
          <xul:image anonid="messageImage" class="messageImage" inherits="src=image,type,value"></xul:image>
          <xul:description anonid="messageText" class="messageText" flex="1" inherits="text=label"></xul:description>
          <xul:spacer flex="1"></xul:spacer>
          <children></children>
        </xul:hbox>
        <xul:toolbarbutton ondblclick="event.stopPropagation();" class="messageCloseButton close-icon tabbable" inherits="hidden=hideclose" tooltiptext="FROM-DTD-closeNotification-tooltip" oncommand="document.getBindingParent(this).dismiss();"></xul:toolbarbutton>
      </xul:hbox>
    `;
    Object.defineProperty(this, "timeout", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.timeout;
        return (this.timeout = 0);
      },
      set(val) {
        delete this.timeout;
        return (this.timeout = val);
      }
    });
  }

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

  get control() {
    var parent = this.parentNode;
    while (parent) {
      if (parent.localName == "notificationbox") return parent;
      parent = parent.parentNode;
    }
    return null;
  }
  dismiss() {
    if (this.eventCallback) {
      this.eventCallback("dismissed");
    }
    this.close();
  }
  close() {
    var control = this.control;
    if (control) control.removeNotification(this);
    else this.hidden = true;
  }
  _doButtonCommand(aEvent) {
    if (!("buttonInfo" in aEvent.target)) return;

    var button = aEvent.target.buttonInfo;
    if (button.popup) {
      document
        .getElementById(button.popup)
        .openPopup(
          aEvent.originalTarget,
          "after_start",
          0,
          0,
          false,
          false,
          aEvent
        );
      aEvent.stopPropagation();
    } else {
      var callback = button.callback;
      if (callback) {
        var result = callback(this, button, aEvent.target);
        if (!result) this.close();
        aEvent.stopPropagation();
      }
    }
  }
}
customElements.define("firefox-notification", FirefoxNotification);
