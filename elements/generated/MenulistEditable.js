class MenulistEditable extends Menulist {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <moz-input-box class="menulist-editable-box moz-input-box" inherits="context,disabled,readonly,focused" flex="1">
        <html:input class="menulist-editable-input" anonid="input" allowevents="true" inherits="value=label,value,disabled,tabindex,readonly,placeholder"></html:input>
      </moz-input-box>
      <dropmarker class="menulist-dropmarker" type="menu" inherits="open,disabled,parentfocused=focused"></dropmarker>
      <children includes="menupopup"></children>
    `));

    this._setupEventListeners();
  }

  get inputField() {
    if (!this.mInputField)
      this.mInputField = document.getAnonymousElementByAttribute(this, "anonid", "input");
    return this.mInputField;
  }

  set label(val) {
    this.inputField.value = val;
    return val;
  }

  get label() {
    return this.inputField.value;
  }

  set value(val) {
    // Override menulist's value setter to refer to the inputField's value
    // (Allows using "menulist.value" instead of "menulist.inputField.value")
    this.inputField.value = val;
    this.setAttribute("value", val);
    this.setAttribute("label", val);
    this._selectInputFieldValueInList();
    return val;
  }

  get value() {
    return this.inputField.value;
  }

  set selectedItem(val) {
    var oldval = this.mSelectedInternal;
    if (oldval == val)
      return val;

    if (val && !this.contains(val))
      return val;

    // This doesn't touch inputField.value or "value" and "label" attributes
    this.setSelectionInternal(val);
    if (val) {
      // Editable menulist uses "label" as its "value"
      var label = val.getAttribute("label");
      this.inputField.value = label;
      this.setAttribute("value", label);
      this.setAttribute("label", label);
    } else {
      this.inputField.value = "";
      this.removeAttribute("value");
      this.removeAttribute("label");
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
    // Make sure internally-selected item
    //  is in sync with inputField.value
    this._selectInputFieldValueInList();
    return this.mSelectedInternal;
  }

  set disableautoselect(val) {
    if (val) this.setAttribute('disableautoselect', 'true');
    else this.removeAttribute('disableautoselect');
    return val;
  }

  get disableautoselect() {
    return this.hasAttribute('disableautoselect');
  }

  get editor() {
    return this.inputField.editor;
  }

  set readOnly(val) {
    this.inputField.readOnly = val;
    if (val) this.setAttribute('readonly', 'true');
    else this.removeAttribute('readonly');
    return val;
  }

  get readOnly() {
    return this.inputField.readOnly;
  }

  _selectInputFieldValueInList() {
    if (this.hasAttribute("disableautoselect"))
      return;

    // Find and select the menuitem that matches inputField's "value"
    var arr = null;
    var popup = this.menupopup;

    if (popup)
      arr = popup.getElementsByAttribute("label", this.inputField.value);

    this.setSelectionInternal(arr ? arr.item(0) : null);
  }

  setSelectionInternal(val) {
    // This is called internally to set selected item
    //  without triggering infinite loop
    //  when using selectedItem's setter
    if (this.mSelectedInternal == val)
      return val;

    if (this.mSelectedInternal)
      this.mSelectedInternal.removeAttribute("selected");

    this.mSelectedInternal = val;

    if (val)
      val.setAttribute("selected", "true");

    // Do NOT change the "value", which is owned by inputField
    return val;
  }

  select() {
    this.inputField.select();
  }

  _setupEventListeners() {
    this.addEventListener("focus", (event) => {
      this.setAttribute("focused", "true");
    }, true);

    this.addEventListener("blur", (event) => {
      this.removeAttribute("focused");
    }, true);

    this.addEventListener("popupshowing", (event) => {
      // editable menulists elements aren't in the focus order,
      // so when the popup opens we need to force the focus to the inputField
      if (event.target.parentNode == this) {
        if (document.commandDispatcher.focusedElement != this.inputField)
          this.inputField.focus();

        this.menuBoxObject.activeChild = null;
        if (this.selectedItem)
          // Not ready for auto-setting the active child in hierarchies yet.
          // For now, only do this when the outermost menupopup opens.
          this.menuBoxObject.activeChild = this.mSelectedInternal;
      }
    });

    this.addEventListener("keypress", (event) => {
      // open popup if key is up arrow, down arrow, or F4
      if (!event.ctrlKey && !event.shiftKey) {
        if (event.keyCode == KeyEvent.DOM_VK_UP ||
          event.keyCode == KeyEvent.DOM_VK_DOWN ||
          (event.keyCode == KeyEvent.DOM_VK_F4 && !event.altKey)) {
          event.preventDefault();
          this.open = true;
        }
      }
    });

  }
}