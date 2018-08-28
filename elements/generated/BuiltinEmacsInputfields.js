class BuiltinEmacsInputfields extends MozXULElement {
  connectedCallback() {

    this._setupEventListeners();
  }

  _setupEventListeners() {
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
    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_DELETE) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_DELETE) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_INSERT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_INSERT) { return; } undefined });

    /**
     * navigating by word keys
     */
    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_BACK) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

  }
}