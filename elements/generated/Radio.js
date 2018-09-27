/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozRadio extends MozBasetext {
  constructor() {
    super();

    this.addEventListener("click", (event) => {
      if (event.button != 0) { return; }
      if (!this.disabled)
        this.control.selectedItem = this;
    });

    this.addEventListener("mousedown", (event) => {
      if (event.button != 0) { return; }
      if (!this.disabled)
        this.control.focusedItem = this;
    });

  }

  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image class="radio-check" inherits="disabled,selected"></image>
      <hbox class="radio-label-box" align="center" flex="1">
        <image class="radio-icon" inherits="src"></image>
        <label class="radio-label" inherits="text=label,accesskey,crop" flex="1"></label>
      </hbox>
    `));

    // Just clear out the parent's cached list of radio children
    var control = this.control;
    if (control)
      control._radioChildren = null;

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
}

MozXULElement.implementCustomInterface(MozRadio, [Ci.nsIDOMXULSelectControlItemElement]);
customElements.define("radio", MozRadio);

}
