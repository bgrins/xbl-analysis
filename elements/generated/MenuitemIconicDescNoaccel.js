class XblMenuitemIconicDescNoaccel extends XblMenuitem {
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
<label class="menu-iconic-text" xbl:inherits="value=label,accesskey,crop" crop="right" flex="1">
</label>
<label class="menu-iconic-text menu-description" xbl:inherits="value=description" crop="right" flex="10000">
</label>`;
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
