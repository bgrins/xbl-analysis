class FirefoxAddonProgressNotification extends FirefoxPopupNotification {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-addon-progress-notification"
    );
    this.prepend(comment);

    Object.defineProperty(this, "progressmeter", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.progressmeter;
        return (this.progressmeter = document.getElementById(
          "addon-progress-notification-progressmeter"
        ));
      },
      set(val) {
        delete this.progressmeter;
        return (this.progressmeter = val);
      }
    });
    Object.defineProperty(this, "progresstext", {
      configurable: true,
      enumerable: true,
      get() {
        delete this.progresstext;
        return (this.progresstext = document.getElementById(
          "addon-progress-notification-progresstext"
        ));
      },
      set(val) {
        delete this.progresstext;
        return (this.progresstext = val);
      }
    });

    if (!this.notification) return;

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
  disconnectedCallback() {
    this.destroy();
  }

  get DownloadUtils() {
    let module = {};
    Components.utils.import("resource://gre/modules/DownloadUtils.jsm", module);
    Object.defineProperty(this, "DownloadUtils", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: module.DownloadUtils
    });
    return module.DownloadUtils;
  }
  destroy() {
    if (!this.notification) return;

    this.notification.options.installs.forEach(function(aInstall) {
      aInstall.removeListener(this);
    }, this);
    clearTimeout(this._updateProgressTimeout);
  }
  setProgress(aProgress, aMaxProgress) {
    if (aMaxProgress == -1) {
      this.progressmeter.setAttribute("mode", "undetermined");
    } else {
      this.progressmeter.setAttribute("mode", "determined");
      this.progressmeter.setAttribute("value", aProgress * 100 / aMaxProgress);
    }

    let now = Date.now();

    if (!this.notification.lastUpdate) {
      this.notification.lastUpdate = now;
      this.notification.lastProgress = aProgress;
      return;
    }

    let delta = now - this.notification.lastUpdate;
    if (delta < 400 && aProgress < aMaxProgress) return;

    delta /= 1000;

    // This algorithm is the same used by the downloads code.
    let speed = (aProgress - this.notification.lastProgress) / delta;
    if (this.notification.speed)
      speed = speed * 0.9 + this.notification.speed * 0.1;

    this.notification.lastUpdate = now;
    this.notification.lastProgress = aProgress;
    this.notification.speed = speed;

    let status = null;
    [status, this.notification.last] = this.DownloadUtils.getDownloadStatus(
      aProgress,
      aMaxProgress,
      speed,
      this.notification.last
    );
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
    if (!this.notification) return;

    let downloadingCount = 0;
    let progress = 0;
    let maxProgress = 0;

    this.notification.options.installs.forEach(function(aInstall) {
      if (aInstall.maxProgress == -1) maxProgress = -1;
      progress += aInstall.progress;
      if (maxProgress >= 0) maxProgress += aInstall.maxProgress;
      if (aInstall.state < AddonManager.STATE_DOWNLOADED) downloadingCount++;
    });

    if (downloadingCount == 0) {
      this.destroy();
      if (Services.prefs.getBoolPref("xpinstall.customConfirmationUI", false)) {
        this.progressmeter.setAttribute("mode", "undetermined");
        let status = gNavigatorBundle.getString("addonDownloadVerifying");
        this.progresstext.setAttribute("value", status);
        this.progresstext.setAttribute("tooltiptext", status);
      } else {
        PopupNotifications.remove(this.notification);
      }
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
}
customElements.define(
  "firefox-addon-progress-notification",
  FirefoxAddonProgressNotification
);
