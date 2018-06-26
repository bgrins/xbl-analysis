class TreeBase extends Basecontrol {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
  }

  _isAccelPressed(aEvent) {
    return aEvent.getModifierState("Accel");
  }

  _setupEventListeners() {

  }
}