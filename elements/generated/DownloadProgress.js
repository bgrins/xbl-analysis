class FirefoxDownloadProgress extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <xul:stack flex="1">
        <xul:hbox flex="1">
          <xul:hbox class="start-cap"></xul:hbox>
          <xul:progressmeter anonid="progress" class="progress" flex="1" min="0" max="100"></xul:progressmeter>
          <xul:hbox class="end-cap"></xul:hbox>
        </xul:hbox>
        <xul:hbox class="status-container">
          <xul:spacer flex="1"></xul:spacer>
          <xul:label anonid="status" class="status"></xul:label>
          <xul:spacer flex="1"></xul:spacer>
          <xul:button anonid="cancel-btn" class="cancel" tooltiptext="FROM-DTD-progress-cancel-tooltip" oncommand="document.getBindingParent(this).cancel();"></xul:button>
        </xul:hbox>
      </xul:stack>
    `;

    this._progress = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "progress"
    );

    this._cancel = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "cancel-btn"
    );

    this._status = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "status"
    );

    var progress = 0;
    if (this.hasAttribute("progress"))
      progress = parseInt(this.getAttribute("progress"));
    this.progress = progress;
  }

  set progress(val) {
    this._progress.value = val;
    if (val == this._progress.max) this.setAttribute("complete", true);
    else this.removeAttribute("complete");
  }

  get progress() {
    return this._progress.value;
  }

  set maxProgress(val) {
    if (val == -1) {
      this._progress.mode = "undetermined";
    } else {
      this._progress.mode = "determined";
      this._progress.max = val;
    }
    this.setAttribute("mode", this._progress.mode);
  }

  get maxProgress() {
    return this._progress.max;
  }

  set status(val) {
    this._status.value = val;
  }

  get status() {
    return this._status.value;
  }
  cancel() {
    this.mInstall.cancel();
  }
}
customElements.define("firefox-download-progress", FirefoxDownloadProgress);
