class XblPreference extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-preference");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get preferences() {
    return this.parentNode;
  }

  get name() {
    return this.getAttribute("name");
  }

  set type(val) {
    this.setAttribute("type", val);
    return val;
  }

  get type() {
    return this.getAttribute("type");
  }

  set inverted(val) {
    this.setAttribute("inverted", val);
    return val;
  }

  get inverted() {
    return this.getAttribute("inverted") == "true";
  }

  set readonly(val) {
    this.setAttribute("readonly", val);
    return val;
  }

  get readonly() {
    return this.getAttribute("readonly") == "true";
  }

  set value(val) {
    return this._setValue(val);
  }

  get value() {
    return this._value;
  }
}
customElements.define("xbl-preference", XblPreference);
