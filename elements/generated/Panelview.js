class XblPanelview extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<box class="panel-header" anonid="header">
<toolbarbutton anonid="back" class="subviewbutton subviewbutton-iconic subviewbutton-back" closemenu="none" tabindex="0" tooltip="&backCmd.label;" onclick="document.getBindingParent(this).panelMultiView.goBack(); this.blur()">
</toolbarbutton>
<xbl-text-label inherits="value=title">
</xbl-text-label>
</box>
<children>
</children>`;
    let comment = document.createComment("Creating xbl-panelview");
    this.prepend(comment);
  }
  disconnectedCallback() {}

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
customElements.define("xbl-panelview", XblPanelview);
