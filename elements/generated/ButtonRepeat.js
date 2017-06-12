class XblButtonRepeat extends XblButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-button-repeat");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-repeat", XblButtonRepeat);
