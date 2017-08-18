class FirefoxListcellIconic extends FirefoxListcell {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<image class="listcell-icon" inherits="src=image">
</image>
<firefox-text-label class="listcell-label" inherits="value=label,flex=flexlabel,crop,disabled" flex="1" crop="right">
</firefox-text-label>
</children>`;
    let comment = document.createComment("Creating firefox-listcell-iconic");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-listcell-iconic", FirefoxListcellIconic);
