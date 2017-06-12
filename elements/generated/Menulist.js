class XblMenulist extends XblMenulistBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="menulist-label-box" flex="1">
<image class="menulist-icon" xbl:inherits="src=image,src">
</image>
<label class="menulist-label" xbl:inherits="value=label,crop,accesskey,highlightable" crop="right" flex="1">
</label>
<label class="menulist-highlightable-label" xbl:inherits="xbl:text=label,crop,accesskey,highlightable" crop="right" flex="1">
</label>
</hbox>
<dropmarker class="menulist-dropmarker" type="menu" xbl:inherits="disabled,open">
</dropmarker>
<children includes="menupopup">
</children>`;
    let comment = document.createComment("Creating xbl-menulist");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menulist", XblMenulist);
