class FirefoxNocontrols extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<vbox flex="1" class="statusOverlay" hidden="true">
<box flex="1">
<box class="clickToPlay" flex="1">
</box>
</box>
</vbox>`;
    let comment = document.createComment("Creating firefox-nocontrols");
    this.prepend(comment);

    try {
      this.randomID = 0;
      this.Utils = {
        randomID: 0,
        videoEvents: ["play", "playing"],
        controlListeners: [],
        terminateEventListeners() {
          for (let event of this.videoEvents) {
            try {
              this.video.removeEventListener(event, this, {
                mozSystemGroup: true
              });
            } catch (ex) {}
          }

          for (let element of this.controlListeners) {
            try {
              element.item.removeEventListener(element.event, element.func, {
                mozSystemGroup: true
              });
            } catch (ex) {}
          }

          delete this.controlListeners;
        },

        hasError() {
          return (
            this.video.error != null ||
            this.video.networkState == this.video.NETWORK_NO_SOURCE
          );
        },

        handleEvent(aEvent) {
          // If the binding is detached (or has been replaced by a
          // newer instance of the binding), nuke our event-listeners.
          if (this.binding.randomID != this.randomID) {
            this.terminateEventListeners();
            return;
          }

          switch (aEvent.type) {
            case "play":
              this.noControlsOverlay.hidden = true;
              break;
            case "playing":
              this.noControlsOverlay.hidden = true;
              break;
          }
        },

        blockedVideoHandler() {
          if (this.binding.randomID != this.randomID) {
            this.terminateEventListeners();
            return;
          } else if (this.hasError()) {
            this.noControlsOverlay.hidden = true;
            return;
          }
          this.noControlsOverlay.hidden = false;
        },

        clickToPlayClickHandler(e) {
          if (this.binding.randomID != this.randomID) {
            this.terminateEventListeners();
            return;
          } else if (e.button != 0) {
            return;
          }

          this.noControlsOverlay.hidden = true;
          this.video.play();
        },

        init(binding) {
          this.binding = binding;
          this.randomID = Math.random();
          this.binding.randomID = this.randomID;
          this.video = binding.parentNode;
          this.clickToPlay = document.getAnonymousElementByAttribute(
            binding,
            "class",
            "clickToPlay"
          );
          this.noControlsOverlay = document.getAnonymousElementByAttribute(
            binding,
            "class",
            "statusOverlay"
          );

          let self = this;
          function addListener(elem, eventName, func) {
            let boundFunc = func.bind(self);
            self.controlListeners.push({
              item: elem,
              event: eventName,
              func: boundFunc
            });
            elem.addEventListener(eventName, boundFunc, {
              mozSystemGroup: true
            });
          }
          addListener(this.clickToPlay, "click", this.clickToPlayClickHandler);
          addListener(
            this.video,
            "MozNoControlsBlockedVideo",
            this.blockedVideoHandler
          );

          for (let event of this.videoEvents) {
            this.video.addEventListener(event, this, { mozSystemGroup: true });
          }

          if (this.video.autoplay && !this.video.mozAutoplayEnabled) {
            this.blockedVideoHandler();
          }
        }
      };
      this.Utils.init(this);
      this.Utils.video.dispatchEvent(
        new CustomEvent("MozNoControlsVideoBindingAttached")
      );
    } catch (e) {}
  }
  disconnectedCallback() {
    try {
      this.Utils.terminateEventListeners();
      // randomID used to be a <field>, which meant that the XBL machinery
      // undefined the property when the element was unbound. The code in
      // this file actually depends on this, so now that randomID is an
      // expando, we need to make sure to explicitly delete it.
      delete this.randomID;
    } catch (e) {}
  }
}
customElements.define("firefox-nocontrols", FirefoxNocontrols);
