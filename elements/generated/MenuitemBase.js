class FirefoxMenuitemBase extends FirefoxBasetext {
  connectedCallback() {
    super.connectedCallback()

    this._setupEventListeners();
  }

  set value(val) {
    this.setAttribute('value', val);
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  get selected() {
    return this.getAttribute('selected') == 'true';
  }

  get control() {
    var parent = this.parentNode;
    if (parent &&
      parent.parentNode instanceof Components.interfaces.nsIDOMXULSelectControlElement)
      return parent.parentNode;
    return null;
  }

  get parentContainer() {
    for (var parent = this.parentNode; parent; parent = parent.parentNode) {
      if (parent instanceof Components.interfaces.nsIDOMXULContainerElement)
        return parent;
    }
    return null;
  }

  _setupEventListeners() {

  }
}