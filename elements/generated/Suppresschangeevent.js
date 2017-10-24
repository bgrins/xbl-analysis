class FirefoxSuppresschangeevent extends FirefoxScale {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    /* eslint-enable no-multi-spaces */
    this.positionValue = "";
    this.durationValue = "";
    this.valueBar = null;
    this.isDragging = false;
    this.isPausedByDragging = false;

    this.type = this.getAttribute("class");
    this.Utils = document.getBindingParent(this.parentNode).Utils;
    this.valueBar = this.Utils.progressBar;
  }
  disconnectedCallback() {}

  get accessibleName() {
    var currTime = this.positionValue;
    var totalTime = this.durationValue;

    return this.scrubberNameFormat
      .replace(/#1/, currTime)
      .replace(/#2/, totalTime);
  }
  valueChanged(which, newValue, userChanged) {
    // This method is a copy of the base binding's valueChanged(), except that it does
    // not dispatch a |change| event (to avoid exposing the event to web content), and
    // just calls the videocontrol's seekToPosition() method directly.
    switch (which) {
      case "curpos":
        // Update the time shown in the thumb.
        this.positionValue = this.Utils.formatTime(
          newValue,
          this.Utils.showHours
        );
        this.Utils.positionLabel.setAttribute("value", this.positionValue);
        // Update the value bar to match the thumb position.
        let percent = newValue / this.max;
        if (!isNaN(percent) && percent != Infinity) {
          this.valueBar.value = Math.round(percent * 10000); // has max=10000
        } else {
          this.valueBar.removeAttribute("value");
        }

        // The value of userChanged is true when changing the position with the mouse,
        // but not when pressing an arrow key. However, the base binding sets
        // ._userChanged in its keypress handlers, so we just need to check both.
        if (!userChanged && !this._userChanged) {
          return;
        }
        this.setAttribute("value", newValue);
        this.Utils.seekToPosition(newValue);
        break;

      case "minpos":
        this.setAttribute("min", newValue);
        break;

      case "maxpos":
        // Update the value bar to match the thumb position.
        this.valueBar.value = Math.round(this.value / newValue * 10000); // has max=10000
        this.setAttribute("max", newValue);
        break;
    }
  }
  dragStateChanged(isDragging) {
    this.Utils.log("--- dragStateChanged: " + isDragging + " ---");
    this.isDragging = isDragging;
    if (this.isPausedByDragging && !isDragging) {
      // After the drag ends, resume playing.
      this.Utils.video.play();
      this.isPausedByDragging = false;
    }
  }
  pauseVideoDuringDragging() {
    if (
      this.isDragging &&
      !this.Utils.video.paused &&
      !this.isPausedByDragging
    ) {
      this.isPausedByDragging = true;
      this.Utils.video.pause();
    }
  }
}
customElements.define(
  "firefox-suppresschangeevent",
  FirefoxSuppresschangeevent
);
