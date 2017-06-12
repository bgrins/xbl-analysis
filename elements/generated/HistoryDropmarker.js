class XblHistoryDropmarker extends XblDropmarker {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-history-dropmarker");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-history-dropmarker", XblHistoryDropmarker);
