class XblListcellCheckbox extends XblListcell {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<image class="listcell-check" xbl:inherits="checked,disabled">
</image>
<label class="listcell-label" xbl:inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</label>
</children>`;
    let comment = document.createComment("Creating xbl-listcell-checkbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listcell-checkbox", XblListcellCheckbox);
