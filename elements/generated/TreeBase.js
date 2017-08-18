class FirefoxTreeBase extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-tree-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}
  _isAccelPressed(aEvent) {
    return aEvent.getModifierState("Accel");
  }
}
customElements.define("firefox-tree-base", FirefoxTreeBase);
