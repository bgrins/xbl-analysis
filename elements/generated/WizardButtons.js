/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozWizardButtons extends MozXULElement {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <vbox class="wizard-buttons-box-1" flex="1">
        <separator class="wizard-buttons-separator groove"></separator>
        <hbox class="wizard-buttons-box-2">
          <button class="wizard-button" dlgtype="extra1" hidden="true"></button>
          <button class="wizard-button" dlgtype="extra2" hidden="true"></button>
          <spacer flex="1" anonid="spacer"></spacer>
          <button label="FROM-DTD.button-back-win.label;" accesskey="FROM-DTD.button-back-win.accesskey;" class="wizard-button" dlgtype="back"></button>
          <deck class="wizard-next-deck" anonid="WizardButtonDeck">
            <hbox>
              <button label="FROM-DTD.button-finish-win.label;" class="wizard-button" dlgtype="finish" default="true" flex="1"></button>
            </hbox>
            <hbox>
              <button label="FROM-DTD.button-next-win.label;" accesskey="FROM-DTD.button-next-win.accesskey;" class="wizard-button" dlgtype="next" default="true" flex="1"></button>
            </hbox>
          </deck>
          <button label="FROM-DTD.button-cancel-win.label;" class="wizard-button" dlgtype="cancel"></button>
        </hbox>
      </vbox>
    `));

    this._wizardButtonDeck = document.getAnonymousElementByAttribute(this, "anonid", "WizardButtonDeck");

  }

  get defaultButton() {
    const kXULNS =
      "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var buttons = this._wizardButtonDeck.selectedPanel
      .getElementsByTagNameNS(kXULNS, "button");
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].getAttribute("default") == "true" &&
        !buttons[i].hidden && !buttons[i].disabled)
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

customElements.define("wizard-buttons", MozWizardButtons);

}
