class FirefoxCheckboxWithSpacing extends FirefoxCheckbox {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox class="checkbox-spacer-box">
        <xul:image class="checkbox-check" inherits="checked,disabled"></xul:image>
      </xul:hbox>
      <xul:hbox class="checkbox-label-center-box" flex="1">
        <xul:hbox class="checkbox-label-box" flex="1">
          <xul:image class="checkbox-icon" inherits="src"></xul:image>
          <xul:label class="checkbox-label" inherits="text=label,accesskey,crop" flex="1"></xul:label>
        </xul:hbox>
      </xul:hbox>
    `;
  }
}
customElements.define(
  "firefox-checkbox-with-spacing",
  FirefoxCheckboxWithSpacing
);
