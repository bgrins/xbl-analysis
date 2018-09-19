/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTreecols extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="tree-scrollable-columns" flex="1">
        <children includes="treecol|splitter"></children>
      </hbox>
      <treecolpicker class="treecol-image" fixed="true" inherits="tooltiptext=pickertooltiptext"></treecolpicker>
    `));

    // Set resizeafter="farthest" on the splitters if nothing else has been
    // specified.
    Array.forEach(this.getElementsByTagName("splitter"), function(splitter) {
      if (!splitter.hasAttribute("resizeafter"))
        splitter.setAttribute("resizeafter", "farthest");
    });

  }
}

customElements.define("treecols", MozTreecols);

}
