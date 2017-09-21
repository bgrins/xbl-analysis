class FirefoxCtrltabPreview extends FirefoxButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<stack>
<vbox class="ctrlTab-preview-inner" align="center" pack="center" inherits="width=canvaswidth">
<hbox class="tabPreview-canvas" inherits="style=canvasstyle">
<children>
</children>
</hbox>
<firefox-text-label inherits="value=label" crop="end" class="plain">
</firefox-text-label>
</vbox>
<hbox class="ctrlTab-favicon-container" inherits="hidden=noicon">
<image class="ctrlTab-favicon" inherits="src=image">
</image>
</hbox>
</stack>`;
    let comment = document.createComment("Creating firefox-ctrltab-preview");
    this.prepend(comment);

    this.addEventListener("mouseover", event => {
      undefined;
    });

    this.addEventListener("command", event => {
      undefined;
    });

    this.addEventListener("click", event => {
      undefined;
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-ctrltab-preview", FirefoxCtrltabPreview);
