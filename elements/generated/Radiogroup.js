class XblRadiogroup extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-radiogroup");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get value() {
    return this.getAttribute("value");
  }

  get itemCount() {
    return this._getRadioChildren().length;
  }
}
customElements.define("xbl-radiogroup", XblRadiogroup);
