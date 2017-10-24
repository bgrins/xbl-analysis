class FirefoxPhotonpanelmultiview extends FirefoxPanelmultiview {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `<xul:box anonid="viewContainer" class="panel-viewcontainer" inherits="panelopen,transitioning">
<xul:box anonid="viewStack" inherits="transitioning" class="panel-viewstack">
<children includes="panelview">
</children>
</xul:box>
</xul:box>
<xul:box class="panel-viewcontainer offscreen">
<xul:box anonid="offscreenViewStack" class="panel-viewstack">
</xul:box>
</xul:box>`;
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-photonpanelmultiview",
  FirefoxPhotonpanelmultiview
);
