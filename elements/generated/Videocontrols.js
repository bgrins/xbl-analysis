class FirefoxVideocontrols extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <div anonid="controlsContainer" class="controlsContainer" role="none">
        <div anonid="statusOverlay" class="statusOverlay stackItem" hidden="true">
          <div anonid="statusIcon" class="statusIcon"></div>
          <span class="errorLabel" anonid="errorAborted"></span>
          <span class="errorLabel" anonid="errorNetwork"></span>
          <span class="errorLabel" anonid="errorDecode"></span>
          <span class="errorLabel" anonid="errorSrcNotSupported"></span>
          <span class="errorLabel" anonid="errorNoSource"></span>
          <span class="errorLabel" anonid="errorGeneric"></span>
        </div>
        <div anonid="controlsOverlay" class="controlsOverlay stackItem">
          <div class="controlsSpacerStack">
            <div anonid="controlsSpacer" class="controlsSpacer stackItem" role="none"></div>
            <div anonid="clickToPlay" class="clickToPlay" hidden="true"></div>
          </div>
          <div anonid="controlBar" class="controlBar" hidden="true">
            <button anonid="playButton" class="playButton" playlabel="FROM-DTD-playButton-playLabel" pauselabel="FROM-DTD-playButton-pauseLabel" tabindex="-1"></button>
            <div anonid="scrubberStack" class="scrubberStack progressContainer" role="none">
              <div class="progressBackgroundBar stackItem" role="none">
                <div class="progressStack" role="none">
                  <progress anonid="bufferBar" class="bufferBar" value="0" max="100" tabindex="-1"></progress>
                  <progress anonid="progressBar" class="progressBar" value="0" max="100" tabindex="-1"></progress>
                </div>
              </div>
              <input type="range" anonid="scrubber" class="scrubber" tabindex="-1" mozinputrangeignorepreventdefault="true"></input>
            </div>
            <span anonid="positionLabel" class="positionLabel" role="presentation"></span>
            <span anonid="durationLabel" class="durationLabel" role="presentation"></span>
            <span anonid="positionDurationBox" class="positionDurationBox" aria-hidden="true"></span>
            <div anonid="controlBarSpacer" class="controlBarSpacer" hidden="true" role="none"></div>
            <button anonid="muteButton" class="muteButton" mutelabel="FROM-DTD-muteButton-muteLabel" unmutelabel="FROM-DTD-muteButton-unmuteLabel" tabindex="-1"></button>
            <div anonid="volumeStack" class="volumeStack progressContainer" role="none">
              <input type="range" anonid="volumeControl" class="volumeControl" min="0" max="100" step="1" tabindex="-1" mozinputrangeignorepreventdefault="true"></input>
            </div>
            <button anonid="closedCaptionButton" class="closedCaptionButton"></button>
            <button anonid="fullscreenButton" class="fullscreenButton" enterfullscreenlabel="FROM-DTD-fullscreenButton-enterfullscreenlabel" exitfullscreenlabel="FROM-DTD-fullscreenButton-exitfullscreenlabel"></button>
          </div>
          <div anonid="textTrackList" class="textTrackList" hidden="true" offlabel="FROM-DTD-closedCaption-off"></div>
        </div>
      </div>
    `;

    this.isTouchControls = false;
    this.randomID = 0;

    this.Utils = {
      debug: false,
      video: null,
      videocontrols: null,
      controlBar: null,
      playButton: null,
      muteButton: null,
      volumeControl: null,
      durationLabel: null,
      positionLabel: null,
      scrubber: null,
      progressBar: null,
      bufferBar: null,
      statusOverlay: null,
      controlsSpacer: null,
      clickToPlay: null,
      controlsOverlay: null,
      fullscreenButton: null,
      layoutControls: null,

      textTracksCount: 0,
      randomID: 0,
      videoEvents: [
        "play",
        "pause",
        "ended",
        "volumechange",
        "loadeddata",
        "loadstart",
        "timeupdate",
        "progress",
        "playing",
        "waiting",
        "canplay",
        "canplaythrough",
        "seeking",
        "seeked",
        "emptied",
        "loadedmetadata",
        "error",
        "suspend",
        "stalled",
        "mozvideoonlyseekbegin",
        "mozvideoonlyseekcompleted"
      ],

      showHours: false,
      firstFrameShown: false,
      timeUpdateCount: 0,
      maxCurrentTimeSeen: 0,
      isPausedByDragging: false,
      _isAudioOnly: false,

      get isAudioOnly() {
        return this._isAudioOnly;
      },
      set isAudioOnly(val) {
        this._isAudioOnly = val;
        this.setFullscreenButtonState();

        if (!this.isTopLevelSyntheticDocument) {
          return;
        }
        if (this._isAudioOnly) {
          this.video.style.height = this.controlBarMinHeight + "px";
          this.video.style.width = "66%";
        } else {
          this.video.style.removeProperty("height");
          this.video.style.removeProperty("width");
        }
      },

      get isControlBarHidden() {
        return (
          this.controlBar.hidden ||
          this.controlBar.hideByAdjustment ||
          this.controlBar.getAttribute("fadeout") === "true"
        );
      },

      suppressError: false,

      setupStatusFader(immediate) {
        // Since the play button will be showing, we don't want to
        // show the throbber behind it. The throbber here will
        // only show if needed after the play button has been pressed.
        if (!this.clickToPlay.hidden) {
          this.startFadeOut(this.statusOverlay, true);
          return;
        }

        var show = false;
        if (
          this.video.seeking ||
          (this.video.error && !this.suppressError) ||
          this.video.networkState == this.video.NETWORK_NO_SOURCE ||
          (this.video.networkState == this.video.NETWORK_LOADING &&
            (this.video.paused || this.video.ended
              ? this.video.readyState < this.video.HAVE_CURRENT_DATA
              : this.video.readyState < this.video.HAVE_FUTURE_DATA)) ||
          (this.timeUpdateCount <= 1 &&
            !this.video.ended &&
            this.video.readyState < this.video.HAVE_FUTURE_DATA &&
            this.video.networkState == this.video.NETWORK_LOADING)
        ) {
          show = true;
        }

        // Explicitly hide the status fader if this
        // is audio only until bug 619421 is fixed.
        if (this.isAudioOnly) {
          show = false;
        }

        if (this._showThrobberTimer) {
          show = true;
        }

        this.log(
          "Status overlay: seeking=" +
            this.video.seeking +
            " error=" +
            this.video.error +
            " readyState=" +
            this.video.readyState +
            " paused=" +
            this.video.paused +
            " ended=" +
            this.video.ended +
            " networkState=" +
            this.video.networkState +
            " timeUpdateCount=" +
            this.timeUpdateCount +
            " _showThrobberTimer=" +
            this._showThrobberTimer +
            " --> " +
            (show ? "SHOW" : "HIDE")
        );
        this.startFade(this.statusOverlay, show, immediate);
      },

      /*
      * Set the initial state of the controls. The binding is normally created along
      * with video element, but could be attached at any point (eg, if the video is
      * removed from the document and then reinserted). Thus, some one-time events may
      * have already fired, and so we'll need to explicitly check the initial state.
      */
      setupInitialState() {
        this.randomID = Math.random();
        this.videocontrols.randomID = this.randomID;

        this.setPlayButtonState(this.video.paused);

        this.setFullscreenButtonState();

        var duration = Math.round(this.video.duration * 1000); // in ms
        var currentTime = Math.round(this.video.currentTime * 1000); // in ms
        this.log(
          "Initial playback position is at " + currentTime + " of " + duration
        );
        // It would be nice to retain maxCurrentTimeSeen, but it would be difficult
        // to determine if the media source changed while we were detached.
        this.initPositionDurationBox();
        this.maxCurrentTimeSeen = currentTime;
        this.showPosition(currentTime, duration);

        // If we have metadata, check if this is a <video> without
        // video data, or a video with no audio track.
        if (this.video.readyState >= this.video.HAVE_METADATA) {
          if (
            this.video instanceof HTMLVideoElement &&
            (this.video.videoWidth == 0 || this.video.videoHeight == 0)
          ) {
            this.isAudioOnly = true;
          }

          // We have to check again if the media has audio here,
          // because of bug 718107: switching to fullscreen may
          // cause the bindings to detach and reattach, hence
          // unsetting the attribute.
          if (!this.isAudioOnly && !this.video.mozHasAudio) {
            this.muteButton.setAttribute("noAudio", "true");
            this.muteButton.setAttribute("disabled", "true");
          }
        }

        if (this.isAudioOnly) {
          this.clickToPlay.hidden = true;
        }

        // If the first frame hasn't loaded, kick off a throbber fade-in.
        if (this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
          this.firstFrameShown = true;
        }

        // We can't determine the exact buffering status, but do know if it's
        // fully loaded. (If it's still loading, it will fire a progress event
        // and we'll figure out the exact state then.)
        this.bufferBar.max = 100;
        if (this.video.readyState >= this.video.HAVE_METADATA) {
          this.showBuffered();
        } else {
          this.bufferBar.value = 0;
        }

        // Set the current status icon.
        if (this.hasError()) {
          this.clickToPlay.hidden = true;
          this.statusIcon.setAttribute("type", "error");
          this.updateErrorText();
          this.setupStatusFader(true);
        }

        let adjustableControls = [
          ...this.prioritizedControls,
          this.controlBar,
          this.clickToPlay
        ];

        for (let control of adjustableControls) {
          if (!control) {
            break;
          }

          Object.defineProperties(control, {
            // We should directly access CSSOM to get pre-defined style instead of
            // retrieving computed dimensions from layout.
            minWidth: {
              get: () => {
                let controlAnonId = control.getAttribute("anonid");
                let propertyName = `--${controlAnonId}-width`;
                if (control.modifier) {
                  propertyName += "-" + control.modifier;
                }
                let preDefinedSize = this.controlBarComputedStyles.getPropertyValue(
                  propertyName
                );

                return parseInt(preDefinedSize, 10);
              }
            },
            isAdjustableControl: {
              value: true
            },
            modifier: {
              value: "",
              writable: true
            },
            isWanted: {
              value: true,
              writable: true
            },
            hideByAdjustment: {
              set: v => {
                if (v) {
                  control.setAttribute("hidden", "true");
                } else {
                  control.removeAttribute("hidden");
                }

                control._isHiddenByAdjustment = v;
              },
              get: () => control._isHiddenByAdjustment
            },
            _isHiddenByAdjustment: {
              value: false,
              writable: true
            }
          });
        }
        this.adjustControlSize();

        // Can only update the volume controls once we've computed
        // _volumeControlWidth, since the volume slider implementation
        // depends on it.
        this.updateVolumeControls();
      },

      setupNewLoadState() {
        // videocontrols.css hides the control bar by default, because if script
        // is disabled our binding's script is disabled too (bug 449358). Thus,
        // the controls are broken and we don't want them shown. But if script is
        // enabled, the code here will run and can explicitly unhide the controls.
        //
        // For videos with |autoplay| set, we'll leave the controls initially hidden,
        // so that they don't get in the way of the playing video. Otherwise we'll
        // go ahead and reveal the controls now, so they're an obvious user cue.
        //
        // (Note: the |controls| attribute is already handled via layout/style/html.css)
        var shouldShow =
          !this.dynamicControls || (this.video.paused && !this.video.autoplay);
        // Hide the overlay if the video time is non-zero or if an error occurred to workaround bug 718107.
        let shouldClickToPlayShow =
          shouldShow &&
          !this.isAudioOnly &&
          this.video.currentTime == 0 &&
          !this.hasError();
        this.startFade(this.clickToPlay, shouldClickToPlayShow, true);
        this.startFade(this.controlsSpacer, shouldClickToPlayShow, true);
        this.startFade(this.controlBar, shouldShow, true);
      },

      get dynamicControls() {
        // Don't fade controls for <audio> elements.
        var enabled = !this.isAudioOnly;

        // Allow tests to explicitly suppress the fading of controls.
        if (this.video.hasAttribute("mozNoDynamicControls")) {
          enabled = false;
        }

        // If the video hits an error, suppress controls if it
        // hasn't managed to do anything else yet.
        if (!this.firstFrameShown && this.hasError()) {
          enabled = false;
        }

        return enabled;
      },

      updateVolume() {
        const volume = this.volumeControl.value;
        this.setVolume(volume / 100);
      },

      updateVolumeControls() {
        var volume = this.video.muted ? 0 : this.video.volume;
        var volumePercentage = Math.round(volume * 100);
        this.updateMuteButtonState();
        this.volumeControl.value = volumePercentage;
      },

      /*
       * We suspend a video element's video decoder if the video
       * element is invisible. However, resuming the video decoder
       * takes time and we show the throbber UI if it takes more than
       * 250 ms.
       *
       * When an already-suspended video element becomes visible, we
       * resume its video decoder immediately and queue a video-only seek
       * task to seek the resumed video decoder to the current position;
       * meanwhile, we also file a "mozvideoonlyseekbegin" event which
       * we used to start the timer here.
       *
       * Once the queued seek operation is done, we dispatch a
       * "canplay" event which indicates that the resuming operation
       * is completed.
       */
      SHOW_THROBBER_TIMEOUT_MS: 250,
      _showThrobberTimer: null,
      _delayShowThrobberWhileResumingVideoDecoder() {
        this._showThrobberTimer = setTimeout(() => {
          this.statusIcon.setAttribute("type", "throbber");
          // Show the throbber immediately since we have waited for SHOW_THROBBER_TIMEOUT_MS.
          // We don't want to wait for another transition-delay(750ms) and the
          // transition-duration(300ms).
          this.setupStatusFader(true);
        }, this.SHOW_THROBBER_TIMEOUT_MS);
      },
      _cancelShowThrobberWhileResumingVideoDecoder() {
        if (this._showThrobberTimer) {
          clearTimeout(this._showThrobberTimer);
          this._showThrobberTimer = null;
        }
      },

      handleEvent(aEvent) {
        this.log("Got media event ----> " + aEvent.type);

        // If the binding is detached (or has been replaced by a
        // newer instance of the binding), nuke our event-listeners.
        if (this.videocontrols.randomID != this.randomID) {
          this.terminateEventListeners();
          return;
        }

        switch (aEvent.type) {
          case "play":
            this.setPlayButtonState(false);
            this.setupStatusFader();
            if (
              !this._triggeredByControls &&
              this.dynamicControls &&
              this.videocontrols.isTouchControls
            ) {
              this.startFadeOut(this.controlBar);
            }
            if (!this._triggeredByControls) {
              this.clickToPlay.hidden = true;
              this.controlsSpacer.setAttribute("fadeout", "true");
            }
            this._triggeredByControls = false;
            break;
          case "pause":
            // Little white lie: if we've internally paused the video
            // while dragging the scrubber, don't change the button state.
            if (!this.scrubber.isDragging) {
              this.setPlayButtonState(true);
            }
            this.setupStatusFader();
            break;
          case "ended":
            this.setPlayButtonState(true);
            // We throttle timechange events, so the thumb might not be
            // exactly at the end when the video finishes.
            this.showPosition(
              Math.round(this.video.currentTime * 1000),
              Math.round(this.video.duration * 1000)
            );
            this.startFadeIn(this.controlBar);
            this.setupStatusFader();
            break;
          case "volumechange":
            this.updateVolumeControls();
            // Show the controls to highlight the changing volume,
            // but only if the click-to-play overlay has already
            // been hidden (we don't hide controls when the overlay is visible).
            if (this.clickToPlay.hidden && !this.isAudioOnly) {
              this.startFadeIn(this.controlBar);
              clearTimeout(this._hideControlsTimeout);
              this._hideControlsTimeout = setTimeout(
                this._hideControlsFn,
                this.HIDE_CONTROLS_TIMEOUT_MS
              );
            }
            break;
          case "loadedmetadata":
            // If a <video> doesn't have any video data, treat it as <audio>
            // and show the controls (they won't fade back out)
            if (
              this.video instanceof HTMLVideoElement &&
              (this.video.videoWidth == 0 || this.video.videoHeight == 0)
            ) {
              this.isAudioOnly = true;
              this.clickToPlay.hidden = true;
              this.startFadeIn(this.controlBar);
              this.setFullscreenButtonState();
            }
            this.showPosition(
              Math.round(this.video.currentTime * 1000),
              Math.round(this.video.duration * 1000)
            );
            if (!this.isAudioOnly && !this.video.mozHasAudio) {
              this.muteButton.setAttribute("noAudio", "true");
              this.muteButton.setAttribute("disabled", "true");
            }
            this.adjustControlSize();
            break;
          case "loadeddata":
            this.firstFrameShown = true;
            this.setupStatusFader();
            break;
          case "loadstart":
            this.maxCurrentTimeSeen = 0;
            this.controlsSpacer.removeAttribute("aria-label");
            this.statusOverlay.removeAttribute("error");
            this.statusIcon.setAttribute("type", "throbber");
            this.isAudioOnly = this.video instanceof HTMLAudioElement;
            this.setPlayButtonState(true);
            this.setupNewLoadState();
            this.setupStatusFader();
            break;
          case "progress":
            this.statusIcon.removeAttribute("stalled");
            this.showBuffered();
            this.setupStatusFader();
            break;
          case "stalled":
            this.statusIcon.setAttribute("stalled", "true");
            this.statusIcon.setAttribute("type", "throbber");
            this.setupStatusFader();
            break;
          case "suspend":
            this.setupStatusFader();
            break;
          case "timeupdate":
            var currentTime = Math.round(this.video.currentTime * 1000); // in ms
            var duration = Math.round(this.video.duration * 1000); // in ms

            // If playing/seeking after the video ended, we won't get a "play"
            // event, so update the button state here.
            if (!this.video.paused) {
              this.setPlayButtonState(false);
            }

            this.timeUpdateCount++;
            // Whether we show the statusOverlay sometimes depends
            // on whether we've seen more than one timeupdate
            // event (if we haven't, there hasn't been any
            // "playback activity" and we may wish to show the
            // statusOverlay while we wait for HAVE_ENOUGH_DATA).
            // If we've seen more than 2 timeupdate events,
            // the count is no longer relevant to setupStatusFader.
            if (this.timeUpdateCount <= 2) {
              this.setupStatusFader();
            }

            // If the user is dragging the scrubber ignore the delayed seek
            // responses (don't yank the thumb away from the user)
            if (this.scrubber.isDragging) {
              return;
            }
            this.showPosition(currentTime, duration);
            this.showBuffered();
            break;
          case "emptied":
            this.bufferBar.value = 0;
            this.showPosition(0, 0);
            break;
          case "seeking":
            this.showBuffered();
            this.statusIcon.setAttribute("type", "throbber");
            this.setupStatusFader();
            break;
          case "waiting":
            this.statusIcon.setAttribute("type", "throbber");
            this.setupStatusFader();
            break;
          case "seeked":
          case "playing":
          case "canplay":
          case "canplaythrough":
            this.setupStatusFader();
            break;
          case "error":
            // We'll show the error status icon when we receive an error event
            // under either of the following conditions:
            // 1. The video has its error attribute set; this means we're loading
            //    from our src attribute, and the load failed, or we we're loading
            //    from source children and the decode or playback failed after we
            //    determined our selected resource was playable.
            // 2. The video's networkState is NETWORK_NO_SOURCE. This means we we're
            //    loading from child source elements, but we were unable to select
            //    any of the child elements for playback during resource selection.
            if (this.hasError()) {
              this.suppressError = false;
              this.clickToPlay.hidden = true;
              this.statusIcon.setAttribute("type", "error");
              this.updateErrorText();
              this.setupStatusFader(true);
              // If video hasn't shown anything yet, disable the controls.
              if (!this.firstFrameShown && !this.isAudioOnly) {
                this.startFadeOut(this.controlBar);
              }
              this.controlsSpacer.removeAttribute("hideCursor");
            }
            break;
          case "mozvideoonlyseekbegin":
            this._delayShowThrobberWhileResumingVideoDecoder();
            break;
          case "mozvideoonlyseekcompleted":
            this._cancelShowThrobberWhileResumingVideoDecoder();
            this.setupStatusFader();
            break;
          default:
            this.log("!!! event " + aEvent.type + " not handled!");
        }
      },

      terminateEventListeners() {
        if (this.videoEvents) {
          for (let event of this.videoEvents) {
            try {
              this.video.removeEventListener(event, this, {
                capture: true,
                mozSystemGroup: true
              });
            } catch (ex) {}
          }
        }

        if (this.controlListeners) {
          for (let element of this.controlListeners) {
            try {
              element.item.removeEventListener(element.event, element.func, {
                mozSystemGroup: element.mozSystemGroup,
                capture: element.capture
              });
            } catch (ex) {}
          }

          delete this.controlListeners;
        }

        this.log("--- videocontrols terminated ---");
      },

      hasError() {
        // We either have an explicit error, or the resource selection
        // algorithm is running and we've tried to load something and failed.
        // Note: we don't consider the case where we've tried to load but
        // there's no sources to load as an error condition, as sites may
        // do this intentionally to work around requires-user-interaction to
        // play restrictions, and we don't want to display a debug message
        // if that's the case.
        return (
          this.video.error != null ||
          (this.video.networkState == this.video.NETWORK_NO_SOURCE &&
            this.hasSources())
        );
      },

      hasSources() {
        if (
          this.video.hasAttribute("src") &&
          this.video.getAttribute("src") !== ""
        ) {
          return true;
        }
        for (
          var child = this.video.firstChild;
          child !== null;
          child = child.nextElementSibling
        ) {
          if (child instanceof HTMLSourceElement) {
            return true;
          }
        }
        return false;
      },

      updateErrorText() {
        let error;
        let v = this.video;
        // It is possible to have both v.networkState == NETWORK_NO_SOURCE
        // as well as v.error being non-null. In this case, we will show
        // the v.error.code instead of the v.networkState error.
        if (v.error) {
          switch (v.error.code) {
            case v.error.MEDIA_ERR_ABORTED:
              error = "errorAborted";
              break;
            case v.error.MEDIA_ERR_NETWORK:
              error = "errorNetwork";
              break;
            case v.error.MEDIA_ERR_DECODE:
              error = "errorDecode";
              break;
            case v.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              error = v.networkState == v.NETWORK_NO_SOURCE
                ? "errorNoSource"
                : "errorSrcNotSupported";
              break;
            default:
              error = "errorGeneric";
              break;
          }
        } else if (v.networkState == v.NETWORK_NO_SOURCE) {
          error = "errorNoSource";
        } else {
          return; // No error found.
        }

        let label = document.getAnonymousElementByAttribute(
          this.videocontrols,
          "anonid",
          error
        );
        this.controlsSpacer.setAttribute("aria-label", label.textContent);
        this.statusOverlay.setAttribute("error", error);
      },

      formatTime(aTime, showHours = false) {
        // Format the duration as "h:mm:ss" or "m:ss"
        aTime = Math.round(aTime / 1000);
        let hours = Math.floor(aTime / 3600);
        let mins = Math.floor(aTime % 3600 / 60);
        let secs = Math.floor(aTime % 60);
        let timeString;
        if (secs < 10) {
          secs = "0" + secs;
        }
        if (hours || showHours) {
          if (mins < 10) {
            mins = "0" + mins;
          }
          timeString = hours + ":" + mins + ":" + secs;
        } else {
          timeString = mins + ":" + secs;
        }
        return timeString;
      },

      initPositionDurationBox() {
        if (this.videocontrols.isTouchControls) {
          return;
        }

        const positionTextNode = Array.prototype.find.call(
          this.positionDurationBox.childNodes,
          n => !!~n.textContent.search("#1")
        );
        const durationSpan = this.durationSpan;
        const durationFormat = durationSpan.textContent;
        const positionFormat = positionTextNode.textContent;

        durationSpan.classList.add("duration");
        durationSpan.setAttribute("role", "none");
        durationSpan.setAttribute("anonid", "durationSpan");

        Object.defineProperties(this.positionDurationBox, {
          durationSpan: {
            value: durationSpan
          },
          position: {
            set: v => {
              positionTextNode.textContent = positionFormat.replace("#1", v);
            }
          },
          duration: {
            set: v => {
              durationSpan.textContent = v
                ? durationFormat.replace("#2", v)
                : "";
            }
          }
        });
      },

      showDuration(duration) {
        let isInfinite = duration == Infinity;
        this.log("Duration is " + duration + "ms.\n");

        if (isNaN(duration) || isInfinite) {
          duration = this.maxCurrentTimeSeen;
        }

        // If the duration is over an hour, thumb should show h:mm:ss instead of mm:ss
        this.showHours = duration >= 3600000;

        // Format the duration as "h:mm:ss" or "m:ss"
        let timeString = isInfinite ? "" : this.formatTime(duration);
        if (this.videocontrols.isTouchControls) {
          this.durationLabel.setAttribute("value", timeString);
        } else {
          this.positionDurationBox.duration = timeString;

          if (this.showHours) {
            this.positionDurationBox.modifier = "long";
            this.durationSpan.modifier = "long";
          }
        }

        // "durationValue" property is used by scale binding to
        // generate accessible name.
        this.scrubber.durationValue = timeString;

        this.scrubber.max = duration;
        // XXX Can't set increment here, due to bug 473103. Also, doing so causes
        // snapping when dragging with the mouse, so we can't just set a value for
        // the arrow-keys.
        this.scrubber.pageIncrement = Math.round(duration / 10);
      },

      pauseVideoDuringDragging() {
        if (
          !this.video.paused &&
          !this.isPausedByDragging &&
          this.scrubber.isDragging
        ) {
          this.isPausedByDragging = true;
          this.video.pause();
        }
      },

      onScrubberInput(e) {
        const duration = Math.round(this.video.duration * 1000); // in ms
        let time = this.scrubber.value;

        this.seekToPosition(time);
        this.showPosition(time, duration);

        this.scrubber.isDragging = true;
        this.pauseVideoDuringDragging();
      },

      onScrubberChange(e) {
        this.scrubber.isDragging = false;

        if (this.isPausedByDragging) {
          this.video.play();
          this.isPausedByDragging = false;
        }
      },

      updateScrubberProgress() {
        if (this.videocontrols.isTouchControls) {
          return;
        }

        const positionPercent = this.scrubber.value / this.scrubber.max * 100;

        if (!isNaN(positionPercent) && positionPercent != Infinity) {
          this.progressBar.value = positionPercent;
        } else {
          this.progressBar.value = 0;
        }
      },

      seekToPosition(newPosition) {
        newPosition /= 1000; // convert from ms
        this.log("+++ seeking to " + newPosition);
        this.video.currentTime = newPosition;
      },

      setVolume(newVolume) {
        this.log("*** setting volume to " + newVolume);
        this.video.volume = newVolume;
        this.video.muted = false;
      },

      showPosition(currentTime, duration) {
        // If the duration is unknown (because the server didn't provide
        // it, or the video is a stream), then we want to fudge the duration
        // by using the maximum playback position that's been seen.
        if (currentTime > this.maxCurrentTimeSeen) {
          this.maxCurrentTimeSeen = currentTime;
        }
        this.showDuration(duration);

        this.log("time update @ " + currentTime + "ms of " + duration + "ms");

        let positionTime = this.formatTime(currentTime, this.showHours);

        this.scrubber.value = currentTime;
        if (this.videocontrols.isTouchControls) {
          this.positionLabel.setAttribute("value", positionTime);
        } else {
          this.positionDurationBox.position = positionTime;
          this.updateScrubberProgress();
        }
      },

      showBuffered() {
        function bsearch(haystack, needle, cmp) {
          var length = haystack.length;
          var low = 0;
          var high = length;
          while (low < high) {
            var probe = low + ((high - low) >> 1);
            var r = cmp(haystack, probe, needle);
            if (r == 0) {
              return probe;
            } else if (r > 0) {
              low = probe + 1;
            } else {
              high = probe;
            }
          }
          return -1;
        }

        function bufferedCompare(buffered, i, time) {
          if (time > buffered.end(i)) {
            return 1;
          } else if (time >= buffered.start(i)) {
            return 0;
          }
          return -1;
        }

        var duration = Math.round(this.video.duration * 1000);
        if (isNaN(duration) || duration == Infinity) {
          duration = this.maxCurrentTimeSeen;
        }

        // Find the range that the current play position is in and use that
        // range for bufferBar.  At some point we may support multiple ranges
        // displayed in the bar.
        var currentTime = this.video.currentTime;
        var buffered = this.video.buffered;
        var index = bsearch(buffered, currentTime, bufferedCompare);
        var endTime = 0;
        if (index >= 0) {
          endTime = Math.round(buffered.end(index) * 1000);
        }
        this.bufferBar.max = duration;
        this.bufferBar.value = endTime;
      },

      _controlsHiddenByTimeout: false,
      _showControlsTimeout: 0,
      SHOW_CONTROLS_TIMEOUT_MS: 500,
      _showControlsFn() {
        if (Utils.video.matches("video:hover")) {
          Utils.startFadeIn(Utils.controlBar, false);
          Utils._showControlsTimeout = 0;
          Utils._controlsHiddenByTimeout = false;
        }
      },

      _hideControlsTimeout: 0,
      _hideControlsFn() {
        if (!Utils.scrubber.isDragging) {
          Utils.startFade(Utils.controlBar, false);
          Utils._hideControlsTimeout = 0;
          Utils._controlsHiddenByTimeout = true;
        }
      },
      HIDE_CONTROLS_TIMEOUT_MS: 2000,
      onMouseMove(event) {
        // If the controls are static, don't change anything.
        if (!this.dynamicControls) {
          return;
        }

        clearTimeout(this._hideControlsTimeout);

        // Suppress fading out the controls until the video has rendered
        // its first frame. But since autoplay videos start off with no
        // controls, let them fade-out so the controls don't get stuck on.
        if (!this.firstFrameShown && !this.video.autoplay) {
          return;
        }

        if (this._controlsHiddenByTimeout) {
          this._showControlsTimeout = setTimeout(
            this._showControlsFn,
            this.SHOW_CONTROLS_TIMEOUT_MS
          );
        } else {
          this.startFade(this.controlBar, true);
        }

        // Hide the controls if the mouse cursor is left on top of the video
        // but above the control bar and if the click-to-play overlay is hidden.
        if (
          (this._controlsHiddenByTimeout ||
            event.clientY < this.controlBar.getBoundingClientRect().top) &&
          this.clickToPlay.hidden
        ) {
          this._hideControlsTimeout = setTimeout(
            this._hideControlsFn,
            this.HIDE_CONTROLS_TIMEOUT_MS
          );
        }
      },

      onMouseInOut(event) {
        // If the controls are static, don't change anything.
        if (!this.dynamicControls) {
          return;
        }

        clearTimeout(this._hideControlsTimeout);

        // Ignore events caused by transitions between child nodes.
        // Note that the videocontrols element is the same
        // size as the *content area* of the video element,
        // but this is not the same as the video element's
        // border area if the video has border or padding.
        if (this.isEventWithin(event, this.videocontrols)) {
          return;
        }

        var isMouseOver = event.type == "mouseover";

        var controlRect = this.controlBar.getBoundingClientRect();
        var isMouseInControls =
          event.clientY > controlRect.top &&
          event.clientY < controlRect.bottom &&
          event.clientX > controlRect.left &&
          event.clientX < controlRect.right;

        // Suppress fading out the controls until the video has rendered
        // its first frame. But since autoplay videos start off with no
        // controls, let them fade-out so the controls don't get stuck on.
        if (!this.firstFrameShown && !isMouseOver && !this.video.autoplay) {
          return;
        }

        if (!isMouseOver && !isMouseInControls) {
          this.adjustControlSize();

          // Keep the controls visible if the click-to-play is visible.
          if (!this.clickToPlay.hidden) {
            return;
          }

          this.startFadeOut(this.controlBar, false);
          this.textTrackList.setAttribute("hidden", "true");
          clearTimeout(this._showControlsTimeout);
          Utils._controlsHiddenByTimeout = false;
        }
      },

      startFadeIn(element, immediate) {
        this.startFade(element, true, immediate);
      },

      startFadeOut(element, immediate) {
        this.startFade(element, false, immediate);
      },

      startFade(element, fadeIn, immediate) {
        if (element.classList.contains("controlBar") && fadeIn) {
          // Bug 493523, the scrubber doesn't call valueChanged while hidden,
          // so our dependent state (eg, timestamp in the thumb) will be stale.
          // As a workaround, update it manually when it first becomes unhidden.
          if (element.hidden) {
            if (this.videocontrols.isTouchControls) {
              this.scrubber.valueChanged(
                "curpos",
                this.video.currentTime * 1000,
                false
              );
            } else {
              this.scrubber.value = this.video.currentTime * 1000;
            }
          }
        }

        if (immediate) {
          element.setAttribute("immediate", true);
        } else {
          element.removeAttribute("immediate");
        }

        if (fadeIn) {
          // hidden state should be controlled by adjustControlSize
          if (!(element.isAdjustableControl && element.hideByAdjustment)) {
            element.hidden = false;
          }
          // force style resolution, so that transition begins
          // when we remove the attribute.
          element.clientTop;
          element.removeAttribute("fadeout");
          if (element.classList.contains("controlBar")) {
            this.controlsSpacer.removeAttribute("hideCursor");
          }
        } else {
          element.setAttribute("fadeout", true);
          if (
            element.classList.contains("controlBar") &&
            !this.hasError() &&
            document.mozFullScreenElement == this.video
          ) {
            this.controlsSpacer.setAttribute("hideCursor", true);
          }
        }
      },

      onTransitionEnd(event) {
        // Ignore events for things other than opacity changes.
        if (event.propertyName != "opacity") {
          return;
        }

        var element = event.originalTarget;

        // Nothing to do when a fade *in* finishes.
        if (!element.hasAttribute("fadeout")) {
          return;
        }

        if (this.videocontrols.isTouchControls) {
          this.scrubber.dragStateChanged(false);
        }
        element.hidden = true;
      },

      _triggeredByControls: false,

      startPlay() {
        this._triggeredByControls = true;
        this.hideClickToPlay();
        this.video.play();
      },

      togglePause() {
        if (this.video.paused || this.video.ended) {
          this.startPlay();
        } else {
          this.video.pause();
        }

        // We'll handle style changes in the event listener for
        // the "play" and "pause" events, same as if content
        // script was controlling video playback.
      },

      isVideoWithoutAudioTrack() {
        return (
          this.video.readyState >= this.video.HAVE_METADATA &&
          !this.isAudioOnly &&
          !this.video.mozHasAudio
        );
      },

      toggleMute() {
        if (this.isVideoWithoutAudioTrack()) {
          return;
        }
        this.video.muted = !this.isEffectivelyMuted();
        if (this.video.volume === 0) {
          this.video.volume = 0.5;
        }

        // We'll handle style changes in the event listener for
        // the "volumechange" event, same as if content script was
        // controlling volume.
      },

      isVideoInFullScreen() {
        return document.mozFullScreenElement == this.video;
      },

      toggleFullscreen() {
        this.isVideoInFullScreen()
          ? document.mozCancelFullScreen()
          : this.video.mozRequestFullScreen();
      },

      setFullscreenButtonState() {
        if (this.isAudioOnly || !document.mozFullScreenEnabled) {
          this.controlBar.setAttribute("fullscreen-unavailable", true);
          this.adjustControlSize();
          return;
        }
        this.controlBar.removeAttribute("fullscreen-unavailable");
        this.adjustControlSize();

        var attrName = this.isVideoInFullScreen()
          ? "exitfullscreenlabel"
          : "enterfullscreenlabel";
        var value = this.fullscreenButton.getAttribute(attrName);
        this.fullscreenButton.setAttribute("aria-label", value);

        if (this.isVideoInFullScreen()) {
          this.fullscreenButton.setAttribute("fullscreened", "true");
        } else {
          this.fullscreenButton.removeAttribute("fullscreened");
        }
      },

      onFullscreenChange() {
        this.updateOrientationState(this.isVideoInFullScreen());
        if (this.isVideoInFullScreen()) {
          Utils._hideControlsTimeout = setTimeout(
            this._hideControlsFn,
            this.HIDE_CONTROLS_TIMEOUT_MS
          );
        }
        this.setFullscreenButtonState();
      },

      updateOrientationState(lock) {
        if (!this.video.mozOrientationLockEnabled) {
          return;
        }
        if (lock) {
          if (this.video.mozIsOrientationLocked) {
            return;
          }
          let dimenDiff = this.video.videoWidth - this.video.videoHeight;
          if (dimenDiff > 0) {
            this.video.mozIsOrientationLocked = window.screen.mozLockOrientation(
              "landscape"
            );
          } else if (dimenDiff < 0) {
            this.video.mozIsOrientationLocked = window.screen.mozLockOrientation(
              "portrait"
            );
          } else {
            this.video.mozIsOrientationLocked = window.screen.mozLockOrientation(
              window.screen.orientation
            );
          }
        } else {
          if (!this.video.mozIsOrientationLocked) {
            return;
          }
          window.screen.mozUnlockOrientation();
          this.video.mozIsOrientationLocked = false;
        }
      },

      clickToPlayClickHandler(e) {
        if (e.button != 0) {
          return;
        }
        if (this.hasError() && !this.suppressError) {
          // Errors that can be dismissed should be placed here as we discover them.
          if (this.video.error.code != this.video.error.MEDIA_ERR_ABORTED) {
            return;
          }
          this.statusOverlay.hidden = true;
          this.suppressError = true;
          return;
        }
        if (e.defaultPrevented) {
          return;
        }
        if (this.playButton.hasAttribute("paused")) {
          this.startPlay();
        } else {
          this.video.pause();
        }
      },
      hideClickToPlay() {
        let videoHeight = this.video.clientHeight;
        let videoWidth = this.video.clientWidth;

        // The play button will animate to 3x its size. This
        // shows the animation unless the video is too small
        // to show 2/3 of the animation.
        let animationScale = 2;
        let animationMinSize = this.clickToPlay.minWidth * animationScale;

        if (
          animationMinSize > videoWidth ||
          animationMinSize > videoHeight - this.controlBarMinHeight
        ) {
          this.clickToPlay.setAttribute("immediate", "true");
          this.clickToPlay.hidden = true;
        } else {
          this.clickToPlay.removeAttribute("immediate");
        }
        this.clickToPlay.setAttribute("fadeout", "true");
        this.controlsSpacer.setAttribute("fadeout", "true");
      },

      setPlayButtonState(aPaused) {
        if (aPaused) {
          this.playButton.setAttribute("paused", "true");
        } else {
          this.playButton.removeAttribute("paused");
        }

        var attrName = aPaused ? "playlabel" : "pauselabel";
        var value = this.playButton.getAttribute(attrName);
        this.playButton.setAttribute("aria-label", value);
      },

      isEffectivelyMuted() {
        return this.video.muted || !this.video.volume;
      },

      updateMuteButtonState() {
        var muted = this.isEffectivelyMuted();

        if (muted) {
          this.muteButton.setAttribute("muted", "true");
        } else {
          this.muteButton.removeAttribute("muted");
        }

        var attrName = muted ? "unmutelabel" : "mutelabel";
        var value = this.muteButton.getAttribute(attrName);
        this.muteButton.setAttribute("aria-label", value);
      },

      _getComputedPropertyValueAsInt(element, property) {
        let value = getComputedStyle(element, null).getPropertyValue(property);
        return parseInt(value, 10);
      },

      keyHandler(event) {
        // Ignore keys when content might be providing its own.
        if (!this.video.hasAttribute("controls")) {
          return;
        }

        var keystroke = "";
        if (event.altKey) {
          keystroke += "alt-";
        }
        if (event.shiftKey) {
          keystroke += "shift-";
        }
        if (navigator.platform.startsWith("Mac")) {
          if (event.metaKey) {
            keystroke += "accel-";
          }
          if (event.ctrlKey) {
            keystroke += "control-";
          }
        } else {
          if (event.metaKey) {
            keystroke += "meta-";
          }
          if (event.ctrlKey) {
            keystroke += "accel-";
          }
        }
        switch (event.keyCode) {
          case KeyEvent.DOM_VK_UP:
            keystroke += "upArrow";
            break;
          case KeyEvent.DOM_VK_DOWN:
            keystroke += "downArrow";
            break;
          case KeyEvent.DOM_VK_LEFT:
            keystroke += "leftArrow";
            break;
          case KeyEvent.DOM_VK_RIGHT:
            keystroke += "rightArrow";
            break;
          case KeyEvent.DOM_VK_HOME:
            keystroke += "home";
            break;
          case KeyEvent.DOM_VK_END:
            keystroke += "end";
            break;
        }

        if (String.fromCharCode(event.charCode) == " ") {
          keystroke += "space";
        }

        this.log("Got keystroke: " + keystroke);
        var oldval, newval;

        try {
          switch (keystroke) {
            case "space" /* Play */:
              let target = event.originalTarget;
              if (target.localName === "button" && !target.disabled) {
                break;
              }

              this.togglePause();
              break;
            case "downArrow" /* Volume decrease */:
              oldval = this.video.volume;
              this.video.volume = oldval < 0.1 ? 0 : oldval - 0.1;
              this.video.muted = false;
              break;
            case "upArrow" /* Volume increase */:
              oldval = this.video.volume;
              this.video.volume = oldval > 0.9 ? 1 : oldval + 0.1;
              this.video.muted = false;
              break;
            case "accel-downArrow" /* Mute */:
              this.video.muted = true;
              break;
            case "accel-upArrow" /* Unmute */:
              this.video.muted = false;
              break;
            case "leftArrow": /* Seek back 15 seconds */
            case "accel-leftArrow" /* Seek back 10% */:
              oldval = this.video.currentTime;
              if (keystroke == "leftArrow") {
                newval = oldval - 15;
              } else {
                newval =
                  oldval -
                  (this.video.duration || this.maxCurrentTimeSeen / 1000) / 10;
              }
              this.video.currentTime = newval >= 0 ? newval : 0;
              break;
            case "rightArrow": /* Seek forward 15 seconds */
            case "accel-rightArrow" /* Seek forward 10% */:
              oldval = this.video.currentTime;
              var maxtime =
                this.video.duration || this.maxCurrentTimeSeen / 1000;
              if (keystroke == "rightArrow") {
                newval = oldval + 15;
              } else {
                newval = oldval + maxtime / 10;
              }
              this.video.currentTime = newval <= maxtime ? newval : maxtime;
              break;
            case "home" /* Seek to beginning */:
              this.video.currentTime = 0;
              break;
            case "end" /* Seek to end */:
              if (this.video.currentTime != this.video.duration) {
                this.video.currentTime =
                  this.video.duration || this.maxCurrentTimeSeen / 1000;
              }
              break;
            default:
              return;
          }
        } catch (e) {
          /* ignore any exception from setting .currentTime */
        }

        event.preventDefault(); // Prevent page scrolling
      },

      isSupportedTextTrack(textTrack) {
        return textTrack.kind == "subtitles" || textTrack.kind == "captions";
      },

      get isClosedCaptionAvailable() {
        return (
          this.overlayableTextTracks.length &&
          !this.videocontrols.isTouchControls
        );
      },

      get overlayableTextTracks() {
        return Array.prototype.filter.call(
          this.video.textTracks,
          this.isSupportedTextTrack
        );
      },

      get currentTextTrackIndex() {
        const showingTT = this.overlayableTextTracks.find(
          tt => tt.mode == "showing"
        );

        // fallback to off button if there's no showing track.
        return showingTT ? showingTT.index : 0;
      },

      isClosedCaptionOn() {
        for (let tt of this.overlayableTextTracks) {
          if (tt.mode === "showing") {
            return true;
          }
        }

        return false;
      },

      setClosedCaptionButtonState() {
        if (this.isClosedCaptionOn()) {
          this.closedCaptionButton.setAttribute("enabled", "true");
        } else {
          this.closedCaptionButton.removeAttribute("enabled");
        }

        let ttItems = this.textTrackList.childNodes;

        for (let tti of ttItems) {
          const idx = +tti.getAttribute("index");

          if (idx == this.currentTextTrackIndex) {
            tti.setAttribute("on", "true");
          } else {
            tti.removeAttribute("on");
          }
        }

        this.adjustControlSize();
      },

      addNewTextTrack(tt) {
        if (!this.isSupportedTextTrack(tt)) {
          return;
        }

        if (tt.index && tt.index < this.textTracksCount) {
          // Don't create items for initialized tracks. However, we
          // still need to care about mode since TextTrackManager would
          // turn on the first available track automatically.
          if (tt.mode === "showing") {
            this.changeTextTrack(tt.index);
          }
          return;
        }

        tt.index = this.textTracksCount++;

        const label = tt.label || "";
        const ttText = document.createTextNode(label);
        const ttBtn = document.createElement("button");

        ttBtn.classList.add("textTrackItem");
        ttBtn.setAttribute("index", tt.index);

        ttBtn.addEventListener("click", event => {
          event.stopPropagation();

          this.changeTextTrack(tt.index);
        });

        ttBtn.appendChild(ttText);

        this.textTrackList.appendChild(ttBtn);

        if (tt.mode === "showing" && tt.index) {
          this.changeTextTrack(tt.index);
        }
      },

      changeTextTrack(index) {
        for (let tt of this.overlayableTextTracks) {
          if (tt.index === index) {
            tt.mode = "showing";
          } else {
            tt.mode = "disabled";
          }
        }

        this.textTrackList.setAttribute("hidden", "true");
      },

      onControlBarTransitioned() {
        this.textTrackList.setAttribute("hidden", "true");
        this.video.dispatchEvent(new CustomEvent("controlbarchange"));
        this.adjustControlSize();
      },

      toggleClosedCaption() {
        if (this.textTrackList.hasAttribute("hidden")) {
          this.textTrackList.removeAttribute("hidden");
        } else {
          this.textTrackList.setAttribute("hidden", "true");
        }
      },

      onTextTrackAdd(trackEvent) {
        this.addNewTextTrack(trackEvent.track);
        this.setClosedCaptionButtonState();
      },

      onTextTrackRemove(trackEvent) {
        const toRemoveIndex = trackEvent.track.index;
        const ttItems = this.textTrackList.childNodes;

        if (!ttItems) {
          return;
        }

        for (let tti of ttItems) {
          const idx = +tti.getAttribute("index");

          if (idx === toRemoveIndex) {
            tti.remove();
            this.textTracksCount--;
          }

          this.video.dispatchEvent(new CustomEvent("texttrackchange"));
        }

        this.setClosedCaptionButtonState();
      },

      initTextTracks() {
        // add 'off' button anyway as new text track might be
        // dynamically added after initialization.
        const offLabel = this.textTrackList.getAttribute("offlabel");
        this.addNewTextTrack({
          label: offLabel,
          kind: "subtitles"
        });

        for (let tt of this.overlayableTextTracks) {
          this.addNewTextTrack(tt);
        }

        this.setClosedCaptionButtonState();
      },

      isEventWithin(event, parent1, parent2) {
        function isDescendant(node) {
          while (node) {
            if (node == parent1 || node == parent2) {
              return true;
            }
            node = node.parentNode;
          }
          return false;
        }
        return isDescendant(event.target) && isDescendant(event.relatedTarget);
      },

      log(msg) {
        if (this.debug) {
          console.log("videoctl: " + msg + "\n");
        }
      },

      get isTopLevelSyntheticDocument() {
        let doc = this.video.ownerDocument;
        let win = doc.defaultView;
        return doc.mozSyntheticDocument && win === win.top;
      },

      controlBarMinHeight: 40,
      controlBarMinVisibleHeight: 28,
      adjustControlSize() {
        if (this.videocontrols.isTouchControls) {
          return;
        }

        const minControlBarPaddingWidth = 18;

        this.fullscreenButton.isWanted = !this.controlBar.hasAttribute(
          "fullscreen-unavailable"
        );
        this.closedCaptionButton.isWanted = this.isClosedCaptionAvailable;
        this.volumeStack.isWanted = !this.muteButton.hasAttribute("noAudio");

        let minRequiredWidth = this.prioritizedControls
          .filter(control => control && control.isWanted)
          .reduce(
            (accWidth, cc) => accWidth + cc.minWidth,
            minControlBarPaddingWidth
          );
        // Skip the adjustment in case the stylesheets haven't been loaded yet.
        if (!minRequiredWidth) {
          return;
        }

        let givenHeight = this.video.clientHeight;
        let videoWidth =
          (this.isAudioOnly
            ? this.videocontrols.clientWidth
            : this.video.clientWidth) || minRequiredWidth;
        let videoHeight = this.isAudioOnly
          ? this.controlBarMinHeight
          : givenHeight;
        let videocontrolsWidth = this.videocontrols.clientWidth;

        let widthUsed = minControlBarPaddingWidth;
        let preventAppendControl = false;

        for (let control of this.prioritizedControls) {
          if (!control.isWanted) {
            control.hideByAdjustment = true;
            continue;
          }

          control.hideByAdjustment =
            preventAppendControl || widthUsed + control.minWidth > videoWidth;

          if (control.hideByAdjustment) {
            preventAppendControl = true;
          } else {
            widthUsed += control.minWidth;
          }
        }

        // Use flexible spacer to separate controls when scrubber is hidden.
        // As long as muteButton hidden, which means only play button presents,
        // hide spacer and make playButton centered.
        this.controlBarSpacer.hidden =
          !this.scrubberStack.hidden || this.muteButton.hidden;

        // Since the size of videocontrols is expanded with controlBar in <audio>, we
        // should fix the dimensions in order not to recursively trigger reflow afterwards.
        if (this.video instanceof HTMLAudioElement) {
          if (givenHeight) {
            // The height of controlBar should be capped with the bounds between controlBarMinHeight
            // and controlBarMinVisibleHeight.
            let controlBarHeight = Math.max(
              Math.min(givenHeight, this.controlBarMinHeight),
              this.controlBarMinVisibleHeight
            );
            this.controlBar.style.height = `${controlBarHeight}px`;
          }
          // Bug 1367875: Set minimum required width to controlBar if the given size is smaller than padding.
          // This can help us expand the control and restore to the default size the next time we need
          // to adjust the sizing.
          if (videocontrolsWidth <= minControlBarPaddingWidth) {
            this.controlBar.style.width = `${minRequiredWidth}px`;
          } else {
            this.controlBar.style.width = `${videoWidth}px`;
          }
          return;
        }

        if (
          videoHeight < this.controlBarMinHeight ||
          widthUsed === minControlBarPaddingWidth
        ) {
          this.controlBar.setAttribute("size", "hidden");
          this.controlBar.hideByAdjustment = true;
        } else {
          this.controlBar.removeAttribute("size");
          this.controlBar.hideByAdjustment = false;
        }

        // Adjust clickToPlayButton size.
        const minVideoSideLength = Math.min(videoWidth, videoHeight);
        const clickToPlayViewRatio = 0.15;
        const clickToPlayScaledSize = Math.max(
          this.clickToPlay.minWidth,
          minVideoSideLength * clickToPlayViewRatio
        );

        if (
          clickToPlayScaledSize >= videoWidth ||
          clickToPlayScaledSize + this.controlBarMinHeight / 2 >=
            videoHeight / 2
        ) {
          this.clickToPlay.hideByAdjustment = true;
        } else {
          if (
            this.clickToPlay.hidden &&
            !this.video.played.length &&
            this.video.paused
          ) {
            this.clickToPlay.hideByAdjustment = false;
          }
          this.clickToPlay.style.width = `${clickToPlayScaledSize}px`;
          this.clickToPlay.style.height = `${clickToPlayScaledSize}px`;
        }
      },

      init(binding) {
        this.video = binding.parentNode;
        this.videocontrols = binding;

        this.controlsContainer = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "controlsContainer"
        );
        this.statusIcon = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "statusIcon"
        );
        this.controlBar = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "controlBar"
        );
        this.playButton = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "playButton"
        );
        this.controlBarSpacer = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "controlBarSpacer"
        );
        this.muteButton = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "muteButton"
        );
        this.volumeStack = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "volumeStack"
        );
        this.volumeControl = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "volumeControl"
        );
        this.progressBar = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "progressBar"
        );
        this.bufferBar = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "bufferBar"
        );
        this.scrubberStack = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "scrubberStack"
        );
        this.scrubber = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "scrubber"
        );
        this.durationLabel = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "durationLabel"
        );
        this.positionLabel = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "positionLabel"
        );
        this.positionDurationBox = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "positionDurationBox"
        );
        this.statusOverlay = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "statusOverlay"
        );
        this.controlsOverlay = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "controlsOverlay"
        );
        this.controlsSpacer = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "controlsSpacer"
        );
        this.clickToPlay = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "clickToPlay"
        );
        this.fullscreenButton = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "fullscreenButton"
        );
        this.closedCaptionButton = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "closedCaptionButton"
        );
        this.textTrackList = document.getAnonymousElementByAttribute(
          binding,
          "anonid",
          "textTrackList"
        );

        if (this.positionDurationBox) {
          this.durationSpan = this.positionDurationBox.getElementsByTagName(
            "span"
          )[0];
        }

        this.controlBarComputedStyles = getComputedStyle(this.controlBar);

        // Hide and show control in certain order.
        this.prioritizedControls = [
          this.playButton,
          this.muteButton,
          this.fullscreenButton,
          this.closedCaptionButton,
          this.positionDurationBox,
          this.scrubberStack,
          this.durationSpan,
          this.volumeStack
        ];

        // XXX controlsContainer is a desktop only element. To determine whether
        // isTouchControls or not during the whole initialization process, get
        // this state overridden here.
        this.videocontrols.isTouchControls = !this.controlsContainer;
        this.isAudioOnly = this.video instanceof HTMLAudioElement;
        this.setupInitialState();
        this.setupNewLoadState();
        this.initTextTracks();

        // Use the handleEvent() callback for all media events.
        // Only the "error" event listener must capture, so that it can trap error
        // events from <source> children, which don't bubble. But we use capture
        // for all events in order to simplify the event listener add/remove.
        for (let event of this.videoEvents) {
          this.video.addEventListener(event, this, {
            capture: true,
            mozSystemGroup: true
          });
        }

        var self = this;
        this.controlListeners = [];

        // Helper function to add an event listener to the given element
        // Due to this helper function, "Utils" is made available to the event
        // listener functions. Hence declare it as a global for ESLint.
        /* global Utils */
        function addListener(
          elem,
          eventName,
          func,
          { capture = false, mozSystemGroup = true } = {}
        ) {
          let boundFunc = func.bind(self);
          self.controlListeners.push({
            item: elem,
            event: eventName,
            func: boundFunc,
            capture,
            mozSystemGroup
          });
          elem.addEventListener(eventName, boundFunc, {
            mozSystemGroup,
            capture
          });
        }

        addListener(this.muteButton, "click", this.toggleMute);
        addListener(
          this.closedCaptionButton,
          "click",
          this.toggleClosedCaption
        );
        addListener(this.fullscreenButton, "click", this.toggleFullscreen);
        addListener(this.playButton, "click", this.clickToPlayClickHandler);
        addListener(this.clickToPlay, "click", this.clickToPlayClickHandler);
        addListener(this.controlsSpacer, "click", this.clickToPlayClickHandler);
        addListener(this.controlsSpacer, "dblclick", this.toggleFullscreen);

        addListener(
          this.videocontrols,
          "resizevideocontrols",
          this.adjustControlSize
        );
        addListener(this.videocontrols, "transitionend", this.onTransitionEnd);
        addListener(
          this.video.ownerDocument,
          "mozfullscreenchange",
          this.onFullscreenChange
        );
        addListener(
          this.controlBar,
          "transitionend",
          this.onControlBarTransitioned
        );
        addListener(
          this.video.ownerDocument,
          "fullscreenchange",
          this.onFullscreenChange
        );
        addListener(this.video, "keypress", this.keyHandler, { capture: true });
        // Prevent any click event within media controls from dispatching through to video.
        addListener(
          this.videocontrols,
          "click",
          function(event) {
            event.stopPropagation();
          },
          { mozSystemGroup: false }
        );
        addListener(this.videocontrols, "dragstart", function(event) {
          event.preventDefault(); // prevent dragging of controls image (bug 517114)
        });

        if (!this.videocontrols.isTouchControls) {
          addListener(this.scrubber, "input", this.onScrubberInput);
          addListener(this.scrubber, "change", this.onScrubberChange);
          // add mouseup listener additionally to handle the case that `change` event
          // isn't fired when the input value before/after dragging are the same. (bug 1328061)
          addListener(this.scrubber, "mouseup", this.onScrubberChange);
          addListener(this.volumeControl, "input", this.updateVolume);
          addListener(this.video.textTracks, "addtrack", this.onTextTrackAdd);
          addListener(
            this.video.textTracks,
            "removetrack",
            this.onTextTrackRemove
          );
          addListener(
            this.video.textTracks,
            "change",
            this.setClosedCaptionButtonState
          );
        }

        this.log("--- videocontrols initialized ---");
      }
    };

    this.Utils.init(this);

    this.addEventListener("mouseover", event => {
      if (!this.isTouchControls) {
        this.Utils.onMouseInOut(event);
      }
    });

    this.addEventListener("mouseout", event => {
      if (!this.isTouchControls) {
        this.Utils.onMouseInOut(event);
      }
    });

    this.addEventListener("mousemove", event => {
      if (!this.isTouchControls) {
        this.Utils.onMouseMove(event);
      }
    });
  }
  disconnectedCallback() {
    this.Utils.terminateEventListeners();
    this.Utils.updateOrientationState(false);
    // randomID used to be a <field>, which meant that the XBL machinery
    // undefined the property when the element was unbound. The code in
    // this file actually depends on this, so now that randomID is an
    // expando, we need to make sure to explicitly delete it.
    delete this.randomID;
  }
}
customElements.define("firefox-videocontrols", FirefoxVideocontrols);
