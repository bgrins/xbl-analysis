class XblMenuButton extends XblMenuButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<toolbarbutton class="box-inherit toolbarbutton-menubutton-button" anonid="button" flex="1" allowevents="true" xbl:inherits="disabled,crop,image,label,accesskey,command,wrap,badge,                                        align,dir,pack,orient,tooltiptext=buttontooltiptext">
</toolbarbutton>
<dropmarker type="menu-button" class="toolbarbutton-menubutton-dropmarker" anonid="dropmarker" xbl:inherits="align,dir,pack,orient,disabled,label,open,consumeanchor">
</dropmarker>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-menu-button ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-menu-button", XblMenuButton);
