class XblDatepicker extends XblDatetimepickerBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-datepicker");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get year() {
    return this._dateValue.getFullYear();
  }

  get month() {
    return this._dateValue.getMonth();
  }

  get date() {
    return this._dateValue.getDate();
  }

  set open(val) {
    return val;
  }

  get open() {
    return false;
  }

  set displayedMonth(val) {
    this.month = val;
    return val;
  }

  get displayedMonth() {
    return this.month;
  }

  set displayedYear(val) {
    this.year = val;
    return val;
  }

  get displayedYear() {
    return this.year;
  }
}
customElements.define("xbl-datepicker", XblDatepicker);
