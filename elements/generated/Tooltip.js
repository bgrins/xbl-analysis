class XblTooltip extends XblPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xbl-text-label class="tooltip-label" inherits="text=label" flex="1">
</xbl-text-label>
</children>`;
    let comment = document.createComment("Creating xbl-tooltip");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  set page(val) {
    if (val) this.setAttribute("page", "true");
    else this.removeAttribute("page");
    return val;
  }

  get page() {
    return this.getAttribute("page") == "true";
  }
}
customElements.define("xbl-tooltip", XblTooltip);
