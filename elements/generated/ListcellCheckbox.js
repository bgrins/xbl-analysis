class FirefoxListcellCheckbox extends FirefoxListcell {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<image class="listcell-check" inherits="checked,disabled">
</image>
<firefox-text-label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</firefox-text-label>
</children>`;
    let comment = document.createComment("Creating firefox-listcell-checkbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-listcell-checkbox", FirefoxListcellCheckbox);
