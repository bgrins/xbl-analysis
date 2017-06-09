class XblHistoryDropmarker extends XblDropmarker {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-history-dropmarker";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-history-dropmarker", XblHistoryDropmarker);
