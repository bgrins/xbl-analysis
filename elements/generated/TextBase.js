class MozTextBase extends MozXULElement {
  connectedCallback() {

    this._setupEventListeners();
  }

  set disabled(val) {
    if (val) this.setAttribute('disabled', 'true');
    else this.removeAttribute('disabled');
    return val;
  }

  get disabled() {
    return this.getAttribute('disabled') == 'true';
  }

  set value(val) {
    this.setAttribute('value', val);
    return val;
  }

  get value() {
    return this.getAttribute('value');
  }

  set crop(val) {
    this.setAttribute('crop', val);
    return val;
  }

  get crop() {
    return this.getAttribute('crop');
  }

  _setupEventListeners() {

  }
}