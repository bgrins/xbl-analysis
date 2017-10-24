class FirefoxTreeBase extends FirefoxBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {}
  _isAccelPressed(aEvent) {
    return aEvent.getModifierState("Accel");
  }
}
customElements.define("firefox-tree-base", FirefoxTreeBase);
