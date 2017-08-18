class FirefoxToolbarbutton extends FirefoxButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor">
</image>
<firefox-text-label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,wrap">
</firefox-text-label>
<firefox-text-label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap">
</firefox-text-label>
<children includes="box">
</children>`;
    let comment = document.createComment("Creating firefox-toolbarbutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-toolbarbutton", FirefoxToolbarbutton);
