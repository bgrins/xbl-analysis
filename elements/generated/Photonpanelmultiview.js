class FirefoxPhotonpanelmultiview extends FirefoxPanelmultiview {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<box anonid="viewContainer" class="panel-viewcontainer" inherits="panelopen,transitioning">
<stack anonid="viewStack" inherits="transitioning" class="panel-viewstack">
<children includes="panelview">
</children>
</stack>
</box>
<box class="panel-viewcontainer offscreen">
<box anonid="offscreenViewStack" class="panel-viewstack">
</box>
</box>`;
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
