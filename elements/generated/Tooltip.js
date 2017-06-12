class XblTooltip extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<label class="tooltip-label" xbl:inherits="xbl:text=label" flex="1">
</label>
</children>`;
    let comment = document.createComment("Creating xbl-tooltip");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-tooltip", XblTooltip);
