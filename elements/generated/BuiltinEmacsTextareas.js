class BuiltinEmacsTextareas extends MozXULElement {
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
    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_DELETE) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_DELETE) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_INSERT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_INSERT) { return; } undefined });

    /**
     * Emacsish multi-line motion and delete keys
     */
    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

    /**
     * handle home/end/arrow keys and redo
     */
    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_PAGE_UP) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_PAGE_DOWN) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_PAGE_UP) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_PAGE_DOWN) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (e.keyCode != KeyEvent.DOM_VK_BACK) { return; } undefined });

    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { undefined });

  }
}