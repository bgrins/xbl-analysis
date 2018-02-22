class FirefoxNotificationbox extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:stack inherits="hidden=notificationshidden" class="notificationbox-stack">
        <xul:spacer></xul:spacer>
        <children includes="notification"></children>
      </xul:stack>
      <children></children>
    `;

    this.PRIORITY_INFO_LOW = 1;

    this.PRIORITY_INFO_MEDIUM = 2;

    this.PRIORITY_INFO_HIGH = 3;

    this.PRIORITY_WARNING_LOW = 4;

    this.PRIORITY_WARNING_MEDIUM = 5;

    this.PRIORITY_WARNING_HIGH = 6;

    this.PRIORITY_CRITICAL_LOW = 7;

    this.PRIORITY_CRITICAL_MEDIUM = 8;

    this.PRIORITY_CRITICAL_HIGH = 9;

    this.PRIORITY_CRITICAL_BLOCK = 10;

    this.currentNotification = null;

    this._closedNotification = null;

    this._blockingCanvas = null;

    this._animating = false;

    this._setupEventListeners();
  }

  get _allowAnimation() {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefBranch);
    return prefs.getBoolPref("toolkit.cosmeticAnimations.enabled");
  }

  set notificationsHidden(val) {
    if (val)
      this.setAttribute("notificationshidden", true);
    else this.removeAttribute("notificationshidden");
    return val;
  }

  get notificationsHidden() {
    return this.getAttribute('notificationshidden') == 'true';
  }

  get allNotifications() {
    var closedNotification = this._closedNotification;
    var notifications = this.getElementsByTagName("notification");
    return Array.filter(notifications, n => n != closedNotification);
  }
  getNotificationWithValue(aValue) {
    var notifications = this.allNotifications;
    for (var n = notifications.length - 1; n >= 0; n--) {
      if (aValue == notifications[n].getAttribute("value"))
        return notifications[n];
    }
    return null;
  }
  appendNotification(aLabel, aValue, aImage, aPriority, aButtons, aEventCallback) {
    if (aPriority < this.PRIORITY_INFO_LOW ||
      aPriority > this.PRIORITY_CRITICAL_BLOCK)
      throw "Invalid notification priority " + aPriority;

    // check for where the notification should be inserted according to
    // priority. If two are equal, the existing one appears on top.
    var notifications = this.allNotifications;
    var insertPos = null;
    for (var n = notifications.length - 1; n >= 0; n--) {
      if (notifications[n].priority < aPriority)
        break;
      insertPos = notifications[n];
    }

    const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    var newitem = document.createElementNS(XULNS, "notification");
    // Can't use instanceof in case this was created from a different document:
    let labelIsDocFragment = aLabel && typeof aLabel == "object" && aLabel.nodeType &&
      aLabel.nodeType == aLabel.DOCUMENT_FRAGMENT_NODE;
    if (!labelIsDocFragment)
      newitem.setAttribute("label", aLabel);
    newitem.setAttribute("value", aValue);
    if (aImage)
      newitem.setAttribute("image", aImage);
    newitem.eventCallback = aEventCallback;

    if (aButtons) {
      // The notification-button-default class is added to the button
      // with isDefault set to true. If there is no such button, it is
      // added to the first button (unless that button has isDefault
      // set to false). There cannot be multiple default buttons.
      var defaultElem;

      for (var b = 0; b < aButtons.length; b++) {
        var button = aButtons[b];
        var buttonElem = document.createElementNS(XULNS, "button");
        buttonElem.setAttribute("label", button.label);
        if (typeof button.accessKey == "string")
          buttonElem.setAttribute("accesskey", button.accessKey);
        if (typeof button.type == "string") {
          buttonElem.setAttribute("type", button.type);
          if ((button.type == "menu-button" || button.type == "menu") &&
            "popup" in button) {
            buttonElem.appendChild(button.popup);
            delete button.popup;
          }
          if (typeof button.anchor == "string")
            buttonElem.setAttribute("anchor", button.anchor);
        }
        buttonElem.classList.add("notification-button");

        if (button.isDefault ||
          b == 0 && !("isDefault" in button))
          defaultElem = buttonElem;

        newitem.appendChild(buttonElem);
        buttonElem.buttonInfo = button;
      }

      if (defaultElem)
        defaultElem.classList.add("notification-button-default");
    }

    newitem.setAttribute("priority", aPriority);
    if (aPriority >= this.PRIORITY_CRITICAL_LOW)
      newitem.setAttribute("type", "critical");
    else if (aPriority <= this.PRIORITY_INFO_HIGH)
      newitem.setAttribute("type", "info");
    else
      newitem.setAttribute("type", "warning");

    if (!insertPos) {
      newitem.style.position = "fixed";
      newitem.style.top = "100%";
      newitem.style.marginTop = "-15px";
      newitem.style.opacity = "0";
    }
    this.insertBefore(newitem, insertPos);
    // Can only insert the document fragment after the item has been created because
    // otherwise the XBL structure isn't there yet:
    if (labelIsDocFragment) {
      document.getAnonymousElementByAttribute(newitem, "anonid", "messageText")
        .appendChild(aLabel);
    }

    if (!insertPos)
      this._showNotification(newitem, true);

    // Fire event for accessibility APIs
    var event = document.createEvent("Events");
    event.initEvent("AlertActive", true, true);
    newitem.dispatchEvent(event);

    return newitem;
  }
  removeNotification(aItem, aSkipAnimation) {
    if (aItem == this.currentNotification)
      this.removeCurrentNotification(aSkipAnimation);
    else if (aItem != this._closedNotification)
      this._removeNotificationElement(aItem);
    return aItem;
  }
  _removeNotificationElement(aChild) {
    if (aChild.eventCallback)
      aChild.eventCallback("removed");
    this.removeChild(aChild);

    // make sure focus doesn't get lost (workaround for bug 570835)
    let fm = Components.classes["@mozilla.org/focus-manager;1"]
      .getService(Components.interfaces.nsIFocusManager);
    if (!fm.getFocusedElementForWindow(window, false, {}))
      fm.moveFocus(window, this, fm.MOVEFOCUS_FORWARD, 0);
  }
  removeCurrentNotification(aSkipAnimation) {
    this._showNotification(this.currentNotification, false, aSkipAnimation);
  }
  removeAllNotifications(aImmediate) {
    var notifications = this.allNotifications;
    for (var n = notifications.length - 1; n >= 0; n--) {
      if (aImmediate)
        this._removeNotificationElement(notifications[n]);
      else
        this.removeNotification(notifications[n]);
    }
    this.currentNotification = null;

    // Clean up any currently-animating notification; this is necessary
    // if a notification was just opened and is still animating, but we
    // want to close it *without* animating.  This can even happen if
    // the user toggled `toolkit.cosmeticAnimations.enabled` to false
    // and called this method immediately after an animated notification
    // displayed (although this case isn't very likely).
    if (aImmediate || !this._allowAnimation)
      this._finishAnimation();
  }
  removeTransientNotifications() {
    var notifications = this.allNotifications;
    for (var n = notifications.length - 1; n >= 0; n--) {
      var notification = notifications[n];
      if (notification.persistence)
        notification.persistence--;
      else if (Date.now() > notification.timeout)
        this.removeNotification(notification);
    }
  }
  _showNotification(aNotification, aSlideIn, aSkipAnimation) {
    this._finishAnimation();

    var height = aNotification.boxObject.height;
    var skipAnimation = aSkipAnimation || height == 0 ||
      !this._allowAnimation;
    aNotification.classList.toggle("animated", !skipAnimation);

    if (aSlideIn) {
      this.currentNotification = aNotification;
      aNotification.style.removeProperty("position");
      aNotification.style.removeProperty("top");
      aNotification.style.removeProperty("margin-top");
      aNotification.style.removeProperty("opacity");

      if (skipAnimation) {
        this._setBlockingState(this.currentNotification);
        return;
      }
    } else {
      this._closedNotification = aNotification;
      var notifications = this.allNotifications;
      var idx = notifications.length - 1;
      this.currentNotification = (idx >= 0) ? notifications[idx] : null;

      if (skipAnimation) {
        this._removeNotificationElement(this._closedNotification);
        this._closedNotification = null;
        this._setBlockingState(this.currentNotification);
        return;
      }

      aNotification.style.marginTop = -height + "px";
      aNotification.style.opacity = 0;
    }

    this._animating = true;
  }
  _finishAnimation() {
    if (this._animating) {
      this._animating = false;
      if (this._closedNotification) {
        this._removeNotificationElement(this._closedNotification);
        this._closedNotification = null;
      }
      this._setBlockingState(this.currentNotification);
    }
  }
  _setBlockingState(aNotification) {
    var isblock = aNotification &&
      aNotification.priority == this.PRIORITY_CRITICAL_BLOCK;
    var canvas = this._blockingCanvas;
    if (isblock) {
      if (!canvas)
        canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
      const XULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      let content = this.firstChild;
      if (!content ||
        content.namespaceURI != XULNS ||
        content.localName != "browser")
        return;

      var width = content.boxObject.width;
      var height = content.boxObject.height;
      content.collapsed = true;

      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      canvas.setAttribute("flex", "1");

      this.appendChild(canvas);
      this._blockingCanvas = canvas;

      var bgcolor = "white";
      try {
        var prefService = Components.classes["@mozilla.org/preferences-service;1"].
        getService(Components.interfaces.nsIPrefBranch);
        bgcolor = prefService.getCharPref("browser.display.background_color");

        var win = content.contentWindow;
        var context = canvas.getContext("2d");
        context.globalAlpha = 0.5;
        context.drawWindow(win, win.scrollX, win.scrollY,
          width, height, bgcolor);
      } catch (ex) {}
    } else if (canvas) {
      canvas.remove();
      this._blockingCanvas = null;
      let content = this.firstChild;
      if (content)
        content.collapsed = false;
    }
  }

  _setupEventListeners() {

    this.addEventListener("transitionend", (event) => {
      if (event.target.localName == "notification" &&
        event.propertyName == "margin-top")
        this._finishAnimation();
    });

  }
}