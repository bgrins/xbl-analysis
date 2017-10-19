class FirefoxToolbarbutton extends FirefoxButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<xul:image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor">
</xul:image>
<xul:label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,wrap">
</xul:label>
<xul:label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap">
</xul:label>
<children includes="box">
</children>`;
    let comment = document.createComment("Creating firefox-toolbarbutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbarbutton", FirefoxToolbarbutton);
