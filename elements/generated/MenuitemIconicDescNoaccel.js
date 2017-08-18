class FirefoxMenuitemIconicDescNoaccel extends FirefoxMenuitem {
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
<firefox-text-label class="menu-iconic-text" inherits="value=label,accesskey,crop" crop="right" flex="1">
</firefox-text-label>
<firefox-text-label class="menu-iconic-text menu-description" inherits="value=description" crop="right" flex="10000">
</firefox-text-label>`;
    let comment = document.createComment(
      "Creating firefox-menuitem-iconic-desc-noaccel"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-menuitem-iconic-desc-noaccel",
  FirefoxMenuitemIconicDescNoaccel
);
