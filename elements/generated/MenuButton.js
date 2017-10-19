class FirefoxMenuButton extends FirefoxMenuButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<xul:toolbarbutton class="box-inherit toolbarbutton-menubutton-button" anonid="button" flex="1" allowevents="true" inherits="disabled,crop,image,label,accesskey,command,wrap,badge,
                                       align,dir,pack,orient,tooltiptext=buttontooltiptext">
</xul:toolbarbutton>
<xul:dropmarker type="menu-button" class="toolbarbutton-menubutton-dropmarker" anonid="dropmarker" inherits="align,dir,pack,orient,disabled,label,open,consumeanchor">
</xul:dropmarker>`;
    let comment = document.createComment("Creating firefox-menu-button");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menu-button", FirefoxMenuButton);
