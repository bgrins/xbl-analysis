/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozNocontrols extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <div anonid="controlsContainer" class="controlsContainer" role="none" hidden="true">
        <div class="controlsOverlay stackItem">
          <div class="controlsSpacerStack">
            <div anonid="clickToPlay" class="clickToPlay"></div>
          </div>
        </div>
      </div>
    `));

    this.randomID = 0;
    this.Utils = {
      randomID: 0,
      videoEvents: ["play",
        "playing",
        "MozNoControlsBlockedVideo"
      ],
      terminate() {
        for (let event of this.videoEvents) {
          try {
            this.video.removeEventListener(event, this, {
              capture: true,
              mozSystemGroup: true,
            });
          } catch (ex) {}
        }

        try {
          this.clickToPlay.removeEventListener("click", this, { mozSystemGroup: true });
        } catch (ex) {}
      },

      hasError() {
        return (this.video.error != null || this.video.networkState == this.video.NETWORK_NO_SOURCE);
      },

      handleEvent(aEvent) {
        // If the binding is detached (or has been replaced by a
        // newer instance of the binding), nuke our event-listeners.
        if (this.videocontrols.randomID != this.randomID) {
          this.terminate();
          return;
        }

        switch (aEvent.type) {
          case "play":
            this.noControlsOverlay.hidden = true;
            break;
          case "playing":
            this.noControlsOverlay.hidden = true;
            break;
          case "MozNoControlsBlockedVideo":
            this.blockedVideoHandler();
            break;
          case "click":
            this.clickToPlayClickHandler(aEvent);
            break;
        }
      },

      blockedVideoHandler() {
        if (this.videocontrols.randomID != this.randomID) {
          this.terminate();
          return;
        } else if (this.hasError()) {
          this.noControlsOverlay.hidden = true;
          return;
        }
        this.noControlsOverlay.hidden = false;
      },

      clickToPlayClickHandler(e) {
        if (this.videocontrols.randomID != this.randomID) {
          this.terminate();
          return;
        } else if (e.button != 0) {
          return;
        }

        this.noControlsOverlay.hidden = true;
        this.video.play();
      },

      init(binding) {
        this.videocontrols = binding;
        this.randomID = Math.random();
        this.videocontrols.randomID = this.randomID;
        this.video = binding.parentNode;
        this.controlsContainer = document.getAnonymousElementByAttribute(binding, "anonid", "controlsContainer");
        this.clickToPlay = document.getAnonymousElementByAttribute(binding, "anonid", "clickToPlay");
        this.noControlsOverlay = document.getAnonymousElementByAttribute(binding, "anonid", "controlsContainer");

        let isMobile = navigator.appVersion.includes("Android");
        if (isMobile) {
          this.controlsContainer.classList.add("mobile");
        }

        // TODO: Switch to touch controls on touch-based desktops (bug 1447547)
        this.videocontrols.isTouchControls = isMobile;
        if (this.videocontrols.isTouchControls) {
          this.controlsContainer.classList.add("touch");
        }

        this.clickToPlay.addEventListener("click", this, { mozSystemGroup: true });

        for (let event of this.videoEvents) {
          this.video.addEventListener(event, this, {
            capture: true,
            mozSystemGroup: true,
          });
        }
      },
    };
    this.Utils.init(this);
    this.Utils.video.dispatchEvent(new CustomEvent("MozNoControlsVideoBindingAttached"));

    this._setupEventListeners();
  }

  disconnectedCallback() {
    this.Utils.terminate();
    // randomID used to be a <field>, which meant that the XBL machinery
    // undefined the property when the element was unbound. The code in
    // this file actually depends on this, so now that randomID is an
    // expando, we need to make sure to explicitly delete it.
    delete this.randomID;
  }

  _setupEventListeners() {

  }
}

customElements.define("nocontrols", MozNocontrols);

}
