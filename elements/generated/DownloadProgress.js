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
    Object.defineProperty(this, "_progress", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._progress;
        return (this._progress = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "progress"
        ));
      },
      set(val) {
        delete this._progress;
        return (this._progress = val);
      }
    });
    Object.defineProperty(this, "_cancel", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._cancel;
        return (this._cancel = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "cancel-btn"
        ));
      },
      set(val) {
        delete this._cancel;
        return (this._cancel = val);
      }
    });
    Object.defineProperty(this, "_status", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._status;
        return (this._status = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "status"
        ));
      },
      set(val) {
        delete this._status;
        return (this._status = val);
      }
    });

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
