class FirefoxTouchcontrols extends FirefoxVideocontrols {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <stack flex="1">
        <vbox anonid="statusOverlay" flex="1" class="statusOverlay" hidden="true">
          <box anonid="statusIcon" class="statusIcon"></box>
          <label class="errorLabel" anonid="errorAborted"></label>
          <label class="errorLabel" anonid="errorNetwork"></label>
          <label class="errorLabel" anonid="errorDecode"></label>
          <label class="errorLabel" anonid="errorSrcNotSupported"></label>
          <label class="errorLabel" anonid="errorNoSource"></label>
          <label class="errorLabel" anonid="errorGeneric"></label>
        </vbox>
        <vbox anonid="controlsOverlay" class="controlsOverlay">
          <spacer anonid="controlsSpacer" class="controlsSpacer" flex="1"></spacer>
          <box flex="1" hidden="true">
            <box anonid="clickToPlay" class="clickToPlay" hidden="true" flex="1"></box>
            <vbox anonid="textTrackList" class="textTrackList" hidden="true" offlabel="FROM-DTD-closedCaption-off"></vbox>
          </box>
          <vbox anonid="controlBar" class="controlBar" hidden="true">
            <hbox class="buttonsBar">
              <button anonid="playButton" class="playButton" playlabel="FROM-DTD-playButton-playLabel" pauselabel="FROM-DTD-playButton-pauseLabel"></button>
              <label anonid="positionLabel" class="positionLabel" role="presentation"></label>
              <stack anonid="scrubberStack" class="scrubberStack">
                <box class="backgroundBar"></box>
                <progressmeter class="flexibleBar" value="100"></progressmeter>
                <progressmeter anonid="bufferBar" class="bufferBar"></progressmeter>
                <progressmeter anonid="progressBar" class="progressBar" max="10000"></progressmeter>
                <scale anonid="scrubber" class="scrubber" movetoclick="true"></scale>
              </stack>
              <label anonid="durationLabel" class="durationLabel" role="presentation"></label>
              <button anonid="muteButton" class="muteButton" mutelabel="FROM-DTD-muteButton-muteLabel" unmutelabel="FROM-DTD-muteButton-unmuteLabel"></button>
              <stack anonid="volumeStack" class="volumeStack">
                <box anonid="volumeBackground" class="volumeBackground"></box>
                <box anonid="volumeForeground" class="volumeForeground"></box>
                <scale anonid="volumeControl" class="volumeControl" movetoclick="true"></scale>
              </stack>
              <button anonid="castingButton" class="castingButton" hidden="true" aria-label="FROM-DTD-castingButton-castingLabel"></button>
              <button anonid="closedCaptionButton" class="closedCaptionButton" hidden="true"></button>
              <button anonid="fullscreenButton" class="fullscreenButton" enterfullscreenlabel="FROM-DTD-fullscreenButton-enterfullscreenlabel" exitfullscreenlabel="FROM-DTD-fullscreenButton-exitfullscreenlabel"></button>
            </hbox>
          </vbox>
        </vbox>
      </stack>
    `;

    this.isTouchControls = true;
    this.TouchUtils = {
      videocontrols: null,
      video: null,
      controlsTimer: null,
      controlsTimeout: 5000,
      positionLabel: null,
      castingButton: null,

      get Utils() {
        return this.videocontrols.Utils;
      },

      get visible() {
        return !this.Utils.controlBar.hasAttribute("fadeout") &&
          !(this.Utils.controlBar.getAttribute("hidden") == "true");
      },

      _firstShow: false,
      get firstShow() {
        return this._firstShow;
      },
      set firstShow(val) {
        this._firstShow = val;
        this.Utils.controlBar.setAttribute("firstshow", val);
      },

      toggleControls() {
        if (!this.Utils.dynamicControls || !this.visible) {
          this.showControls();
        } else {
          this.delayHideControls(0);
        }
      },

      showControls() {
        if (this.Utils.dynamicControls) {
          this.Utils.startFadeIn(this.Utils.controlBar);
          this.delayHideControls(this.controlsTimeout);
        }
      },

      clearTimer() {
        if (this.controlsTimer) {
          clearTimeout(this.controlsTimer);
          this.controlsTimer = null;
        }
      },

      delayHideControls(aTimeout) {
        this.clearTimer();
        let self = this;
        this.controlsTimer = setTimeout(function() {
          self.hideControls();
        }, aTimeout);
      },

      hideControls() {
        if (!this.Utils.dynamicControls) {
          return;
        }
        this.Utils.startFadeOut(this.Utils.controlBar);
        if (this.firstShow) {
          this.videocontrols.addEventListener("transitionend", this);
        }
      },

      handleEvent(aEvent) {
        if (aEvent.type == "transitionend") {
          this.firstShow = false;
          try {
            this.videocontrols.removeEventListener("transitionend", this);
          } catch (ex) {}
          return;
        }

        if (this.videocontrols.randomID != this.Utils.randomID) {
          this.terminateEventListeners();
        }
      },

      terminateEventListeners() {
        for (var event of this.videoEvents) {
          try {
            this.Utils.video.removeEventListener(event, this);
          } catch (ex) {}
        }
      },

      isVideoCasting() {
        return this.video.mozIsCasting;
      },

      updateCasting(eventDetail) {
        let castingData = JSON.parse(eventDetail);
        if ("allow" in castingData) {
          this.video.mozAllowCasting = !!castingData.allow;
        }

        if ("active" in castingData) {
          this.video.mozIsCasting = !!castingData.active;
        }
        this.setCastButtonState();
      },

      startCasting() {
        this.videocontrols.dispatchEvent(new CustomEvent("VideoBindingCast"));
      },

      setCastButtonState() {
        if (this.isAudioOnly || !this.video.mozAllowCasting) {
          this.castingButton.hidden = true;
          return;
        }

        if (this.video.mozIsCasting) {
          this.castingButton.setAttribute("active", "true");
        } else {
          this.castingButton.removeAttribute("active");
        }

        this.castingButton.hidden = false;
      },

      init(binding) {
        this.videocontrols = binding;
        this.video = binding.parentNode;

        let self = this;
        this.Utils.playButton.addEventListener("command", function() {
          if (!self.video.paused) {
            self.delayHideControls(0);
          } else {
            self.showControls();
          }
        });
        this.Utils.scrubber.addEventListener("touchstart", function() {
          self.clearTimer();
        });
        this.Utils.scrubber.addEventListener("touchend", function() {
          self.delayHideControls(self.controlsTimeout);
        });
        this.Utils.muteButton.addEventListener("click", function() {
          self.delayHideControls(self.controlsTimeout);
        });

        this.castingButton = document.getAnonymousElementByAttribute(binding, "anonid", "castingButton");
        this.castingButton.addEventListener("command", function() {
          self.startCasting();
        });

        this.video.addEventListener("media-videoCasting", function(e) {
          if (!e.isTrusted) {
            return;
          }
          self.updateCasting(e.detail);
        }, false, true);

        // The first time the controls appear we want to just display
        // a play button that does not fade away. The firstShow property
        // makes that happen. But because of bug 718107 this init() method
        // may be called again when we switch in or out of fullscreen
        // mode. So we only set firstShow if we're not autoplaying and
        // if we are at the beginning of the video and not already playing
        if (!this.video.autoplay && this.Utils.dynamicControls && this.video.paused &&
          this.video.currentTime === 0) {
          this.firstShow = true;
        }

        // If the video is not at the start, then we probably just
        // transitioned into or out of fullscreen mode, and we don't want
        // the controls to remain visible. this.controlsTimeout is a full
        // 5s, which feels too long after the transition.
        if (this.video.currentTime !== 0) {
          this.delayHideControls(this.Utils.HIDE_CONTROLS_TIMEOUT_MS);
        }
      }
    };

    this.TouchUtils.init(this);
    this.dispatchEvent(new CustomEvent("VideoBindingAttached"));

    this.setupHandlers();
  }

  disconnectedCallback() {
    // XBL destructors don't appear to be inherited properly, so we need
    // to do this here in addition to the videoControls destructor. :-(
    delete this.randomID;
  }

  setupHandlers() {

    this.addEventListener("mouseup", (event) => {
      if (event.originalTarget.nodeName == "vbox") {
        if (this.TouchUtils.firstShow) {
          this.Utils.video.play();
        }
        this.TouchUtils.toggleControls();
      }
    });

  }
}