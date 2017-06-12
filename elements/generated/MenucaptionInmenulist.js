class XblMenucaptionInmenulist extends XblMenucaption {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menu-iconic-left" align="center" pack="center" xbl:inherits="selected,disabled,checked">
<image class="menu-iconic-icon" xbl:inherits="src=image,validate,src">
</image>
</hbox>
<label class="menu-iconic-text" flex="1" xbl:inherits="value=label,crop,highlightable" crop="right">
</label>
<label class="menu-iconic-highlightable-text" xbl:inherits="xbl:text=label,crop,highlightable" crop="right">
</label>`;
    let comment = document.createComment("Creating xbl-menucaption-inmenulist");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menucaption-inmenulist", XblMenucaptionInmenulist);
