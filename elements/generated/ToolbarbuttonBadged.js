/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozToolbarbuttonBadged extends MozToolbarbutton {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <stack class="toolbarbutton-badge-stack">
        <children></children>
        <image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor"></image>
        <label class="toolbarbutton-badge" inherits="value=badge,style=badgeStyle" top="0" end="0" crop="none"></label>
      </stack>
      <label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,wrap"></label>
      <label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap"></label>
      <dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" inherits="disabled,label"></dropmarker>
    `));

  }
}

customElements.define("toolbarbutton-badged", MozToolbarbuttonBadged);

}
