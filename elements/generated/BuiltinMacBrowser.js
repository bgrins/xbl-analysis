class BuiltinMacBrowser extends MozXULElement {
  connectedCallback() {

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_PAGE_UP) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_PAGE_DOWN) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_UP) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_DOWN) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_UP) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_DOWN) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_UP) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (!e.keyCode != KeyEvent.DOM_VK_DOWN) { return; } undefined });

  }
}