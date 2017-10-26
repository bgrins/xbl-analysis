class FirefoxOptionsdialog extends FirefoxDialog {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:hbox flex="1">
        <xul:categoryBox anonid="prefsCategories">
          <children></children>
        </xul:categoryBox>
        <xul:vbox flex="1">
          <xul:dialogheader id="panelHeader"></xul:dialogheader>
          <xul:iframe anonid="panelFrame" name="panelFrame" style="width: 0px;" flex="1"></xul:iframe>
        </xul:vbox>
      </xul:hbox>
    `;
  }
}
customElements.define("firefox-optionsdialog", FirefoxOptionsdialog);
