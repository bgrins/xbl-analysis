class XblButtonBase extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-button-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set type(val) {
    this.setAttribute("type", val);
    return val;
  }

  get type() {
    return this.getAttribute("type");
  }

  set dlgType(val) {
    this.setAttribute("dlgtype", val);
    return val;
  }

  get dlgType() {
    return this.getAttribute("dlgtype");
  }

  set group(val) {
    this.setAttribute("group", val);
    return val;
  }

  get group() {
    return this.getAttribute("group");
  }

  get open() {
    return this.hasAttribute("open");
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  set autoCheck(val) {
    this.setAttribute("autoCheck", val);
    return val;
  }

  get autoCheck() {
    return this.getAttribute("autoCheck") == "true";
  }
  filterButtons(node) {
    // if the node isn't visible, don't descend into it.
    var cs = node.ownerGlobal.getComputedStyle(node);
    if (cs.visibility != "visible" || cs.display == "none") {
      return NodeFilter.FILTER_REJECT;
    }
    // but it may be a popup element, in which case we look at "state"...
    if (cs.display == "-moz-popup" && node.state != "open") {
      return NodeFilter.FILTER_REJECT;
    }
    // OK - the node seems visible, so it is a candidate.
    if (node.localName == "button" && node.accessKey && !node.disabled)
      return NodeFilter.FILTER_ACCEPT;
    return NodeFilter.FILTER_SKIP;
  }
  fireAccessKeyButton(aSubtree, aAccessKeyLower) {
    var iterator = aSubtree.ownerDocument.createTreeWalker(
      aSubtree,
      NodeFilter.SHOW_ELEMENT,
      this.filterButtons
    );
    while (iterator.nextNode()) {
      var test = iterator.currentNode;
      if (
        test.accessKey.toLowerCase() == aAccessKeyLower &&
        !test.disabled &&
        !test.collapsed &&
        !test.hidden
      ) {
        test.focus();
        test.click();
        return true;
      }
    }
    return false;
  }
  _handleClick() {
    if (!this.disabled && (this.autoCheck || !this.hasAttribute("autoCheck"))) {
      if (this.type == "checkbox") {
        this.checked = !this.checked;
      } else if (this.type == "radio") {
        this.checked = true;
      }
    }
  }
}
customElements.define("xbl-button-base", XblButtonBase);
