class XblButton extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<hbox class="box-inherit button-box" xbl:inherits="align,dir,pack,orient" align="center" pack="center" flex="1" anonid="button-box">
<children>
<image class="button-icon" xbl:inherits="src=image">
</image>
<label class="button-text" xbl:inherits="value=label,accesskey,crop,highlightable">
</label>
<label class="button-highlightable-text" xbl:inherits="xbl:text=label,accesskey,crop,highlightable">
</label>
</children>
</hbox>`;
    let comment = document.createComment("Creating xbl-button");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-button", XblButton);
