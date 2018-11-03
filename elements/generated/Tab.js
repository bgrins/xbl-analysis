/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTab extends MozBasetext {
  constructor() {
    super();

    this.addEventListener("mousedown", (event) => {
      if (event.button != 0) { return; }
      if (this.disabled)
        return;

      this.parentNode.ariaFocusedItem = null;

      if (this != this.parentNode.selectedItem) { // Not selected yet
        let stopwatchid = this.parentNode.getAttribute("stopwatchid");
        if (stopwatchid) {
          TelemetryStopwatch.start(stopwatchid);
        }

        // Call this before setting the 'ignorefocus' attribute because this
        // will pass on focus if the formerly selected tab was focused as well.
        this.parentNode._selectNewTab(this);

        var isTabFocused = false;
        try {
          isTabFocused = (document.commandDispatcher.focusedElement == this);
        } catch (e) {}

        // Set '-moz-user-focus' to 'ignore' so that PostHandleEvent() can't
        // focus the tab; we only want tabs to be focusable by the mouse if
        // they are already focused. After a short timeout we'll reset
        // '-moz-user-focus' so that tabs can be focused by keyboard again.
        if (!isTabFocused) {
          this.setAttribute("ignorefocus", "true");
          setTimeout(tab => tab.removeAttribute("ignorefocus"), 0, this);
        }

        if (stopwatchid) {
          TelemetryStopwatch.finish(stopwatchid);
        }
      }
      // Otherwise this tab is already selected and we will fall
      // through to mousedown behavior which sets focus on the current tab,
      // Only a click on an already selected tab should focus the tab itself.
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_LEFT) { return; }
      var direction = window.getComputedStyle(this.parentNode).direction;
      this.parentNode.advanceSelectedTab(direction == "ltr" ? -1 : 1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_RIGHT) { return; }
      var direction = window.getComputedStyle(this.parentNode).direction;
      this.parentNode.advanceSelectedTab(direction == "ltr" ? 1 : -1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_UP) { return; }
      this.parentNode.advanceSelectedTab(-1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_DOWN) { return; }
      this.parentNode.advanceSelectedTab(1, this.arrowKeysShouldWrap);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; }
      this.parentNode._selectNewTab(this.parentNode.children[0]);
    });

    this.addEventListener("keydown", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_END) { return; }
      var tabs = this.parentNode.children;
      this.parentNode._selectNewTab(tabs[tabs.length - 1], -1);
    });

  }

  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="tab-middle box-inherit" inherits="align,dir,pack,orient,selected,visuallyselected" flex="1">
        <image class="tab-icon" inherits="validate,src=image" role="presentation"></image>
        <label class="tab-text" inherits="value=label,accesskey,crop,disabled" flex="1" role="presentation"></label>
      </hbox>
    `));
    this.arrowKeysShouldWrap = /Mac/.test(navigator.platform);

  }

  set value(val) {
    this.setAttribute('value', val);
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  get control() {
    var parent = this.parentNode;
    if (parent instanceof Ci.nsIDOMXULSelectControlElement)
      return parent;
    return null;
  }

  get selected() {
    return this.getAttribute('selected') == 'true';
  }

  set _selected(val) {
    if (val) {
      this.setAttribute("selected", "true");
      this.setAttribute("visuallyselected", "true");
    } else {
      this.removeAttribute("selected");
      this.removeAttribute("visuallyselected");
    }

    return val;
  }

  set linkedPanel(val) {
    this.setAttribute('linkedpanel', val);
    return val;
  }

  get linkedPanel() {
    return this.getAttribute('linkedpanel')
  }
}

MozXULElement.implementCustomInterface(MozTab, [Ci.nsIDOMXULSelectControlItemElement]);
customElements.define("tab", MozTab);

}
