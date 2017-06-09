class XblButtonRepeat extends XblButton {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-button-repeat";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-repeat", XblButtonRepeat);
