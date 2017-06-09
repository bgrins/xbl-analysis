class XblListcellIconic extends XblListcell {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<image class="listcell-icon" xbl:inherits="src=image">
</image>
<label class="listcell-label" xbl:inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</label>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-listcell-iconic ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listcell-iconic", XblListcellIconic);
