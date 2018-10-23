/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozAddonProgressNotification extends MozPopupNotification {
  connectedCallback() {
    super.connectedCallback()

    this.progressmeter = document.getElementById("addon-progress-notification-progressmeter");

    this.progresstext = document.getElementById("addon-progress-notification-progresstext");

    if (!this.notification)
      return;

    this.notification.options.installs.forEach(function(aInstall) {
      aInstall.addListener(this);
    }, this);

    // Calling updateProgress can sometimes cause this notification to be
    // removed in the middle of refreshing the notification panel which
    // makes the panel get refreshed again. Just initialise to the
    // undetermined state and then schedule a proper check at the next
    // opportunity
    this.setProgress(0, -1);
    this._updateProgressTimeout = setTimeout(this.updateProgress.bind(this), 0);

  }

  get DownloadUtils() {
    let module = {};
    ChromeUtils.import("resource://gre/modules/DownloadUtils.jsm", module);
    Object.defineProperty(this, "DownloadUtils", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: module.DownloadUtils,
    });
    return module.DownloadUtils;
  }

  destroy() {
    if (!this.notification)
      return;

    this.notification.options.installs.forEach(function(aInstall) {
      aInstall.removeListener(this);
    }, this);
    clearTimeout(this._updateProgressTimeout);
  }

  setProgress(aProgress, aMaxProgress) {
    if (aMaxProgress == -1) {
      this.progressmeter.removeAttribute("value");
    } else {
      this.progressmeter.setAttribute("value", (aProgress * 100) / aMaxProgress);
    }

    let now = Date.now();

    if (!this.notification.lastUpdate) {
      this.notification.lastUpdate = now;
      this.notification.lastProgress = aProgress;
      return;
    }

    let delta = now - this.notification.lastUpdate;
    if ((delta < 400) && (aProgress < aMaxProgress))
      return;

    delta /= 1000;

    // This algorithm is the same used by the downloads code.
    let speed = (aProgress - this.notification.lastProgress) / delta;
    if (this.notification.speed)
      speed = speed * 0.9 + this.notification.speed * 0.1;

    this.notification.lastUpdate = now;
    this.notification.lastProgress = aProgress;
    this.notification.speed = speed;

    let status = null;
    [status, this.notification.last] = this.DownloadUtils.getDownloadStatus(aProgress, aMaxProgress, speed, this.notification.last);
    this.progresstext.setAttribute("value", status);
    this.progresstext.setAttribute("tooltiptext", status);
  }

  cancel() {
    let installs = this.notification.options.installs;
    installs.forEach(function(aInstall) {
      try {
        aInstall.cancel();
      } catch (e) {
        // Cancel will throw if the download has already failed
      }
    }, this);

    PopupNotifications.remove(this.notification);
  }

  updateProgress() {
    if (!this.notification)
      return;

    let downloadingCount = 0;
    let progress = 0;
    let maxProgress = 0;

    this.notification.options.installs.forEach(function(aInstall) {
      if (aInstall.maxProgress == -1)
        maxProgress = -1;
      progress += aInstall.progress;
      if (maxProgress >= 0)
        maxProgress += aInstall.maxProgress;
      if (aInstall.state < AddonManager.STATE_DOWNLOADED)
        downloadingCount++;
    });

    if (downloadingCount == 0) {
      this.destroy();
      this.progressmeter.removeAttribute("value");
      let status = gNavigatorBundle.getString("addonDownloadVerifying");
      this.progresstext.setAttribute("value", status);
      this.progresstext.setAttribute("tooltiptext", status);
    } else {
      this.setProgress(progress, maxProgress);
    }
  }

  onDownloadProgress() {
    this.updateProgress();
  }

  onDownloadFailed() {
    this.updateProgress();
  }

  onDownloadCancelled() {
    this.updateProgress();
  }

  onDownloadEnded() {
    this.updateProgress();
  }
  disconnectedCallback() {
    this.destroy();
  }
}

customElements.define("addon-progress-notification", MozAddonProgressNotification);

}
