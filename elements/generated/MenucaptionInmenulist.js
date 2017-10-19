class FirefoxMenucaptionInmenulist extends FirefoxMenucaption {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox class="menu-iconic-left" align="center" pack="center" inherits="selected,disabled,checked">
<xul:image class="menu-iconic-icon" inherits="src=image,validate,src">
</xul:image>
</xul:hbox>
<xul:label class="menu-iconic-text" flex="1" inherits="value=label,crop,highlightable" crop="right">
</xul:label>
<xul:label class="menu-iconic-highlightable-text" inherits="text=label,crop,highlightable" crop="right">
</xul:label>`;
    let comment = document.createComment(
      "Creating firefox-menucaption-inmenulist"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-menucaption-inmenulist",
  FirefoxMenucaptionInmenulist
);
