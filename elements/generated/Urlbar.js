/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozUrlbar extends MozTextbox {
  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="box"></children>
      <moz-input-box anonid="moz-input-box" tooltip="aHTMLTooltip" class="urlbar-input-box" flex="1">
        <children></children>
        <html:input anonid="scheme" class="urlbar-scheme textbox-input" required="required" inherits="textoverflow,focused"></html:input>
        <html:input anonid="input" class="urlbar-input textbox-input" role="combobox" aria-owns="urlbarView-results" aria-controls="urlbarView-results" aria-autocomplete="both" allowevents="true" inputmode="mozAwesomebar" inherits="value,maxlength,disabled,size,readonly,placeholder,tabindex,accesskey,focused,textoverflow"></html:input>
      </moz-input-box>
      <image anonid="urlbar-go-button" class="urlbar-go-button urlbar-icon" onclick="gURLBar.handleCommand(event);" tooltiptext="FROM-DTD.goEndCap.tooltip;" inherits="pageproxystate,parentfocused=focused,usertyping"></image>
      <dropmarker anonid="historydropmarker" class="urlbar-history-dropmarker urlbar-icon chromeclass-toolbar-additional" tooltiptext="FROM-DTD.urlbar.openHistoryPopup.tooltip;" allowevents="true" inherits="open,parentfocused=focused,usertyping"></dropmarker>
      <children includes="hbox"></children>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

  }
}

customElements.define("urlbar", MozUrlbar);

}
