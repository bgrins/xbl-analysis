class XblButtonRepeat extends XblButton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-button-repeat ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button-repeat", XblButtonRepeat);
