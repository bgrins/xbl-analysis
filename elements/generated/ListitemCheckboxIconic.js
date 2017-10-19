class FirefoxListitemCheckboxIconic extends FirefoxListitemCheckbox {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<xul:listcell type="checkbox" class="listcell-iconic" inherits="label,image,crop,checked,disabled,flexlabel">
</xul:listcell>
</children>`;
    let comment = document.createComment(
      "Creating firefox-listitem-checkbox-iconic"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-listitem-checkbox-iconic",
  FirefoxListitemCheckboxIconic
);
