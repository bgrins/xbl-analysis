class XblTouchcontrols extends XblVideocontrols {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<stack flex="1">
<vbox anonid="statusOverlay" flex="1" class="statusOverlay" hidden="true">
<box anonid="statusIcon" class="statusIcon">
</box>
<label class="errorLabel" anonid="errorAborted">
</label>
<label class="errorLabel" anonid="errorNetwork">
</label>
<label class="errorLabel" anonid="errorDecode">
</label>
<label class="errorLabel" anonid="errorSrcNotSupported">
</label>
<label class="errorLabel" anonid="errorNoSource">
</label>
<label class="errorLabel" anonid="errorGeneric">
</label>
</vbox>
<vbox anonid="controlsOverlay" class="controlsOverlay">
<spacer anonid="controlsSpacer" class="controlsSpacer" flex="1">
</spacer>
<box flex="1" hidden="true">
<box anonid="clickToPlay" class="clickToPlay" hidden="true" flex="1">
</box>
<vbox anonid="textTrackList" class="textTrackList" hidden="true" offlabel="&closedCaption.off;">
</vbox>
</box>
<vbox anonid="controlBar" class="controlBar" hidden="true">
<hbox class="buttonsBar">
<button anonid="playButton" class="playButton" playlabel="&playButton.playLabel;" pauselabel="&playButton.pauseLabel;">
</button>
<label anonid="positionLabel" class="positionLabel" role="presentation">
</label>
<stack anonid="scrubberStack" class="scrubberStack">
<box class="backgroundBar">
</box>
<progressmeter class="flexibleBar" value="100">
</progressmeter>
<progressmeter anonid="bufferBar" class="bufferBar">
</progressmeter>
<progressmeter anonid="progressBar" class="progressBar" max="10000">
</progressmeter>
<scale anonid="scrubber" class="scrubber" movetoclick="true">
</scale>
</stack>
<label anonid="durationLabel" class="durationLabel" role="presentation">
</label>
<button anonid="muteButton" class="muteButton" mutelabel="&muteButton.muteLabel;" unmutelabel="&muteButton.unmuteLabel;">
</button>
<stack anonid="volumeStack" class="volumeStack">
<box anonid="volumeBackground" class="volumeBackground">
</box>
<box anonid="volumeForeground" class="volumeForeground">
</box>
<scale anonid="volumeControl" class="volumeControl" movetoclick="true">
</scale>
</stack>
<button anonid="castingButton" class="castingButton" hidden="true" aria-label="&castingButton.castingLabel;">
</button>
<button anonid="closedCaptionButton" class="closedCaptionButton" hidden="true">
</button>
<button anonid="fullscreenButton" class="fullscreenButton" enterfullscreenlabel="&fullscreenButton.enterfullscreenlabel;" exitfullscreenlabel="&fullscreenButton.exitfullscreenlabel;">
</button>
</hbox>
</vbox>
</vbox>
</stack>`;
    let comment = document.createComment("Creating xbl-touchcontrols");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-touchcontrols", XblTouchcontrols);
