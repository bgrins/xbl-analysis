class FirefoxPanelview extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `<xul:box class="panel-header" anonid="header">
<xul:toolbarbutton anonid="back" class="subviewbutton subviewbutton-iconic subviewbutton-back" closemenu="none" tabindex="0" tooltip="FROM-DTD-backCmd-label" onclick="document.getBindingParent(this).panelMultiView.goBack(); this.blur()">
</xul:toolbarbutton>
<xul:label inherits="value=title">
</xul:label>
</xul:box>
<children>
</children>`;
  }

  get header() {
    return document.getAnonymousElementByAttribute(this, "anonid", "header");
  }

  get backButton() {
    return document.getAnonymousElementByAttribute(this, "anonid", "back");
  }

  get panelMultiView() {
    if (!this.parentNode.localName.endsWith("panelmultiview")) {
      return document.getBindingParent(this.parentNode);
    }

    return this.parentNode;
  }
}
customElements.define("firefox-panelview", FirefoxPanelview);
