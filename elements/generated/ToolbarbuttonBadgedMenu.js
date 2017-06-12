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
<image class="toolbarbutton-icon" xbl:inherits="validate,src=image,label,consumeanchor">
</image>
<label class="toolbarbutton-badge" xbl:inherits="value=badge" top="0" end="0" crop="none">
</label>
</stack>
<label class="toolbarbutton-text" crop="right" flex="1" xbl:inherits="value=label,accesskey,crop,dragover-top,wrap">
</label>
<label class="toolbarbutton-multiline-text" flex="1" xbl:inherits="xbl:text=label,accesskey,wrap">
</label>
<dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" xbl:inherits="disabled,label">
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
