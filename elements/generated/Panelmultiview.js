class FirefoxPanelmultiview extends XULElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <xul:vbox anonid="viewContainer" class="panel-viewcontainer" inherits="panelopen,viewtype,transitioning">
        <xul:stack anonid="viewStack" inherits="viewtype,transitioning" class="panel-viewstack">
          <xul:vbox anonid="mainViewContainer" class="panel-mainview" inherits="viewtype"></xul:vbox>
          <xul:vbox anonid="clickCapturer" class="panel-clickcapturer"></xul:vbox>
          <xul:vbox anonid="subViews" class="panel-subviews" inherits="panelopen">
            <children includes="panelview"></children>
          </xul:vbox>
        </xul:stack>
      </xul:vbox>
    `;

    const { PanelMultiView } = Components.utils.import(
      "resource:///modules/PanelMultiView.jsm",
      {}
    );
    this.instance = new PanelMultiView(this);
  }
  disconnectedCallback() {
    this.instance.destructor();
  }
}
customElements.define("firefox-panelmultiview", FirefoxPanelmultiview);
