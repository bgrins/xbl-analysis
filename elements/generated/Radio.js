class FirefoxRadio extends FirefoxBasetext {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:image class="radio-check" inherits="disabled,selected"></xul:image>
      <xul:hbox class="radio-label-box" align="center" flex="1">
        <xul:image class="radio-icon" inherits="src"></xul:image>
        <xul:label class="radio-label" inherits="text=label,accesskey,crop" flex="1"></xul:label>
      </xul:hbox>
    `;

    // Just clear out the parent's cached list of radio children
    var control = this.control;
    if (control)
      control._radioChildren = null;

    this.addEventListener("click", (event) => {
      if (!this.disabled)
        this.control.selectedItem = this;
    });

    this.addEventListener("mousedown", (event) => {
      if (!this.disabled)
        this.control.focusedItem = this;
    });

  }
  disconnectedCallback() {
    if (!this.control)
      return;

    var radioList = this.control._radioChildren;
    if (!radioList)
      return;
    for (var i = 0; i < radioList.length; ++i) {
      if (radioList[i] == this) {
        radioList.splice(i, 1);
        return;
      }
    }
  }

  set value(val) {
    this.setAttribute('value', val);
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  get selected() {
    return this.hasAttribute("selected");
  }

  get radioGroup() {
    return this.control
  }

  get control() {
    const XUL_NS = "http://www.mozilla.org/keymaster/" +
      "gatekeeper/there.is.only.xul";
    var parent = this.parentNode;
    while (parent) {
      if ((parent.namespaceURI == XUL_NS) &&
        (parent.localName == "radiogroup")) {
        return parent;
      }
      parent = parent.parentNode;
    }

    var group = this.getAttribute("group");
    if (!group) {
      return null;
    }

    parent = this.ownerDocument.getElementById(group);
    if (!parent ||
      (parent.namespaceURI != XUL_NS) ||
      (parent.localName != "radiogroup")) {
      parent = null;
    }
    return parent;
  }
}