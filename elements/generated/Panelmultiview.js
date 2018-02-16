class FirefoxPanelmultiview extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:box anonid="viewContainer" class="panel-viewcontainer" inherits="panelopen,transitioning">
        <xul:box anonid="viewStack" inherits="transitioning" class="panel-viewstack">
          <children includes="panelview"></children>
        </xul:box>
      </xul:box>
      <xul:box class="panel-viewcontainer offscreen">
        <xul:box anonid="offscreenViewStack" class="panel-viewstack"></xul:box>
      </xul:box>
    `;

    const { PanelMultiView } = ChromeUtils.import("resource:///modules/PanelMultiView.jsm", {});
    this.instance = PanelMultiView.forNode(this);
    this.instance.connect();

    this.setupHandlers();
  }

  disconnectedCallback() {
    this.instance.destructor();
  }

  setupHandlers() {

  }
}