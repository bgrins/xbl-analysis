class FirefoxCtrltabPreview extends FirefoxButtonBase {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:stack>
        <xul:vbox class="ctrlTab-preview-inner" align="center" pack="center" inherits="width=canvaswidth">
          <xul:hbox class="tabPreview-canvas" inherits="style=canvasstyle">
            <children></children>
          </xul:hbox>
          <xul:label inherits="value=label" crop="end" class="plain"></xul:label>
        </xul:vbox>
        <xul:hbox class="ctrlTab-favicon-container" inherits="hidden=noicon">
          <xul:image class="ctrlTab-favicon" inherits="src=image"></xul:image>
        </xul:hbox>
      </xul:stack>
    `;

    this.addEventListener("mouseover", event => {
      ctrlTab._mouseOverFocus(this);
    });

    this.addEventListener("command", event => {
      ctrlTab.pick(this);
    });

    this.addEventListener("click", event => {
      ctrlTab.remove(this);
    });
  }
}
customElements.define("firefox-ctrltab-preview", FirefoxCtrltabPreview);
