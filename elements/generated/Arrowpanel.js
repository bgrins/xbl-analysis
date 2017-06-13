class XblArrowpanel extends XblPanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<vbox anonid="container" class="panel-arrowcontainer" flex="1" inherits="side,panelopen">
<box anonid="arrowbox" class="panel-arrowbox">
<image anonid="arrow" class="panel-arrow" inherits="side">
</image>
</box>
<box class="panel-arrowcontent" inherits="side,align,dir,orient,pack" flex="1">
<children>
</children>
</box>
</vbox>`;
    let comment = document.createComment("Creating xbl-arrowpanel");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-arrowpanel", XblArrowpanel);
