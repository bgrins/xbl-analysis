class FirefoxTreeBase extends FirefoxBasecontrol {
  connectedCallback() {
    super.connectedCallback()

    this.setupHandlers();
  }
  _isAccelPressed(aEvent) {
    return aEvent.getModifierState("Accel");
  }

  setupHandlers() {

  }
}