class XblBasecontrol extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-basecontrol");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-basecontrol", XblBasecontrol);
