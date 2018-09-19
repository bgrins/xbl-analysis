/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozTabmodalprompt extends MozXULElement {
  constructor() {
    super();

    /**
     * Based on dialog.xml handlers
     */
    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_RETURN) { return; } this.onKeyAction('default', event); }, { mozSystemGroup: true });

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_ESCAPE) { return; } this.onKeyAction('cancel', event); }, { mozSystemGroup: true });

    this.addEventListener("focus", (event) => {
      let bnum = this.args.defaultButtonNum || 0;
      let defaultButton = this.ui["button" + bnum];

      let { AppConstants } =
      ChromeUtils.import("resource://gre/modules/AppConstants.jsm", {});
      if (AppConstants.platform == "macosx") {
        // On OS X, the default button always stays marked as such (until
        // the entire prompt blurs).
        defaultButton.setAttribute("default", true);
      } else {
        // On other platforms, the default button is only marked as such
        // when no other button has focus. XUL buttons on not-OSX will
        // react to pressing enter as a command, so you can't trigger the
        // default without tabbing to it or something that isn't a button.
        let focusedDefault = (event.originalTarget == defaultButton);
        let someButtonFocused = event.originalTarget instanceof Ci.nsIDOMXULButtonElement;
        defaultButton.setAttribute("default", focusedDefault || !someButtonFocused);
      }
    }, true);

    this.addEventListener("blur", (event) => {
      // If focus shifted to somewhere else in the browser, don't make
      // the default button look active.
      let bnum = this.args.defaultButtonNum || 0;
      let button = this.ui["button" + bnum];
      button.setAttribute("default", false);
    });

  }

  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <spacer flex="1"></spacer>
      <hbox pack="center">
        <vbox anonid="mainContainer" class="mainContainer">
          <grid class="topContainer" flex="1">
            <columns>
              <column></column>
              <column flex="1"></column>
            </columns>
            <rows>
              <vbox anonid="infoContainer" align="center" pack="center" flex="1">
                <description anonid="infoTitle" class="infoTitle" hidden="true"></description>
                <description anonid="infoBody" class="infoBody"></description>
              </vbox>
              <row anonid="loginContainer" hidden="true" align="center">
                <label anonid="loginLabel" value="FROM-DTD.editfield0.label;" control="loginTextbox"></label>
                <textbox anonid="loginTextbox"></textbox>
              </row>
              <row anonid="password1Container" hidden="true" align="center">
                <label anonid="password1Label" value="FROM-DTD.editfield1.label;" control="password1Textbox"></label>
                <textbox anonid="password1Textbox" type="password"></textbox>
              </row>
              <row anonid="checkboxContainer" hidden="true">
                <spacer></spacer>
                <checkbox anonid="checkbox"></checkbox>
              </row>
              <xbl:children includes="row"></xbl:children>
            </rows>
          </grid>
          <xbl:children></xbl:children>
          <hbox class="buttonContainer">
            <button anonid="button3" hidden="true"></button>
            <spacer anonid="buttonSpacer" flex="1"></spacer>
            <button anonid="button0" label="FROM-DTD.okButton.label;"></button>
            <button anonid="button2" hidden="true"></button>
            <button anonid="button1" label="FROM-DTD.cancelButton.label;"></button>
          </hbox>
        </vbox>
      </hbox>
      <spacer flex="2"></spacer>
    `));
    this.ui = "";

    this.args = "";

    this.linkedTab = "";

    this.onCloseCallback = "";

    this.Dialog = "";

    this.isLive = "";

    this.availWidth = "";

    this.availHeight = "";

    this.minWidth = "";

    this.minHeight = "";

    let self = this;

    function getElement(anonid) {
      return document.getAnonymousElementByAttribute(self, "anonid", anonid);
    }

    this.ui = {
      prompt: this,
      loginContainer: getElement("loginContainer"),
      loginTextbox: getElement("loginTextbox"),
      loginLabel: getElement("loginLabel"),
      password1Container: getElement("password1Container"),
      password1Textbox: getElement("password1Textbox"),
      password1Label: getElement("password1Label"),
      infoBody: getElement("infoBody"),
      infoTitle: getElement("infoTitle"),
      infoIcon: null,
      checkbox: getElement("checkbox"),
      checkboxContainer: getElement("checkboxContainer"),
      button3: getElement("button3"),
      button2: getElement("button2"),
      button1: getElement("button1"),
      button0: getElement("button0"),
      // focusTarget (for BUTTON_DELAY_ENABLE) not yet supported
    };

    this.ui.button0.addEventListener("command", this.onButtonClick.bind(this, 0));
    this.ui.button1.addEventListener("command", this.onButtonClick.bind(this, 1));
    this.ui.button2.addEventListener("command", this.onButtonClick.bind(this, 2));
    this.ui.button3.addEventListener("command", this.onButtonClick.bind(this, 3));
    // Anonymous wrapper used here because |Dialog| doesn't exist until init() is called!
    this.ui.checkbox.addEventListener("command", function() { self.Dialog.onCheckbox(); });
    this.isLive = false;

  }

  init(args, linkedTab, onCloseCallback) {
    this.args = args;
    this.linkedTab = linkedTab;
    this.onCloseCallback = onCloseCallback;

    if (args.enableDelay)
      throw "BUTTON_DELAY_ENABLE not yet supported for tab-modal prompts";

    // We need to remove the prompt when the tab or browser window is closed or
    // the page navigates, else we never unwind the event loop and that's sad times.
    // Remember to cleanup in shutdownPrompt()!
    this.isLive = true;
    window.addEventListener("resize", this);
    window.addEventListener("unload", this);
    if (linkedTab) {
      linkedTab.addEventListener("TabClose", this);
    }
    // Note:
    // nsPrompter.js or in e10s mode browser-parent.js call abortPrompt,
    // when the domWindow, for which the prompt was created, generates
    // a "pagehide" event.

    let tmp = {};
    ChromeUtils.import("resource://gre/modules/CommonDialog.jsm", tmp);
    this.Dialog = new tmp.CommonDialog(args, this.ui);
    this.Dialog.onLoad(null);

    // Display the tabprompt title that shows the prompt origin when
    // the prompt origin is not the same as that of the top window.
    if (!args.showAlertOrigin)
      this.ui.infoTitle.removeAttribute("hidden");

    // TODO: should unhide buttonSpacer on Windows when there are 4 buttons.
    //       Better yet, just drop support for 4-button dialogs. (bug 609510)

    this.onResize();
  }

  shutdownPrompt() {
    // remove our event listeners
    try {
      window.removeEventListener("resize", this);
      window.removeEventListener("unload", this);
      if (this.linkedTab) {
        this.linkedTab.removeEventListener("TabClose", this);
      }
    } catch (e) {}
    this.isLive = false;
    // invoke callback
    this.onCloseCallback();
  }

  abortPrompt() {
    // Called from other code when the page changes.
    this.Dialog.abortPrompt();
    this.shutdownPrompt();
  }

  handleEvent(aEvent) {
    switch (aEvent.type) {
      case "resize":
        this.onResize();
        break;
      case "unload":
      case "TabClose":
        this.abortPrompt();
        break;
    }
  }

  onResize() {
    let availWidth = this.clientWidth;
    let availHeight = this.clientHeight;
    if (availWidth == this.availWidth && availHeight == this.availHeight)
      return;
    this.availWidth = availWidth;
    this.availHeight = availHeight;

    let self = this;

    function getElement(anonid) {
      return document.getAnonymousElementByAttribute(self, "anonid", anonid);
    }
    let main = getElement("mainContainer");
    let info = getElement("infoContainer");
    let body = this.ui.infoBody;

    // cap prompt dimensions at 60% width and 60% height of content area
    if (!this.minWidth)
      this.minWidth = parseInt(window.getComputedStyle(main).minWidth);
    if (!this.minHeight)
      this.minHeight = parseInt(window.getComputedStyle(main).minHeight);
    let maxWidth = Math.max(Math.floor(availWidth * 0.6), this.minWidth) +
      info.clientWidth - main.clientWidth;
    let maxHeight = Math.max(Math.floor(availHeight * 0.6), this.minHeight) +
      info.clientHeight - main.clientHeight;
    body.style.maxWidth = maxWidth + "px";
    info.style.overflow = info.style.width = info.style.height = "";

    // when prompt text is too long, use scrollbars
    if (info.clientWidth > maxWidth) {
      info.style.overflow = "auto";
      info.style.width = maxWidth + "px";
    }
    if (info.clientHeight > maxHeight) {
      info.style.overflow = "auto";
      info.style.height = maxHeight + "px";
    }
  }

  onButtonClick(buttonNum) {
    // We want to do all the work her asynchronously off a Gecko
    // runnable, because of situations like the one described in
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1167575#c35 : we
    // get here off processing of an OS event and will also process
    // one more Gecko runnable before we break out of the event loop
    // spin whoever posted the prompt is doing.  If we do all our
    // work sync, we will exit modal state _before_ processing that
    // runnable, and if exiting moral state posts a runnable we will
    // incorrectly process that runnable before leaving our event
    // loop spin.
    Services.tm.dispatchToMainThread(() => {
      this.Dialog["onButton" + buttonNum]();
      this.shutdownPrompt();
    });
  }

  onKeyAction(action, event) {
    if (event.defaultPrevented)
      return;

    event.stopPropagation();
    if (action == "default") {
      let bnum = this.args.defaultButtonNum || 0;
      this.onButtonClick(bnum);
    } else { // action == "cancel"
      this.onButtonClick(1); // Cancel button
    }
  }
  disconnectedCallback() {
    if (this.isLive) {
      this.abortPrompt();
    }
  }
}

customElements.define("tabmodalprompt", MozTabmodalprompt);

}
