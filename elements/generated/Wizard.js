/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// This is loaded into all XUL windows. Wrap in a block to prevent
// leaking to window scope.
{

class MozWizard extends MozXULElement {
  constructor() {
    super();

    this.addEventListener("keypress", (event) => { if (event.keyCode != KeyEvent.DOM_VK_RETURN) { return; } this._hitEnter(event) }, { mozSystemGroup: true });

    this.addEventListener("keypress", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_ESCAPE) { return; }
      if (!event.defaultPrevented)
        this.cancel();
    }, { mozSystemGroup: true });

  }

  connectedCallback() {
    if (this.delayConnectedCallback()) {
      return;
    }
    this.textContent = "";
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="wizard-header" anonid="Header"></hbox>
      <deck class="wizard-page-box" flex="1" anonid="Deck">
        <children includes="wizardpage"></children>
      </deck>
      <children></children>
      <hbox class="wizard-buttons" anonid="Buttons" inherits="pagestep,firstpage,lastpage"></hbox>
    `));
    // XXX: Implement `this.inheritAttribute()` for the [inherits] attribute in the markup above!

    this.pageCount = 0;

    this._accessMethod = null;

    this._pageStack = null;

    this._currentPage = null;

    this._canAdvance = "";

    this._canRewind = "";

    this._wizardHeader = "";

    this._wizardButtons = "";

    this._deck = "";

    this._backButton = "";

    this._nextButton = "";

    this._cancelButton = "";

    /**
     * functions to be added as oncommand listeners to the wizard buttons
     */
    this._backFunc = function() { document.documentElement.rewind(); };

    this._nextFunc = function() { document.documentElement.advance(); };

    this._finishFunc = function() { document.documentElement.advance(); };

    this._cancelFunc = function() { document.documentElement.cancel(); };

    this._extra1Func = function() { document.documentElement.extra1(); };

    this._extra2Func = function() { document.documentElement.extra2(); };

    this._closeHandler = function(event) {
      if (document.documentElement.cancel())
        event.preventDefault();
    };

    this._canAdvance = true;
    this._canRewind = false;
    this._hasLoaded = false;

    this._pageStack = [];

    try {
      // need to create string bundle manually instead of using <xul:stringbundle/>
      // see bug 63370 for details
      this._bundle = Cc["@mozilla.org/intl/stringbundle;1"]
        .getService(Ci.nsIStringBundleService)
        .createBundle("chrome://global/locale/wizard.properties");
    } catch (e) {
      // This fails in remote XUL, which has to provide titles for all pages
      // see bug 142502
    }

    // get anonymous content references
    this._wizardHeader = document.getAnonymousElementByAttribute(this, "anonid", "Header");
    this._wizardButtons = document.getAnonymousElementByAttribute(this, "anonid", "Buttons");
    this._deck = document.getAnonymousElementByAttribute(this, "anonid", "Deck");

    this._initWizardButton("back");
    this._initWizardButton("next");
    this._initWizardButton("finish");
    this._initWizardButton("cancel");
    this._initWizardButton("extra1");
    this._initWizardButton("extra2");

    this._initPages();

    window.addEventListener("close", this._closeHandler);

    // start off on the first page
    this.pageCount = this.wizardPages.length;
    this.advance();

    // give focus to the first focusable element in the dialog
    window.addEventListener("load", this._setInitialFocus);

  }

  set title(val) {
    return document.title = val;
  }

  get title() {
    return document.title;
  }

  set canAdvance(val) {
    this._nextButton.disabled = !val;
    return this._canAdvance = val;
  }

  get canAdvance() {
    return this._canAdvance;
  }

  set canRewind(val) {
    this._backButton.disabled = !val;
    return this._canRewind = val;
  }

  get canRewind() {
    return this._canRewind;
  }

  get pageStep() {
    return this._pageStack.length
  }

  get wizardPages() {
    var xulns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    return this.getElementsByTagNameNS(xulns, "wizardpage");
  }

  set currentPage(val) {
    if (!val)
      return val;

    this._currentPage = val;

    // Setting this attribute allows wizard's clients to dynamically
    // change the styles of each page based on purpose of the page.
    this.setAttribute("currentpageid", val.pageid);
    if (this.onFirstPage) {
      this.canRewind = false;
      this.setAttribute("firstpage", "true");
      if (/Linux/.test(navigator.platform)) {
        this._backButton.setAttribute('hidden', 'true');
      }
    } else {
      this.canRewind = true;
      this.setAttribute("firstpage", "false");
      if (/Linux/.test(navigator.platform)) {
        this._backButton.setAttribute('hidden', 'false');
      }
    }

    if (this.onLastPage) {
      this.canAdvance = true;
      this.setAttribute("lastpage", "true");
    } else {
      this.setAttribute("lastpage", "false");
    }

    this._deck.setAttribute("selectedIndex", val.pageIndex);
    this._advanceFocusToPage(val);

    this._adjustWizardHeader();
    this._wizardButtons.onPageChange();

    this._fireEvent(val, "pageshow");

    return val;
  }

  get currentPage() {
    return this._currentPage
  }

  set pageIndex(val) {
    if (val < 0 || val >= this.pageCount)
      return val;

    var page = this.wizardPages[val];
    this._pageStack[this._pageStack.length - 1] = page;
    this.currentPage = page;

    return val;
  }

  get pageIndex() {
    return this._currentPage ? this._currentPage.pageIndex : -1;
  }

  get onFirstPage() {
    return this._pageStack.length == 1;
  }

  get onLastPage() {
    var cp = this.currentPage;
    return cp && ((this._accessMethod == "sequential" && cp.pageIndex == this.pageCount - 1) ||
      (this._accessMethod == "random" && cp.next == ""));
  }

  getButton(aDlgType) {
    var btns = this.getElementsByAttribute("dlgtype", aDlgType);
    return btns.item(0) ? btns[0] : document.getAnonymousElementByAttribute(this._wizardButtons, "dlgtype", aDlgType);
  }

  getPageById(aPageId) {
    var els = this.getElementsByAttribute("pageid", aPageId);
    return els.item(0);
  }

  extra1() {
    if (this.currentPage)
      this._fireEvent(this.currentPage, "extra1");
  }

  extra2() {
    if (this.currentPage)
      this._fireEvent(this.currentPage, "extra2");
  }

  rewind() {
    if (!this.canRewind)
      return;

    if (this.currentPage && !this._fireEvent(this.currentPage, "pagehide"))
      return;

    if (this.currentPage && !this._fireEvent(this.currentPage, "pagerewound"))
      return;

    if (!this._fireEvent(this, "wizardback"))
      return;

    this._pageStack.pop();
    this.currentPage = this._pageStack[this._pageStack.length - 1];
    this.setAttribute("pagestep", this._pageStack.length);
  }

  advance(aPageId) {
    if (!this.canAdvance)
      return;

    if (this.currentPage && !this._fireEvent(this.currentPage, "pagehide"))
      return;

    if (this.currentPage && !this._fireEvent(this.currentPage, "pageadvanced"))
      return;

    if (this.onLastPage && !aPageId) {
      if (this._fireEvent(this, "wizardfinish"))
        window.setTimeout(function() { window.close(); }, 1);
    } else {
      if (!this._fireEvent(this, "wizardnext"))
        return;

      var page;
      if (aPageId)
        page = this.getPageById(aPageId);
      else {
        if (this.currentPage) {
          if (this._accessMethod == "random")
            page = this.getPageById(this.currentPage.next);
          else
            page = this.wizardPages[this.currentPage.pageIndex + 1];
        } else
          page = this.wizardPages[0];
      }

      if (page) {
        this._pageStack.push(page);
        this.setAttribute("pagestep", this._pageStack.length);

        this.currentPage = page;
      }
    }
  }

  goTo(aPageId) {
    var page = this.getPageById(aPageId);
    if (page) {
      this._pageStack[this._pageStack.length - 1] = page;
      this.currentPage = page;
    }
  }

  cancel() {
    if (!this._fireEvent(this, "wizardcancel"))
      return true;

    window.close();
    window.setTimeout(function() { window.close(); }, 1);
    return false;
  }

  _setInitialFocus(aEvent) {
    document.documentElement._hasLoaded = true;
    var focusInit =
      function() {
        // give focus to the first focusable element in the dialog
        if (!document.commandDispatcher.focusedElement)
          document.commandDispatcher.advanceFocusIntoSubtree(document.documentElement);

        try {
          var button =
            document.documentElement._wizardButtons.defaultButton;
          if (button)
            window.notifyDefaultButtonLoaded(button);
        } catch (e) {}
      };

    // Give focus after onload completes, see bug 103197.
    setTimeout(focusInit, 0);
  }

  _advanceFocusToPage(aPage) {
    if (!this._hasLoaded)
      return;

    document.commandDispatcher.advanceFocusIntoSubtree(aPage);

    // if advanceFocusIntoSubtree tries to focus one of our
    // dialog buttons, then remove it and put it on the root
    var focused = document.commandDispatcher.focusedElement;
    if (focused && focused.hasAttribute("dlgtype"))
      this.focus();
  }

  _initPages() {
    var meth = "sequential";
    var pages = this.wizardPages;
    for (var i = 0; i < pages.length; ++i) {
      var page = pages[i];
      page.pageIndex = i;
      if (page.next != "")
        meth = "random";
    }
    this._accessMethod = meth;
  }

  _initWizardButton(aName) {
    var btn = document.getAnonymousElementByAttribute(this._wizardButtons, "dlgtype", aName);
    if (btn) {
      btn.addEventListener("command", this["_" + aName + "Func"]);
      this["_" + aName + "Button"] = btn;
    }
    return btn;
  }

  _adjustWizardHeader() {
    var label = this.currentPage.getAttribute("label");
    if (!label && this.onFirstPage && this._bundle) {
      if (/Mac/.test(navigator.platform)) {
        label = this._bundle.GetStringFromName("default-first-title-mac");
      } else {
        label = this._bundle.formatStringFromName("default-first-title", [this.title], 1);
      }
    } else if (!label && this.onLastPage && this._bundle) {
      if (/Mac/.test(navigator.platform)) {
        label = this._bundle.GetStringFromName("default-last-title-mac");
      } else {
        label = this._bundle.formatStringFromName("default-last-title", [this.title], 1);
      }
    }
    this._wizardHeader.setAttribute("label", label);
    this._wizardHeader.setAttribute("description", this.currentPage.getAttribute("description"));
  }

  _hitEnter(evt) {
    if (!evt.defaultPrevented)
      this.advance();
  }

  _fireEvent(aTarget, aType) {
    var event = document.createEvent("Events");
    event.initEvent(aType, true, true);

    // handle dom event handlers
    var noCancel = aTarget.dispatchEvent(event);

    // handle any xml attribute event handlers
    var handler = aTarget.getAttribute("on" + aType);
    if (handler != "") {
      var fn = new Function("event", handler);
      var returned = fn.apply(aTarget, [event]);
      if (returned == false)
        noCancel = false;
    }

    return noCancel;
  }
}

customElements.define("wizard", MozWizard);

}
