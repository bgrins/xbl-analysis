class XblMenuitemIconicDescNoaccel extends XblMenuitem {
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
<xbl-text-label class="menu-iconic-text" inherits="value=label,accesskey,crop" crop="right" flex="1">
</xbl-text-label>
<xbl-text-label class="menu-iconic-text menu-description" inherits="value=description" crop="right" flex="10000">
</xbl-text-label>`;
    let comment = document.createComment(
      "Creating xbl-menuitem-iconic-desc-noaccel"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-menuitem-iconic-desc-noaccel",
  XblMenuitemIconicDescNoaccel
);
