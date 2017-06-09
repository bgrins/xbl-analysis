class XblRemoteBrowser extends XblBrowser {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-remote-browser ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-remote-browser", XblRemoteBrowser);
