class FirefoxWindowsRadio extends FirefoxRadio {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox class="radio-check-box1" inherits="selected,checked,disabled">
        <xul:hbox class="radio-check-box2" flex="1">
          <xul:image class="radio-check" inherits="selected,checked,disabled"></xul:image>
        </xul:hbox>
      </xul:hbox>
      <xul:hbox class="radio-label-box" align="center" flex="1">
        <xul:image class="radio-icon" inherits="src"></xul:image>
        <xul:label class="radio-label" inherits="text=label,accesskey,crop" flex="1"></xul:label>
      </xul:hbox>
    `;
  }
}
customElements.define("firefox-windows-radio", FirefoxWindowsRadio);
