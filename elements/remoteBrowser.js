class XblRemoteBrowser extends XblBrowser {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-remote-browser";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-remote-browser", XblRemoteBrowser);
