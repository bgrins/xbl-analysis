class XblRadiogroup extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-radiogroup");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-radiogroup", XblRadiogroup);
