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
  /**
   * nsIDOMXULSelectControlItemElement
   */
  get selected() {
    return this.getAttribute('selected') == 'true';
  }

  get control() {
    var parent = this.parentNode;
    if (parent &&
      parent.parentNode instanceof Ci.nsIDOMXULSelectControlElement)
      return parent.parentNode;
    return null;
  }
  /**
   * nsIDOMXULContainerItemElement
   */
  get parentContainer() {
    for (var parent = this.parentNode; parent; parent = parent.parentNode) {
      if (parent instanceof Ci.nsIDOMXULContainerElement)
        return parent;
    }
    return null;
  }

  _setupEventListeners() {

  }
}