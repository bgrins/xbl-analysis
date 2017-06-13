class XblToolbarbuttonBadgedMenu extends XblToolbarbutton {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<stack class="toolbarbutton-badge-stack">
<image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor">
</image>
<xbl-text-label class="toolbarbutton-badge" inherits="value=badge" top="0" end="0" crop="none">
</xbl-text-label>
</stack>
<xbl-text-label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,dragover-top,wrap">
</xbl-text-label>
<xbl-text-label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap">
</xbl-text-label>
<dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" inherits="disabled,label">
</dropmarker>`;
    let comment = document.createComment(
      "Creating xbl-toolbarbutton-badged-menu"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-toolbarbutton-badged-menu",
  XblToolbarbuttonBadgedMenu
);
