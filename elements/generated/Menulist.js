class FirefoxMenulist extends FirefoxMenulistBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:hbox class="menulist-label-box" flex="1">
        <xul:image class="menulist-icon" inherits="src=image,src"></xul:image>
        <xul:label class="menulist-label" inherits="value=label,crop,accesskey,highlightable" crop="right" flex="1"></xul:label>
        <xul:label class="menulist-highlightable-label" inherits="text=label,crop,accesskey,highlightable" crop="right" flex="1"></xul:label>
      </xul:hbox>
      <xul:dropmarker class="menulist-dropmarker" type="menu" inherits="disabled,open"></xul:dropmarker>
      <children includes="menupopup"></children>
    `;

    this.mInputField = null;
    this.mSelectedInternal = null;
    this.mAttributeObserver = null;
    this.menuBoxObject = this.boxObject;
    this.setInitialSelection();

    this._setupEventListeners();
  }

  set value(val) {
    // if the new value is null, we still need to remove the old value
    if (val == null)
      return this.selectedItem = val;

    var arr = null;
    var popup = this.menupopup;
    if (popup)
      arr = popup.getElementsByAttribute("value", val);

    if (arr && arr.item(0))
      this.selectedItem = arr[0];
    else {
      this.selectedItem = null;
      this.setAttribute("value", val);
    }

    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  get inputField() {
    return null;
  }

  set crop(val) {
    this.setAttribute('crop', val);
    return val;
  }

  get crop() {
    return this.getAttribute('crop');
  }

  set image(val) {
    this.setAttribute('image', val);
    return val;
  }

  get image() {
    return this.getAttribute('image');
  }

  get label() {
    return this.getAttribute('label');
  }

  set description(val) {
    this.setAttribute('description', val);
    return val;
  }

  get description() {
    return this.getAttribute('description');
  }

  set editable(val) {
    if (!val && this.editable) {
      // If we were focused and transition from editable to not editable,
      // focus the parent menulist so that the focus does not get stuck.
      if (this.inputField == document.activeElement)
        window.setTimeout(() => this.focus(), 0);
    }

    this.setAttribute("editable", val);
    return val;
  }

  get editable() {
    return this.getAttribute('editable') == 'true';
  }

  set open(val) {
    this.menuBoxObject.openMenu(val);
    return val;
  }

  get open() {
    return this.hasAttribute('open');
  }

  get itemCount() {
    return this.menupopup ? this.menupopup.childNodes.length : 0
  }

  get menupopup() {
    var popup = this.firstChild;
    while (popup && popup.localName != "menupopup")
      popup = popup.nextSibling;
    return popup;
  }

  set selectedIndex(val) {
    var popup = this.menupopup;
    if (popup && 0 <= val) {
      if (val < popup.childNodes.length)
        this.selectedItem = popup.childNodes[val];
    } else
      this.selectedItem = null;
    return val;
  }

  get selectedIndex() {
    // Quick and dirty. We won't deal with hierarchical menulists yet.
    if (!this.selectedItem ||
      !this.mSelectedInternal.parentNode ||
      this.mSelectedInternal.parentNode.parentNode != this)
      return -1;

    var children = this.mSelectedInternal.parentNode.childNodes;
    var i = children.length;
    while (i--)
      if (children[i] == this.mSelectedInternal)
        break;

    return i;
  }

  set selectedItem(val) {
    var oldval = this.mSelectedInternal;
    if (oldval == val)
      return val;

    if (val && !this.contains(val))
      return val;

    if (oldval) {
      oldval.removeAttribute("selected");
      this.mAttributeObserver.disconnect();
    }

    this.mSelectedInternal = val;
    let attributeFilter = ["value", "label", "image", "description"];
    if (val) {
      val.setAttribute("selected", "true");
      for (let attr of attributeFilter) {
        if (val.hasAttribute(attr)) {
          this.setAttribute(attr, val.getAttribute(attr));
        } else {
          this.removeAttribute(attr);
        }
      }

      this.mAttributeObserver = new MutationObserver(this.handleMutation.bind(this));
      this.mAttributeObserver.observe(val, { attributeFilter });
    } else {
      for (let attr of attributeFilter) {
        this.removeAttribute(attr);
      }
    }

    var event = document.createEvent("Events");
    event.initEvent("select", true, true);
    this.dispatchEvent(event);

    event = document.createEvent("Events");
    event.initEvent("ValueChange", true, true);
    this.dispatchEvent(event);

    return val;
  }

  get selectedItem() {
    return this.mSelectedInternal;
  }
  setInitialSelection() {
    var popup = this.menupopup;
    if (popup) {
      var arr = popup.getElementsByAttribute("selected", "true");

      var editable = this.editable;
      var value = this.value;
      if (!arr.item(0) && value)
        arr = popup.getElementsByAttribute(editable ? "label" : "value", value);

      if (arr.item(0))
        this.selectedItem = arr[0];
      else if (!editable)
        this.selectedIndex = 0;
    }
  }
  contains(item) {
    if (!item)
      return false;

    var parent = item.parentNode;
    return (parent && parent.parentNode == this);
  }
  handleMutation(aRecords) {
    for (let record of aRecords) {
      let t = record.target;
      if (t == this.mSelectedInternal) {
        let attrName = record.attributeName;
        switch (attrName) {
          case "value":
          case "label":
          case "image":
          case "description":
            if (t.hasAttribute(attrName)) {
              this.setAttribute(attrName, t.getAttribute(attrName));
            } else {
              this.removeAttribute(attrName);
            }
        }
      }
    }
  }
  getIndexOfItem(item) {
    var popup = this.menupopup;
    if (popup) {
      var children = popup.childNodes;
      var i = children.length;
      while (i--)
        if (children[i] == item)
          return i;
    }
    return -1;
  }
  getItemAtIndex(index) {
    var popup = this.menupopup;
    if (popup) {
      var children = popup.childNodes;
      if (index >= 0 && index < children.length)
        return children[index];
    }
    return null;
  }
  appendItem(label, value, description) {
    const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var popup = this.menupopup ||
      this.appendChild(document.createElementNS(XULNS, "menupopup"));
    var item = document.createElementNS(XULNS, "menuitem");
    item.setAttribute("label", label);
    item.setAttribute("value", value);
    if (description)
      item.setAttribute("description", description);

    popup.appendChild(item);
    return item;
  }
  insertItemAt(index, label, value, description) {
    const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var popup = this.menupopup ||
      this.appendChild(document.createElementNS(XULNS, "menupopup"));
    var item = document.createElementNS(XULNS, "menuitem");
    item.setAttribute("label", label);
    item.setAttribute("value", value);
    if (description)
      item.setAttribute("description", description);

    if (index >= 0 && index < popup.childNodes.length)
      popup.insertBefore(item, popup.childNodes[index]);
    else
      popup.appendChild(item);
    return item;
  }
  removeItemAt(index) {
    var popup = this.menupopup;
    if (popup && 0 <= index && index < popup.childNodes.length) {
      var remove = popup.childNodes[index];
      popup.removeChild(remove);
      return remove;
    }
    return null;
  }
  removeAllItems() {
    this.selectedItem = null;
    var popup = this.menupopup;
    if (popup)
      this.removeChild(popup);
  }
  disconnectedCallback() {
    if (this.mAttributeObserver) {
      this.mAttributeObserver.disconnect();
    }
  }

  _setupEventListeners() {

    this.addEventListener("command", (event) => { if (event.target.parentNode.parentNode == this) this.selectedItem = event.target; }, true);

    this.addEventListener("popupshowing", (event) => {
      if (event.target.parentNode == this) {
        this.menuBoxObject.activeChild = null;
        if (this.selectedItem)
          // Not ready for auto-setting the active child in hierarchies yet.
          // For now, only do this when the outermost menupopup opens.
          this.menuBoxObject.activeChild = this.mSelectedInternal;
      }
    });

    this.addEventListener("keypress", (event) => {
      if (!event.defaultPrevented &&
        (event.keyCode == KeyEvent.DOM_VK_UP ||
          event.keyCode == KeyEvent.DOM_VK_DOWN ||
          event.keyCode == KeyEvent.DOM_VK_PAGE_UP ||
          event.keyCode == KeyEvent.DOM_VK_PAGE_DOWN ||
          event.keyCode == KeyEvent.DOM_VK_HOME ||
          event.keyCode == KeyEvent.DOM_VK_END ||
          event.keyCode == KeyEvent.DOM_VK_BACK_SPACE ||
          event.charCode > 0)) {
        // Moving relative to an item: start from the currently selected item
        this.menuBoxObject.activeChild = this.mSelectedInternal;
        if (this.menuBoxObject.handleKeyPress(event)) {
          this.menuBoxObject.activeChild.doCommand();
          event.preventDefault();
        }
      }
    });

  }
}