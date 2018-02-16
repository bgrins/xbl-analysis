class FirefoxButtonBase extends FirefoxBasetext {
  connectedCallback() {
    super.connectedCallback()

    this.setupHandlers();
  }

  set type(val) {
    this.setAttribute('type', val);
    return val;
  }

  get type() {
    return this.getAttribute('type');
  }

  set dlgType(val) {
    this.setAttribute('dlgtype', val);
    return val;
  }

  get dlgType() {
    return this.getAttribute('dlgtype');
  }

  set group(val) {
    this.setAttribute('group', val);
    return val;
  }

  get group() {
    return this.getAttribute('group');
  }

  set open(val) {
    if (this.boxObject instanceof MenuBoxObject) {
      this.boxObject.openMenu(val);
    } else if (val) {
      // Fall back to just setting the attribute
      this.setAttribute("open", "true");
    } else {
      this.removeAttribute("open");
    }
    return val;
  }

  get open() {
    return this.hasAttribute('open');
  }

  set checked(val) {
    if (this.type == "checkbox") {
      this.checkState = val ? 1 : 0;
    } else if (this.type == "radio" && val) {
      var sibs = this.parentNode.getElementsByAttribute("group", this.group);
      for (var i = 0; i < sibs.length; ++i)
        sibs[i].removeAttribute("checked");
    }

    if (val)
      this.setAttribute("checked", "true");
    else
      this.removeAttribute("checked");

    return val;
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checkState(val) {
    this.setAttribute("checkState", val);
    return val;
  }

  get checkState() {
    var state = this.getAttribute("checkState");
    if (state == "")
      return this.checked ? 1 : 0;
    if (state == "0")
      return 0;
    if (state == "2")
      return 2;
    return 1;
  }

  set autoCheck(val) {
    this.setAttribute('autoCheck', val);
    return val;
  }

  get autoCheck() {
    return this.getAttribute('autoCheck') == 'true';
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
    var iterator = aSubtree.ownerDocument.createTreeWalker(aSubtree,
      NodeFilter.SHOW_ELEMENT,
      this.filterButtons);
    while (iterator.nextNode()) {
      var test = iterator.currentNode;
      if (test.accessKey.toLowerCase() == aAccessKeyLower &&
        !test.disabled && !test.collapsed && !test.hidden) {
        test.focus();
        test.click();
        return true;
      }
    }
    return false;
  }
  _handleClick() {
    if (!this.disabled &&
      (this.autoCheck || !this.hasAttribute("autoCheck"))) {

      if (this.type == "checkbox") {
        this.checked = !this.checked;
      } else if (this.type == "radio") {
        this.checked = true;
      }
    }
  }

  setupHandlers() {

    this.addEventListener("click", (event) => { this._handleClick(); });

    this.addEventListener("keypress", (event) => {
      this._handleClick();
      // Prevent page from scrolling on the space key.
      event.preventDefault();
    });

    this.addEventListener("keypress", (event) => {
      if (this.boxObject instanceof MenuBoxObject) {
        if (this.open)
          return;
      } else {
        if (event.keyCode == KeyEvent.DOM_VK_UP ||
          (event.keyCode == KeyEvent.DOM_VK_LEFT &&
            document.defaultView.getComputedStyle(this.parentNode)
            .direction == "ltr") ||
          (event.keyCode == KeyEvent.DOM_VK_RIGHT &&
            document.defaultView.getComputedStyle(this.parentNode)
            .direction == "rtl")) {
          event.preventDefault();
          window.document.commandDispatcher.rewindFocus();
          return;
        }

        if (event.keyCode == KeyEvent.DOM_VK_DOWN ||
          (event.keyCode == KeyEvent.DOM_VK_RIGHT &&
            document.defaultView.getComputedStyle(this.parentNode)
            .direction == "ltr") ||
          (event.keyCode == KeyEvent.DOM_VK_LEFT &&
            document.defaultView.getComputedStyle(this.parentNode)
            .direction == "rtl")) {
          event.preventDefault();
          window.document.commandDispatcher.advanceFocus();
          return;
        }
      }

      if (event.keyCode || event.charCode <= 32 || event.altKey ||
        event.ctrlKey || event.metaKey)
        return; // No printable char pressed, not a potential accesskey

      // Possible accesskey pressed
      var charPressedLower = String.fromCharCode(event.charCode).toLowerCase();

      // If the accesskey of the current button is pressed, just activate it
      if (this.accessKey.toLowerCase() == charPressedLower) {
        this.click();
        return;
      }

      // Search for accesskey in the list of buttons for this doc and each subdoc
      // Get the buttons for the main document and all sub-frames
      for (var frameCount = -1; frameCount < window.top.frames.length; frameCount++) {
        var doc = (frameCount == -1) ? window.top.document :
          window.top.frames[frameCount].document;
        if (this.fireAccessKeyButton(doc.documentElement, charPressedLower))
          return;
      }

      // Test anonymous buttons
      var dlg = window.top.document;
      var buttonBox = dlg.getAnonymousElementByAttribute(dlg.documentElement,
        "anonid", "buttons");
      if (buttonBox)
        this.fireAccessKeyButton(buttonBox, charPressedLower);
    });

  }
}