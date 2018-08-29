class MozBuiltinAndroidInputfields extends MozXULElement {
  connectedCallback() {

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("keypress", (event) => { undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_LEFT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_RIGHT) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_HOME) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_END) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_BACK) { return; } undefined });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_DELETE) { return; } undefined });

  }
}