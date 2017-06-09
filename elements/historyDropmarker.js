class XblHistoryDropmarker extends XblDropmarker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    let name = document.createElement("span");
    name.textContent = "Creating xbl-history-dropmarker ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-history-dropmarker", XblHistoryDropmarker);
