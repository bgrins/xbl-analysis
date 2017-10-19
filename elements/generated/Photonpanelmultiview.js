class FirefoxPhotonpanelmultiview extends FirefoxPanelmultiview {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

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
    let comment = document.createComment(
      "Creating firefox-photonpanelmultiview"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-photonpanelmultiview",
  FirefoxPhotonpanelmultiview
);
