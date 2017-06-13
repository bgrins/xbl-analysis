class XblMenulistDescription extends XblMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menulist-label-box" flex="1">
<image class="menulist-icon" inherits="src=image,src">
</image>
<xbl-text-label class="menulist-label" inherits="value=label,crop,accesskey" crop="right" flex="1">
</xbl-text-label>
<xbl-text-label class="menulist-label menulist-description" inherits="value=description" crop="right" flex="10000">
</xbl-text-label>
</hbox>
<dropmarker class="menulist-dropmarker" type="menu" inherits="disabled,open">
</dropmarker>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menulist-description");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist-description", XblMenulistDescription);
