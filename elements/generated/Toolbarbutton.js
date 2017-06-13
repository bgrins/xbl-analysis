class XblToolbarbutton extends XblButtonBase {
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
<xbl-text-label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,wrap">
</xbl-text-label>
<xbl-text-label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap">
</xbl-text-label>`;
    let comment = document.createComment("Creating xbl-toolbarbutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-toolbarbutton", XblToolbarbutton);
