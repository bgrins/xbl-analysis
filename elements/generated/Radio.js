class FirefoxRadio extends FirefoxControlItem {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="radio-check" inherits="disabled,selected">
</image>
<hbox class="radio-label-box" align="center" flex="1">
<image class="radio-icon" inherits="src">
</image>
<firefox-text-label class="radio-label" inherits="text=label,accesskey,crop" flex="1">
</firefox-text-label>
</hbox>`;
    let comment = document.createComment("Creating firefox-radio");
    this.prepend(comment);

    try {
      // Just clear out the parent's cached list of radio children
      var control = this.control;
      if (control) control._radioChildren = null;
    } catch (e) {}
  }
  disconnectedCallback() {
    try {
      if (!this.control) return;

      var radioList = this.control._radioChildren;
      if (!radioList) return;
      for (var i = 0; i < radioList.length; ++i) {
        if (radioList[i] == this) {
          radioList.splice(i, 1);
          return;
        }
      }
    } catch (e) {}
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  get radioGroup() {
    return this.control;
  }

  get control() {
    const XUL_NS =
      "http://www.mozilla.org/keymaster/" + "gatekeeper/there.is.only.xul";
    var parent = this.parentNode;
    while (parent) {
      if (parent.namespaceURI == XUL_NS && parent.localName == "radiogroup") {
        return parent;
      }
      parent = parent.parentNode;
    }

    var group = this.getAttribute("group");
    if (!group) {
      return null;
    }

    parent = this.ownerDocument.getElementById(group);
    if (
      !parent ||
      parent.namespaceURI != XUL_NS ||
      parent.localName != "radiogroup"
    ) {
      parent = null;
    }
    return parent;
  }
}
customElements.define("firefox-radio", FirefoxRadio);
