class FirefoxWizardButtons extends FirefoxWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:vbox class="wizard-buttons-box-1" flex="1">
<xul:separator class="wizard-buttons-separator groove">
</xul:separator>
<xul:hbox class="wizard-buttons-box-2">
<xul:button class="wizard-button" dlgtype="extra1" hidden="true">
</xul:button>
<xul:button class="wizard-button" dlgtype="extra2" hidden="true">
</xul:button>
<xul:spacer flex="1" anonid="spacer">
</xul:spacer>
<xul:button label="FROM-DTD-button-back-win-label" accesskey="FROM-DTD-button-back-win-accesskey" class="wizard-button" dlgtype="back" icon="go-back">
</xul:button>
<xul:deck class="wizard-next-deck" anonid="WizardButtonDeck">
<xul:hbox>
<xul:button label="FROM-DTD-button-finish-win-label" class="wizard-button" dlgtype="finish" default="true" flex="1">
</xul:button>
</xul:hbox>
<xul:hbox>
<xul:button label="FROM-DTD-button-next-win-label" accesskey="FROM-DTD-button-next-win-accesskey" class="wizard-button" dlgtype="next" icon="go-forward" default="true" flex="1">
</xul:button>
</xul:hbox>
</xul:deck>
<xul:button label="FROM-DTD-button-cancel-win-label" class="wizard-button" dlgtype="cancel" icon="cancel">
</xul:button>
</xul:hbox>
</xul:vbox>`;
    let comment = document.createComment("Creating firefox-wizard-buttons");
    this.prepend(comment);

    Object.defineProperty(this, "_wizardButtonDeck", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._wizardButtonDeck;
        return (this._wizardButtonDeck = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "WizardButtonDeck"
        ));
      }
    });
  }
  disconnectedCallback() {}

  get defaultButton() {
    const kXULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var buttons = this._wizardButtonDeck.selectedPanel.getElementsByTagNameNS(
      kXULNS,
      "button"
    );
    for (var i = 0; i < buttons.length; i++) {
      if (
        buttons[i].getAttribute("default") == "true" &&
        !buttons[i].hidden &&
        !buttons[i].disabled
      )
        return buttons[i];
    }
    return null;
  }
  onPageChange() {
    if (this.getAttribute("lastpage") == "true") {
      this._wizardButtonDeck.setAttribute("selectedIndex", 0);
    } else {
      this._wizardButtonDeck.setAttribute("selectedIndex", 1);
    }
  }
}
customElements.define("firefox-wizard-buttons", FirefoxWizardButtons);
