class FirefoxListcellCheckboxIconic extends FirefoxListcellCheckbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xul:image class="listcell-check" inherits="checked,disabled">
</xul:image>
<xul:image class="listcell-icon" inherits="src=image">
</xul:image>
<xul:label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</xul:label>
</children>`;
    let comment = document.createComment(
      "Creating firefox-listcell-checkbox-iconic"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-listcell-checkbox-iconic",
  FirefoxListcellCheckboxIconic
);
