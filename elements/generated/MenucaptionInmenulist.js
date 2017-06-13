class XblMenucaptionInmenulist extends XblMenucaption {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menu-iconic-left" align="center" pack="center" inherits="selected,disabled,checked">
<image class="menu-iconic-icon" inherits="src=image,validate,src">
</image>
</hbox>
<xbl-text-label class="menu-iconic-text" flex="1" inherits="value=label,crop,highlightable" crop="right">
</xbl-text-label>
<xbl-text-label class="menu-iconic-highlightable-text" inherits="text=label,crop,highlightable" crop="right">
</xbl-text-label>`;
    let comment = document.createComment("Creating xbl-menucaption-inmenulist");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menucaption-inmenulist", XblMenucaptionInmenulist);
