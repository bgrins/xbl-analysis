class FirefoxDialog extends FirefoxRootElement {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:vbox class="box-inherit dialog-content-box" flex="1">
<children>
</children>
</xul:vbox>
<xul:hbox class="dialog-button-box" anonid="buttons" inherits="pack=buttonpack,align=buttonalign,dir=buttondir,orient=buttonorient" pack="end">
<xul:button dlgtype="extra2" class="dialog-button" hidden="true">
</xul:button>
<xul:spacer anonid="spacer" flex="1" hidden="true">
</xul:spacer>
<xul:button dlgtype="accept" class="dialog-button" inherits="disabled=buttondisabledaccept">
</xul:button>
<xul:button dlgtype="extra1" class="dialog-button" hidden="true">
</xul:button>
<xul:button dlgtype="cancel" class="dialog-button">
</xul:button>
<xul:button dlgtype="help" class="dialog-button" hidden="true">
</xul:button>
<xul:button dlgtype="disclosure" class="dialog-button" hidden="true">
</xul:button>
</xul:hbox>`;
    let comment = document.createComment("Creating firefox-dialog");
    this.prepend(comment);

    Object.defineProperty(this, "_mStrBundle", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._mStrBundle;
        return (this._mStrBundle = null);
      },
      set(val) {
        delete this._mStrBundle;
        return (this._mStrBundle = val);
      }
    });
    Object.defineProperty(this, "_closeHandler", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._closeHandler;
        return (this._closeHandler = function(event) {
          if (!document.documentElement.cancelDialog()) event.preventDefault();
        });
      },
      set(val) {
        delete this._closeHandler;
        return (this._closeHandler = val);
      }
    });

    this._configureButtons(this.buttons);

    // listen for when window is closed via native close buttons
    window.addEventListener("close", this._closeHandler);

    // for things that we need to initialize after onload fires
    window.addEventListener("load", this.postLoadInit);

    window.moveToAlertPosition = this.moveToAlertPosition;
    window.centerWindowOnScreen = this.centerWindowOnScreen;

    this.addEventListener("keypress", event => {
      this._hitEnter(event);
    });

    this.addEventListener("keypress", event => {
      if (!event.defaultPrevented) this.cancelDialog();
    });

    this.addEventListener(
      "focus",
      event => {
        var btn = this.getButton(this.defaultButton);
        if (btn)
          btn.setAttribute(
            "default",
            event.originalTarget == btn ||
              !(
                event.originalTarget instanceof
                Components.interfaces.nsIDOMXULButtonElement
              )
          );
      },
      true
    );
  }
  disconnectedCallback() {}

  set buttons(val) {
    this._configureButtons(val);
    return val;
  }

  get buttons() {
    return this.getAttribute("buttons");
  }

  set defaultButton(val) {
    this._setDefaultButton(val);
    return val;
  }

  get defaultButton() {
    if (this.hasAttribute("defaultButton"))
      return this.getAttribute("defaultButton");
    return "accept"; // default to the accept button
  }

  get mStrBundle() {
    if (!this._mStrBundle) {
      // need to create string bundle manually instead of using <xul:stringbundle/>
      // see bug 63370 for details
      this._mStrBundle = Components.classes["@mozilla.org/intl/stringbundle;1"]
        .getService(Components.interfaces.nsIStringBundleService)
        .createBundle("chrome://global/locale/dialog.properties");
    }
    return this._mStrBundle;
  }
  acceptDialog() {
    return this._doButtonCommand("accept");
  }
  cancelDialog() {
    return this._doButtonCommand("cancel");
  }
  getButton(aDlgType) {
    return this._buttons[aDlgType];
  }
  moveToAlertPosition() {
    // hack. we need this so the window has something like its final size
    if (window.outerWidth == 1) {
      dump(
        "Trying to position a sizeless window; caller should have called sizeToContent() or sizeTo(). See bug 75649.\n"
      );
      sizeToContent();
    }

    if (opener) {
      var xOffset = (opener.outerWidth - window.outerWidth) / 2;
      var yOffset = opener.outerHeight / 5;

      var newX = opener.screenX + xOffset;
      var newY = opener.screenY + yOffset;
    } else {
      newX = (screen.availWidth - window.outerWidth) / 2;
      newY = (screen.availHeight - window.outerHeight) / 2;
    }

    // ensure the window is fully onscreen (if smaller than the screen)
    if (newX < screen.availLeft) newX = screen.availLeft + 20;
    if (newX + window.outerWidth > screen.availLeft + screen.availWidth)
      newX = screen.availLeft + screen.availWidth - window.outerWidth - 20;

    if (newY < screen.availTop) newY = screen.availTop + 20;
    if (newY + window.outerHeight > screen.availTop + screen.availHeight)
      newY = screen.availTop + screen.availHeight - window.outerHeight - 60;

    window.moveTo(newX, newY);
  }
  centerWindowOnScreen() {
    var xOffset = screen.availWidth / 2 - window.outerWidth / 2;
    var yOffset = screen.availHeight / 2 - window.outerHeight / 2;

    xOffset = xOffset > 0 ? xOffset : 0;
    yOffset = yOffset > 0 ? yOffset : 0;
    window.moveTo(xOffset, yOffset);
  }
  postLoadInit(aEvent) {
    function focusInit() {
      const dialog = document.documentElement;
      const defaultButton = dialog.getButton(dialog.defaultButton);
      // give focus to the first focusable element in the dialog
      if (!document.commandDispatcher.focusedElement) {
        document.commandDispatcher.advanceFocusIntoSubtree(dialog);

        var focusedElt = document.commandDispatcher.focusedElement;
        if (focusedElt) {
          var initialFocusedElt = focusedElt;
          while (
            focusedElt.localName == "tab" ||
            focusedElt.getAttribute("noinitialfocus") == "true"
          ) {
            document.commandDispatcher.advanceFocusIntoSubtree(focusedElt);
            focusedElt = document.commandDispatcher.focusedElement;
            if (focusedElt == initialFocusedElt) {
              if (focusedElt.getAttribute("noinitialfocus") == "true") {
                focusedElt.blur();
              }
              break;
            }
          }

          if (initialFocusedElt.localName == "tab") {
            if (focusedElt.hasAttribute("dlgtype")) {
              // We don't want to focus on anonymous OK, Cancel, etc. buttons,
              // so return focus to the tab itself
              initialFocusedElt.focus();
            }
          } else if (
            !/Mac/.test(navigator.platform) &&
            focusedElt.hasAttribute("dlgtype") &&
            focusedElt != defaultButton
          ) {
            defaultButton.focus();
          }
        }
      }

      try {
        if (defaultButton) window.notifyDefaultButtonLoaded(defaultButton);
      } catch (e) {}
    }

    // Give focus after onload completes, see bug 103197.
    setTimeout(focusInit, 0);
  }
  _configureButtons(aButtons) {
    // by default, get all the anonymous button elements
    var buttons = {};
    this._buttons = buttons;
    buttons.accept = document.getAnonymousElementByAttribute(
      this,
      "dlgtype",
      "accept"
    );
    buttons.cancel = document.getAnonymousElementByAttribute(
      this,
      "dlgtype",
      "cancel"
    );
    buttons.extra1 = document.getAnonymousElementByAttribute(
      this,
      "dlgtype",
      "extra1"
    );
    buttons.extra2 = document.getAnonymousElementByAttribute(
      this,
      "dlgtype",
      "extra2"
    );
    buttons.help = document.getAnonymousElementByAttribute(
      this,
      "dlgtype",
      "help"
    );
    buttons.disclosure = document.getAnonymousElementByAttribute(
      this,
      "dlgtype",
      "disclosure"
    );

    // look for any overriding explicit button elements
    var exBtns = this.getElementsByAttribute("dlgtype", "*");
    var dlgtype;
    var i;
    for (i = 0; i < exBtns.length; ++i) {
      dlgtype = exBtns[i].getAttribute("dlgtype");
      buttons[dlgtype].hidden = true; // hide the anonymous button
      buttons[dlgtype] = exBtns[i];
    }

    // add the label and oncommand handler to each button
    for (dlgtype in buttons) {
      var button = buttons[dlgtype];
      button.addEventListener("command", this._handleButtonCommand, true);

      // don't override custom labels with pre-defined labels on explicit buttons
      if (!button.hasAttribute("label")) {
        // dialog attributes override the default labels in dialog.properties
        if (this.hasAttribute("buttonlabel" + dlgtype)) {
          button.setAttribute(
            "label",
            this.getAttribute("buttonlabel" + dlgtype)
          );
          if (this.hasAttribute("buttonaccesskey" + dlgtype))
            button.setAttribute(
              "accesskey",
              this.getAttribute("buttonaccesskey" + dlgtype)
            );
        } else if (dlgtype != "extra1" && dlgtype != "extra2") {
          button.setAttribute(
            "label",
            this.mStrBundle.GetStringFromName("button-" + dlgtype)
          );
          var accessKey = this.mStrBundle.GetStringFromName(
            "accesskey-" + dlgtype
          );
          if (accessKey) button.setAttribute("accesskey", accessKey);
        }
      }
      // allow specifying alternate icons in the dialog header
      if (!button.hasAttribute("icon")) {
        // if there's an icon specified, use that
        if (this.hasAttribute("buttonicon" + dlgtype))
          button.setAttribute(
            "icon",
            this.getAttribute("buttonicon" + dlgtype)
          );
        else
          // otherwise set defaults
          switch (dlgtype) {
            case "accept":
              button.setAttribute("icon", "accept");
              break;
            case "cancel":
              button.setAttribute("icon", "cancel");
              break;
            case "disclosure":
              button.setAttribute("icon", "properties");
              break;
            case "help":
              button.setAttribute("icon", "help");
              break;
            default:
              break;
          }
      }
    }

    // ensure that hitting enter triggers the default button command
    this.defaultButton = this.defaultButton;

    // if there is a special button configuration, use it
    if (aButtons) {
      // expect a comma delimited list of dlgtype values
      var list = aButtons.split(",");

      // mark shown dlgtypes as true
      var shown = {
        accept: false,
        cancel: false,
        help: false,
        disclosure: false,
        extra1: false,
        extra2: false
      };
      for (i = 0; i < list.length; ++i) shown[list[i].replace(/ /g, "")] = true;

      // hide/show the buttons we want
      for (dlgtype in buttons) buttons[dlgtype].hidden = !shown[dlgtype];

      // show the spacer on Windows only when the extra2 button is present
      if (/Win/.test(navigator.platform)) {
        var spacer = document.getAnonymousElementByAttribute(
          this,
          "anonid",
          "spacer"
        );
        spacer.removeAttribute("hidden");
        spacer.setAttribute("flex", shown.extra2 ? "1" : "0");
      }
    }
  }
  _setDefaultButton(aNewDefault) {
    // remove the default attribute from the previous default button, if any
    var oldDefaultButton = this.getButton(this.defaultButton);
    if (oldDefaultButton) oldDefaultButton.removeAttribute("default");

    var newDefaultButton = this.getButton(aNewDefault);
    if (newDefaultButton) {
      this.setAttribute("defaultButton", aNewDefault);
      newDefaultButton.setAttribute("default", "true");
    } else {
      this.setAttribute("defaultButton", "none");
      if (aNewDefault != "none")
        dump(
          "invalid new default button: " + aNewDefault + ", assuming: none\n"
        );
    }
  }
  _handleButtonCommand(aEvent) {
    return document.documentElement._doButtonCommand(
      aEvent.target.getAttribute("dlgtype")
    );
  }
  _doButtonCommand(aDlgType) {
    var button = this.getButton(aDlgType);
    if (!button.disabled) {
      var noCancel = this._fireButtonEvent(aDlgType);
      if (noCancel) {
        if (aDlgType == "accept" || aDlgType == "cancel") {
          var closingEvent = new CustomEvent("dialogclosing", {
            bubbles: true,
            detail: { button: aDlgType }
          });
          this.dispatchEvent(closingEvent);
          window.close();
        }
      }
      return noCancel;
    }
    return true;
  }
  _fireButtonEvent(aDlgType) {
    var event = document.createEvent("Events");
    event.initEvent("dialog" + aDlgType, true, true);

    // handle dom event handlers
    var noCancel = this.dispatchEvent(event);

    // handle any xml attribute event handlers
    var handler = this.getAttribute("ondialog" + aDlgType);
    if (handler != "") {
      var fn = new Function("event", handler);
      var returned = fn(event);
      if (returned == false) noCancel = false;
    }

    return noCancel;
  }
  _hitEnter(evt) {
    if (evt.defaultPrevented) return;

    var btn = this.getButton(this.defaultButton);
    if (btn) this._doButtonCommand(this.defaultButton);
  }
}
customElements.define("firefox-dialog", FirefoxDialog);
