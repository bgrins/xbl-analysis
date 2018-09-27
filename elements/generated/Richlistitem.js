/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozRichlistitem extends MozBasetext {
  constructor() {
    super();

    /**
     * If there is no modifier key, we select on mousedown, not
     * click, so that drags work correctly.
     */
    this.addEventListener("mousedown", (event) => {
      var control = this.control;
      if (!control || control.disabled)
        return;
      if ((!event.ctrlKey || (/Mac/.test(navigator.platform) && event.button == 2)) &&
        !event.shiftKey && !event.metaKey) {
        if (!this.selected) {
          control.selectItem(this);
        }
        control.currentItem = this;
      }
    });

    /**
     * On a click (up+down on the same item), deselect everything
     * except this item.
     */
    this.addEventListener("click", (event) => {
      if (event.button != 0) { return; }
      var control = this.control;
      if (!control || control.disabled)
        return;
      control._userSelecting = true;
      if (control.selType != "multiple") {
        control.selectItem(this);
      } else if (event.ctrlKey || event.metaKey) {
        control.toggleItemSelection(this);
        control.currentItem = this;
      } else if (event.shiftKey) {
        control.selectItemRange(null, this);
        control.currentItem = this;
      } else {
        /* We want to deselect all the selected items except what was
          clicked, UNLESS it was a right-click.  We have to do this
          in click rather than mousedown so that you can drag a
          selected group of items */

        // use selectItemRange instead of selectItem, because this
        // doesn't de- and reselect this item if it is selected
        control.selectItemRange(this, this);
      }
      control._userSelecting = false;
    });

  }

  connectedCallback() {
    super.connectedCallback()

    this.selectedByMouseOver = false;

  }
  /**
   * nsIDOMXULSelectControlItemElement
   */
  get label() {
    const XULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    return Array.map(this.getElementsByTagNameNS(XULNS, "label"),
        label => label.value)
      .join(" ");
  }

  set searchLabel(val) {
    if (val !== null)
      this.setAttribute("searchlabel", val);
    else
      // fall back to the label property (default value)
      this.removeAttribute("searchlabel");
    return val;
  }

  get searchLabel() {
    return this.hasAttribute("searchlabel") ?
      this.getAttribute("searchlabel") : this.label;
  }
  /**
   * nsIDOMXULSelectControlItemElement
   */
  set value(val) {
    this.setAttribute('value', val);
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }
  /**
   * nsIDOMXULSelectControlItemElement
   */
  set selected(val) {
    if (val)
      this.setAttribute("selected", "true");
    else
      this.removeAttribute("selected");

    return val;
  }

  get selected() {
    return this.getAttribute('selected') == 'true';
  }
  /**
   * nsIDOMXULSelectControlItemElement
   */
  get control() {
    var parent = this.parentNode;
    while (parent) {
      if (parent instanceof Ci.nsIDOMXULSelectControlElement)
        return parent;
      parent = parent.parentNode;
    }
    return null;
  }

  set current(val) {
    if (val)
      this.setAttribute("current", "true");
    else
      this.removeAttribute("current");

    let control = this.control;
    if (!control || !control.suppressMenuItemEvent) {
      this._fireEvent(val ? "DOMMenuItemActive" : "DOMMenuItemInactive");
    }

    return val;
  }

  get current() {
    return this.getAttribute('current') == 'true';
  }

  _fireEvent(name) {
    var event = document.createEvent("Events");
    event.initEvent(name, true, true);
    this.dispatchEvent(event);
  }
  disconnectedCallback() {
    var control = this.control;
    if (!control)
      return;
    // When we are destructed and we are current or selected, unselect ourselves
    // so that richlistbox's selection doesn't point to something not in the DOM.
    // We don't want to reset last-selected, so we set _suppressOnSelect.
    if (this.selected) {
      var suppressSelect = control._suppressOnSelect;
      control._suppressOnSelect = true;
      control.removeItemFromSelection(this);
      control._suppressOnSelect = suppressSelect;
    }
    if (this.current)
      control.currentItem = null;
  }
}

MozXULElement.implementCustomInterface(MozRichlistitem, [Ci.nsIDOMXULSelectControlItemElement]);
customElements.define("richlistitem", MozRichlistitem);

}
