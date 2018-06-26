class DownloadProgress extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <stack flex="1">
        <hbox flex="1">
          <hbox class="start-cap"></hbox>
          <progressmeter anonid="progress" class="progress" flex="1" min="0" max="100"></progressmeter>
          <hbox class="end-cap"></hbox>
        </hbox>
        <hbox class="status-container">
          <spacer flex="1"></spacer>
          <label anonid="status" class="status"></label>
          <spacer flex="1"></spacer>
          <button anonid="cancel-btn" class="cancel" tooltiptext="FROM-DTD.progress.cancel.tooltip;" oncommand="document.getBindingParent(this).cancel();"></button>
        </hbox>
      </stack>
    `));
    this._progress = document.getAnonymousElementByAttribute(this, "anonid", "progress");

    this._cancel = document.getAnonymousElementByAttribute(this, "anonid", "cancel-btn");

    this._status = document.getAnonymousElementByAttribute(this, "anonid", "status");

    var progress = 0;
    if (this.hasAttribute("progress"))
      progress = parseInt(this.getAttribute("progress"));
    this.progress = progress;

    this._setupEventListeners();
  }

  set progress(val) {
    this._progress.value = val;
    if (val == this._progress.max)
      this.setAttribute("complete", true);
    else
      this.removeAttribute("complete");
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

  _setupEventListeners() {

  }
}