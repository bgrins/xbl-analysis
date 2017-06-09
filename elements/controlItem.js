class XblControlItem extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-control-item");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-control-item", XblControlItem);
