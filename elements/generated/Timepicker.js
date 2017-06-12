class XblTimepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-timepicker");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get hour() {
    return this._dateValue.getHours();
  }

  get minute() {
    return this._dateValue.getMinutes();
  }

  get second() {
    return this._dateValue.getSeconds();
  }
}
customElements.define("xbl-timepicker", XblTimepicker);
