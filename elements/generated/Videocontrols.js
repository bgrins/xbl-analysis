class XblVideocontrols extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    console.log(this, "connected");

    this.innerHTML = `<div anonid="controlsContainer" class="controlsContainer" role="none">
<div anonid="statusOverlay" class="statusOverlay stackItem" hidden="true">
<div anonid="statusIcon" class="statusIcon">
</div>
<span class="errorLabel" anonid="errorAborted">
</span>
<span class="errorLabel" anonid="errorNetwork">
</span>
<span class="errorLabel" anonid="errorDecode">
</span>
<span class="errorLabel" anonid="errorSrcNotSupported">
</span>
<span class="errorLabel" anonid="errorNoSource">
</span>
<span class="errorLabel" anonid="errorGeneric">
</span>
</div>
<div anonid="controlsOverlay" class="controlsOverlay stackItem">
<div class="controlsSpacerStack" aria-hideen="true">
<div anonid="controlsSpacer" class="controlsSpacer stackItem" role="none">
</div>
<div anonid="clickToPlay" class="clickToPlay" hidden="true">
</div>
</div>
<div anonid="controlBar" class="controlBar" hidden="true">
<button anonid="playButton" class="playButton" playlabel="&playButton.playLabel;" pauselabel="&playButton.pauseLabel;" tabindex="-1">
</button>
<div anonid="scrubberStack" class="scrubberStack progressContainer" role="none">
<div class="progressBackgroundBar stackItem" role="none">
<div class="progressStack" role="none">
<progress anonid="bufferBar" class="bufferBar" value="0" max="100" tabindex="-1">
</progress>
<progress anonid="progressBar" class="progressBar" value="0" max="100" tabindex="-1">
</progress>
</div>
</div>
<input type="range" anonid="scrubber" class="scrubber" tabindex="-1" mozinputrangeignorepreventdefault="true">
</input>
</div>
<span anonid="positionLabel" class="positionLabel" role="presentation">
</span>
<span anonid="durationLabel" class="durationLabel" role="presentation">
</span>
<span anonid="positionDurationBox" class="positionDurationBox" aria-hidden="true">
</span>
<div anonid="controlBarSpacer" class="controlBarSpacer" hidden="true" role="none">
</div>
<button anonid="muteButton" class="muteButton" mutelabel="&muteButton.muteLabel;" unmutelabel="&muteButton.unmuteLabel;" tabindex="-1">
</button>
<div anonid="volumeStack" class="volumeStack progressContainer" role="none">
<input type="range" anonid="volumeControl" class="volumeControl" min="0" max="100" step="1" tabindex="-1" mozinputrangeignorepreventdefault="true">
</input>
</div>
<button anonid="closedCaptionButton" class="closedCaptionButton">
</button>
<button anonid="fullscreenButton" class="fullscreenButton" enterfullscreenlabel="&fullscreenButton.enterfullscreenlabel;" exitfullscreenlabel="&fullscreenButton.exitfullscreenlabel;">
</button>
</div>
<div anonid="textTrackList" class="textTrackList" hidden="true" offlabel="&closedCaption.off;">
</div>
</div>
</div>`;
    let comment = document.createComment("Creating xbl-videocontrols");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-videocontrols", XblVideocontrols);
