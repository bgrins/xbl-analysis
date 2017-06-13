class XblButton extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<hbox class="box-inherit button-box" inherits="align,dir,pack,orient" align="center" pack="center" flex="1" anonid="button-box">
<children>
<image class="button-icon" inherits="src=image">
</image>
<xbl-text-label class="button-text" inherits="value=label,accesskey,crop,highlightable">
</xbl-text-label>
<xbl-text-label class="button-highlightable-text" inherits="text=label,accesskey,crop,highlightable">
</xbl-text-label>
</children>
</hbox>`;
    let comment = document.createComment("Creating xbl-button");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button", XblButton);
