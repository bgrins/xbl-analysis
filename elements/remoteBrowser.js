class XblRemoteBrowser extends XblBrowser {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let comment = document.createComment("Creating xbl-remote-browser");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-remote-browser", XblRemoteBrowser);
