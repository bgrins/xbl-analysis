class Radiogroup extends Basecontrol {
  connectedCallback() {
    super.connectedCallback()

    this._radioChildren = null;

    if (this.getAttribute("disabled") == "true")
      this.disabled = true;

    var children = this._getRadioChildren();
    var length = children.length;
    for (var i = 0; i < length; i++) {
      if (children[i].getAttribute("selected") == "true") {
        this.selectedIndex = i;
        return;
      }
    }

    var value = this.value;
    if (value)
      this.value = value;
    else
      this.selectedIndex = 0;

    this._setupEventListeners();
  }

  set value(val) {
    this.setAttribute("value", val);
    var children = this._getRadioChildren();
    for (var i = 0; i < children.length; i++) {
      if (String(children[i].value) == String(val)) {
        this.selectedItem = children[i];
        break;
      }
    }
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  set disabled(val) {
    if (val)
      this.setAttribute("disabled", "true");
    else
      this.removeAttribute("disabled");
    var children = this._getRadioChildren();
    for (var i = 0; i < children.length; ++i) {
      children[i].disabled = val;
    }
    return val;
  }

  get disabled() {
    if (this.getAttribute("disabled") == "true")
      return true;
    var children = this._getRadioChildren();
    for (var i = 0; i < children.length; ++i) {
      if (!children[i].hidden && !children[i].collapsed && !children[i].disabled)
        return false;
    }
    return true;
  }

  get itemCount() {
    return this._getRadioChildren().length
  }

  set selectedIndex(val) {
    this.selectedItem = this._getRadioChildren()[val];
    return val;
  }

  get selectedIndex() {
    var children = this._getRadioChildren();
    for (var i = 0; i < children.length; ++i) {
      if (children[i].selected)
        return i;
    }
    return -1;
  }

  set selectedItem(val) {
    var focused = this.getAttribute("focused") == "true";
    var alreadySelected = false;

    if (val) {
      alreadySelected = val.getAttribute("selected") == "true";
      val.setAttribute("focused", focused);
      val.setAttribute("selected", "true");
      this.setAttribute("value", val.value);
    } else {
      this.removeAttribute("value");
    }

    // uncheck all other group nodes
    var children = this._getRadioChildren();
    var previousItem = null;
    for (var i = 0; i < children.length; ++i) {
      if (children[i] != val) {
        if (children[i].getAttribute("selected") == "true")
          previousItem = children[i];

        children[i].removeAttribute("selected");
        children[i].removeAttribute("focused");
      }
    }

    var event = document.createEvent("Events");
    event.initEvent("select", false, true);
    this.dispatchEvent(event);

    if (!alreadySelected && focused) {
      // Only report if actual change
      var myEvent;
      if (val) {
        myEvent = document.createEvent("Events");
        myEvent.initEvent("RadioStateChange", true, true);
        val.dispatchEvent(myEvent);
      }

      if (previousItem) {
        myEvent = document.createEvent("Events");
        myEvent.initEvent("RadioStateChange", true, true);
        previousItem.dispatchEvent(myEvent);
      }
    }

    return val;
  }

  get selectedItem() {
    var children = this._getRadioChildren();
    for (var i = 0; i < children.length; ++i) {
      if (children[i].selected)
        return children[i];
    }
    return null;
  }

  set focusedItem(val) {
    if (val) val.setAttribute("focused", "true");

    // unfocus all other group nodes
    var children = this._getRadioChildren();
    for (var i = 0; i < children.length; ++i) {
      if (children[i] != val)
        children[i].removeAttribute("focused");
    }
    return val;
  }

  get focusedItem() {
    var children = this._getRadioChildren();
    for (var i = 0; i < children.length; ++i) {
      if (children[i].getAttribute("focused") == "true")
        return children[i];
    }
    return null;
  }

  checkAdjacentElement(aNextFlag) {
    var currentElement = this.focusedItem || this.selectedItem;
    var i;
    var children = this._getRadioChildren();
    for (i = 0; i < children.length; ++i) {
      if (children[i] == currentElement)
        break;
    }
    var index = i;

    if (aNextFlag) {
      do {
        if (++i == children.length)
          i = 0;
        if (i == index)
          break;
      }
      while (children[i].hidden || children[i].collapsed || children[i].disabled);
      // XXX check for display/visibility props too

      this.selectedItem = children[i];
      children[i].doCommand();
    } else {
      do {
        if (i == 0)
          i = children.length;
        if (--i == index)
          break;
      }
      while (children[i].hidden || children[i].collapsed || children[i].disabled);
      // XXX check for display/visibility props too

      this.selectedItem = children[i];
      children[i].doCommand();
    }
  }

  _getRadioChildren() {
    if (this._radioChildren)
      return this._radioChildren;

    var radioChildren = [];
    var doc = this.ownerDocument;

    if (this.hasChildNodes()) {
      // Don't store the collected child nodes immediately,
      // collecting the child nodes could trigger constructors
      // which would blow away our list.

      var iterator = doc.createTreeWalker(this,
        NodeFilter.SHOW_ELEMENT,
        this._filterRadioGroup);
      while (iterator.nextNode())
        radioChildren.push(iterator.currentNode);
      return this._radioChildren = radioChildren;
    }

    // We don't have child nodes.
    const XUL_NS = "http://www.mozilla.org/keymaster/" +
      "gatekeeper/there.is.only.xul";
    var elems = doc.getElementsByAttribute("group", this.id);
    for (var i = 0; i < elems.length; i++) {
      if ((elems[i].namespaceURI == XUL_NS) &&
        (elems[i].localName == "radio")) {
        radioChildren.push(elems[i]);
      }
    }
    return this._radioChildren = radioChildren;
  }

  _filterRadioGroup(node) {
    switch (node.localName) {
      case "radio":
        return NodeFilter.FILTER_ACCEPT;
      case "template":
      case "radiogroup":
        return NodeFilter.FILTER_REJECT;
      default:
        return NodeFilter.FILTER_SKIP;
    }
  }

  getIndexOfItem(item) {
    return this._getRadioChildren().indexOf(item);
  }

  getItemAtIndex(index) {
    var children = this._getRadioChildren();
    return (index >= 0 && index < children.length) ? children[index] : null;
  }

  appendItem(label, value) {
    var radio = document.createXULElement("radio");
    radio.setAttribute("label", label);
    radio.setAttribute("value", value);
    this.appendChild(radio);
    this._radioChildren = null;
    return radio;
  }

  _setupEventListeners() {
    this.addEventListener("mousedown", (event) => {
      if (this.disabled)
        event.preventDefault();
    });

    /**
     * keyboard navigation  Here's how keyboard navigation works in radio groups on Windows:
     * The group takes 'focus'
     * The user is then free to navigate around inside the group
     * using the arrow keys. Accessing previous or following radio buttons
     * is done solely through the arrow keys and not the tab button. Tab
     * takes you to the next widget in the tab order
     */
    this.addEventListener("keypress", (event) => {
      this.selectedItem = this.focusedItem;
      this.selectedItem.doCommand();
      // Prevent page from scrolling on the space key.
      event.preventDefault();
    });

    this.addEventListener("keypress", (event) => {
      this.checkAdjacentElement(false);
      event.stopPropagation();
      event.preventDefault();
    });

    this.addEventListener("keypress", (event) => {
      // left arrow goes back when we are ltr, forward when we are rtl
      this.checkAdjacentElement(document.defaultView.getComputedStyle(
        this).direction == "rtl");
      event.stopPropagation();
      event.preventDefault();
    });

    this.addEventListener("keypress", (event) => {
      this.checkAdjacentElement(true);
      event.stopPropagation();
      event.preventDefault();
    });

    this.addEventListener("keypress", (event) => {
      // right arrow goes forward when we are ltr, back when we are rtl
      this.checkAdjacentElement(document.defaultView.getComputedStyle(
        this).direction == "ltr");
      event.stopPropagation();
      event.preventDefault();
    });

    /**
     * set a focused attribute on the selected item when the group
     * receives focus so that we can style it as if it were focused even though
     * it is not (Windows platform behaviour is for the group to receive focus,
     * not the item
     */
    this.addEventListener("focus", (event) => {
      this.setAttribute("focused", "true");
      if (this.focusedItem)
        return;

      var val = this.selectedItem;
      if (!val || val.disabled || val.hidden || val.collapsed) {
        var children = this._getRadioChildren();
        for (var i = 0; i < children.length; ++i) {
          if (!children[i].hidden && !children[i].collapsed && !children[i].disabled) {
            val = children[i];
            break;
          }
        }
      }
      this.focusedItem = val;
    });

    this.addEventListener("blur", (event) => {
      this.removeAttribute("focused");
      this.focusedItem = null;
    });

  }
}