class FirefoxTreeBase extends FirefoxBasecontrol {
  connectedCallback() {
    super.connectedCallback();
  }

  _isAccelPressed(aEvent) {
    return aEvent.getModifierState("Accel");
  }
}
customElements.define("firefox-tree-base", FirefoxTreeBase);
