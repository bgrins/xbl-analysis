class XblArrowpanel extends XblPanel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox anonid="container" class="panel-arrowcontainer" flex="1" xbl:inherits="side,panelopen">
<box anonid="arrowbox" class="panel-arrowbox">
<image anonid="arrow" class="panel-arrow" xbl:inherits="side">
</image>
</box>
<box class="panel-arrowcontent" xbl:inherits="side,align,dir,orient,pack" flex="1">
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
