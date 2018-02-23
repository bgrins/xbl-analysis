class FirefoxCtrltabPreview extends FirefoxButtonBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:vbox class="ctrlTab-preview-inner">
        <xul:hbox class="ctrlTab-canvas" inherits="style=canvasstyle,width=canvaswidth">
          <children></children>
        </xul:hbox>
        <xul:hbox class="ctrlTab-favicon-container" inherits="hidden=noicon">
          <xul:image class="ctrlTab-favicon" inherits="src=image"></xul:image>
        </xul:hbox>
        <xul:label class="ctrlTab-label plain" inherits="value=label" crop="end"></xul:label>
      </xul:vbox>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("mouseover", (event) => { ctrlTab._mouseOverFocus(this); });

    this.addEventListener("command", (event) => { ctrlTab.pick(this); });

    this.addEventListener("click", (event) => { ctrlTab.remove(this); });

  }
}