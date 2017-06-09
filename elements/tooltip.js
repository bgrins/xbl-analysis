class XblTooltip extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    this.textContent = "Hello xbl-tooltip";
    this.setAttribute("foo", "bar");
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tooltip", XblTooltip);
