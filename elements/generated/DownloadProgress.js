/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozDownloadProgress extends MozXULElement {
  connectedCallback() {

    if (this.delayConnectedCallback()) {
      return;
    }
    this.appendChild(MozXULElement.parseXULToFragment(`
      <stack flex="1">
        <hbox flex="1">
          <hbox class="start-cap"></hbox>
          <html:progress anonid="progress" class="progress" max="100"></html:progress>
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

  }

  set progress(val) {
    // This property is always updated after maxProgress.
    if (this.getAttribute("mode") == "determined") {
      this._progress.value = val;
    }
    if (val == this._progress.max)
      this.setAttribute("complete", true);
    else
      this.removeAttribute("complete");
  }

  set maxProgress(val) {
    if (val == -1) {
      this.setAttribute("mode", "undetermined");
      this._progress.removeAttribute("value");
    } else {
      this.setAttribute("mode", "determined");
      this._progress.setAttribute("max", val);
    }
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

customElements.define("download-progress", MozDownloadProgress);

}
