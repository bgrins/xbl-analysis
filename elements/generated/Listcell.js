class XblListcell extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xbl-text-label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</xbl-text-label>
</children>`;
    let comment = document.createComment("Creating xbl-listcell");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listcell", XblListcell);
