class FirefoxLabelControl extends FirefoxTextLabel {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children></children>
      <html:span anonid="accessKeyParens"></html:span>
    `;
    this.mUnderlineAccesskey = !/Mac/.test(navigator.platform);

    this.mInsertSeparator = "";

    this.mAlwaysAppendAccessKey = false;

    this.formatAccessKey(true);

    this._setupEventListeners();
  }

  set accessKey(val) {
    // If this label already has an accesskey attribute store it here as well
    if (this.hasAttribute("accesskey")) {
      this.setAttribute("accesskey", val);
    }
    var control = this.labeledControlElement;
    if (control) {
      control.setAttribute("accesskey", val);
    }
    this.formatAccessKey(false);
    return val;
  }

  get accessKey() {
    var accessKey = null;
    var labeledEl = this.labeledControlElement;
    if (labeledEl) {
      accessKey = labeledEl.getAttribute("accesskey");
    }
    if (!accessKey) {
      accessKey = this.getAttribute("accesskey");
    }
    return accessKey ? accessKey[0] : null;
  }

  get labeledControlElement() {
    var control = this.control;
    return control ? document.getElementById(control) : null;
  }

  set control(val) {
    var control = this.labeledControlElement;
    if (control) {
      control.labelElement = null; // No longer pointed to be this label
    }
    this.setAttribute("control", val);
    this.formatAccessKey(false);
    return val;
  }

  get control() {
    return this.getAttribute('control');
  }

  formatAccessKey(firstTime) {
    var control = this.labeledControlElement;
    if (!control) {
      var bindingParent = document.getBindingParent(this);
      if (bindingParent instanceof Ci.nsIDOMXULLabeledControlElement) {
        control = bindingParent; // For controls that make the <label> an anon child
      }
    }
    if (control) {
      control.labelElement = this;
    }

    var accessKey = this.accessKey;
    // No need to remove existing formatting the first time.
    if (firstTime && !accessKey)
      return;

    if (this.mInsertSeparator === undefined) {
      try {
        var prefs = Cc["@mozilla.org/preferences-service;1"].
        getService(Ci.nsIPrefBranch);
        this.mUnderlineAccesskey = (prefs.getIntPref("ui.key.menuAccessKey") != 0);

        const nsIPrefLocalizedString =
          Ci.nsIPrefLocalizedString;

        const prefNameInsertSeparator =
          "intl.menuitems.insertseparatorbeforeaccesskeys";
        const prefNameAlwaysAppendAccessKey =
          "intl.menuitems.alwaysappendaccesskeys";

        var val = prefs.getComplexValue(prefNameInsertSeparator,
          nsIPrefLocalizedString).data;
        this.mInsertSeparator = (val == "true");

        val = prefs.getComplexValue(prefNameAlwaysAppendAccessKey,
          nsIPrefLocalizedString).data;
        this.mAlwaysAppendAccessKey = (val == "true");
      } catch (e) {
        this.mInsertSeparator = true;
      }
    }

    if (!this.mUnderlineAccesskey)
      return;

    var afterLabel = document.getAnonymousElementByAttribute(this, "anonid", "accessKeyParens");
    afterLabel.textContent = "";

    var oldAccessKey = this.getElementsByAttribute("class", "accesskey").item(0);
    if (oldAccessKey) { // Clear old accesskey
      this.mergeElement(oldAccessKey);
    }

    var oldHiddenSpan =
      this.getElementsByAttribute("class", "hiddenColon").item(0);
    if (oldHiddenSpan) {
      this.mergeElement(oldHiddenSpan);
    }

    var labelText = this.textContent;
    if (!accessKey || !labelText || !control) {
      return;
    }
    var accessKeyIndex = -1;
    if (!this.mAlwaysAppendAccessKey) {
      accessKeyIndex = labelText.indexOf(accessKey);
      if (accessKeyIndex < 0) { // Try again in upper case
        accessKeyIndex =
          labelText.toUpperCase().indexOf(accessKey.toUpperCase());
      }
    }

    const HTML_NS = "http://www.w3.org/1999/xhtml";
    var span = document.createElementNS(HTML_NS, "span");
    span.className = "accesskey";

    // Note that if you change the following code, see the comment of
    // nsTextBoxFrame::UpdateAccessTitle.

    // If accesskey is not in string, append in parentheses
    if (accessKeyIndex < 0) {
      // If end is colon, we should insert before colon.
      // i.e., "label:" -> "label(X):"
      var colonHidden = false;
      if (/:$/.test(labelText)) {
        labelText = labelText.slice(0, -1);
        var hiddenSpan = document.createElementNS(HTML_NS, "span");
        hiddenSpan.className = "hiddenColon";
        hiddenSpan.style.display = "none";
        // Hide the last colon by using span element.
        // I.e., label<span style="display:none;">:</span>
        this.wrapChar(hiddenSpan, labelText.length);
        colonHidden = true;
      }
      // If end is space(U+20),
      // we should not add space before parentheses.
      var endIsSpace = false;
      if (/ $/.test(labelText)) {
        endIsSpace = true;
      }
      if (this.mInsertSeparator && !endIsSpace)
        afterLabel.textContent = " (";
      else
        afterLabel.textContent = "(";
      span.textContent = accessKey.toUpperCase();
      afterLabel.appendChild(span);
      if (!colonHidden)
        afterLabel.appendChild(document.createTextNode(")"));
      else
        afterLabel.appendChild(document.createTextNode("):"));
      return;
    }
    this.wrapChar(span, accessKeyIndex);
  }

  wrapChar(element, index) {
    var treeWalker = document.createTreeWalker(this,
      NodeFilter.SHOW_TEXT,
      null);
    var node = treeWalker.nextNode();
    while (index >= node.length) {
      index -= node.length;
      node = treeWalker.nextNode();
    }
    if (index) {
      node = node.splitText(index);
    }
    node.parentNode.insertBefore(element, node);
    if (node.length > 1) {
      node.splitText(1);
    }
    element.appendChild(node);
  }

  mergeElement(element) {
    if (element.previousSibling instanceof Text) {
      element.previousSibling.appendData(element.textContent);
    } else {
      element.parentNode.insertBefore(element.firstChild, element);
    }
    element.remove();
  }

  _setupEventListeners() {
    this.addEventListener("click", (event) => {
      if (this.disabled) return;
      var controlElement = this.labeledControlElement;
      if (controlElement)
        controlElement.focus();
    });

  }
}