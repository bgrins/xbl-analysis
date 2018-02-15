class FirefoxTreeBase extends FirefoxBasecontrol {
  connectedCallback() {
    super.connectedCallback()

  }

  _isAccelPressed(aEvent) {
    return aEvent.getModifierState("Accel");
  }
}