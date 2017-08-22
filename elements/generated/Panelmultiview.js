class FirefoxPanelmultiview extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<vbox anonid="viewContainer" class="panel-viewcontainer" inherits="panelopen,viewtype,transitioning">
<stack anonid="viewStack" inherits="viewtype,transitioning" class="panel-viewstack">
<vbox anonid="mainViewContainer" class="panel-mainview" inherits="viewtype">
</vbox>
<vbox anonid="clickCapturer" class="panel-clickcapturer">
</vbox>
<vbox anonid="subViews" class="panel-subviews" inherits="panelopen">
<children includes="panelview">
</children>
</vbox>
</stack>
</vbox>`;
    let comment = document.createComment("Creating firefox-panelmultiview");
    this.prepend(comment);

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
