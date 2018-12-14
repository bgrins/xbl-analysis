/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozPopup extends MozXULElement {
  constructor() {
    super();

    this.addEventListener("popupshowing", (event) => {
      var array = [];
      var width = 0;
      for (var menuitem = this.firstElementChild; menuitem; menuitem = menuitem.nextElementSibling) {
        if (menuitem.localName == "menuitem" && menuitem.hasAttribute("acceltext")) {
          var accel = document.getAnonymousElementByAttribute(menuitem, "anonid", "accel");
          if (accel && accel.boxObject) {
            array.push(accel);
            if (accel.boxObject.width > width)
              width = accel.boxObject.width;
          }
        }
      }
      for (var i = 0; i < array.length; i++)
        array[i].width = width;
    });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <arrowscrollbox class="popup-internal-box" flex="1" orient="vertical" smoothscroll="false">
        <children></children>
      </arrowscrollbox>
    `));

    this.scrollBox = document.getAnonymousElementByAttribute(this, "class", "popup-internal-box");

  }
}

customElements.define("popup", MozPopup);

}
