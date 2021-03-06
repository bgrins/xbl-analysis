/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozBuiltinEmacsInputfields extends MozXULElement {
  constructor() {
    super();

    /**
     * Emacsish single-line motion and delete keys
     */
    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    /**
     * Alternate Windows copy/paste/undo/redo keys
     */
    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_DELETE) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_DELETE) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_INSERT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_INSERT) { return; } undefined });

    /**
     * navigating by word keys
     */
    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_BACK) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

  }

  connectedCallback() {

  }
}

customElements.define("builtin-emacs-inputfields", MozBuiltinEmacsInputfields);

}
