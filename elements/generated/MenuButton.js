class FirefoxMenuButton extends FirefoxMenuButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<xul:toolbarbutton class="box-inherit toolbarbutton-menubutton-button" anonid="button" flex="1" allowevents="true" inherits="disabled,crop,image,label,accesskey,command,wrap,badge,
                                       align,dir,pack,orient,tooltiptext=buttontooltiptext">
</xul:toolbarbutton>
<xul:dropmarker type="menu-button" class="toolbarbutton-menubutton-dropmarker" anonid="dropmarker" inherits="align,dir,pack,orient,disabled,label,open,consumeanchor">
</xul:dropmarker>`;
  }
  disconnectedCallback() {}
}
customElements.define("firefox-menu-button", FirefoxMenuButton);
