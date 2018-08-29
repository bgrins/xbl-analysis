class MozBasecontrol extends MozXULElement {
  connectedCallback() {

    this._setupEventListeners();
  }
  /**
   * public implementation
   */
  set disabled(val) {
    if (val) this.setAttribute('disabled', 'true');
    else this.removeAttribute('disabled');
    return val;
  }

  get disabled() {
    return this.getAttribute('disabled') == 'true';
  }

  set tabIndex(val) {
    if (val) this.setAttribute('tabindex', val);
    else this.removeAttribute('tabindex');
    return val;
  }

  get tabIndex() {
    return parseInt(this.getAttribute('tabindex')) || 0
  }

  _setupEventListeners() {

  }
}