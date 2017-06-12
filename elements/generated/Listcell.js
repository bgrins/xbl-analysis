class XblListcell extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<label class="listcell-label" xbl:inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</label>
</children>`;
    let comment = document.createComment("Creating xbl-listcell");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listcell", XblListcell);
