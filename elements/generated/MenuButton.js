/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozMenuButton extends MozMenuButtonBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <button class="box-inherit button-menubutton-button" anonid="button" flex="1" allowevents="true" inherits="disabled,crop,image,label,accesskey,command,
                                buttonover,buttondown,align,dir,pack,orient">
        <children></children>
      </button>
      <dropmarker class="button-menubutton-dropmarker" inherits="open,disabled,label"></dropmarker>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}

customElements.define("menu-button", MozMenuButton);

}
