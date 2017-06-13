class XblListcellCheckboxIconic extends XblListcellCheckbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<image class="listcell-check" inherits="checked,disabled">
</image>
<image class="listcell-icon" inherits="src=image">
</image>
<xbl-text-label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</xbl-text-label>
</children>`;
    let comment = document.createComment(
      "Creating xbl-listcell-checkbox-iconic"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-listcell-checkbox-iconic",
  XblListcellCheckboxIconic
);
