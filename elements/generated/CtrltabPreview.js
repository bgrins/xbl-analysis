class XblCtrltabPreview extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<stack>
<vbox class="ctrlTab-preview-inner" align="center" pack="center" inherits="width=canvaswidth">
<hbox class="tabPreview-canvas" inherits="style=canvasstyle">
<children>
</children>
</hbox>
<xbl-text-label inherits="value=label" crop="end" class="plain">
</xbl-text-label>
</vbox>
<hbox class="ctrlTab-favicon-container" inherits="hidden=noicon">
<image class="ctrlTab-favicon" inherits="src=image">
</image>
</hbox>
</stack>`;
    let comment = document.createComment("Creating xbl-ctrltab-preview");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-ctrltab-preview", XblCtrltabPreview);
