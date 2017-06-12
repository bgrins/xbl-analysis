class XblListcellCheckboxIconic extends XblListcellCheckbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<image class="listcell-check" xbl:inherits="checked,disabled">
</image>
<image class="listcell-icon" xbl:inherits="src=image">
</image>
<label class="listcell-label" xbl:inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</label>
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
