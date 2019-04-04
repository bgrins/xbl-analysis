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

    this.addEventListener("keypress", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_RETURN) {
        return;
      }
      this._hitEnter(event)
    }, { mozSystemGroup: true });

    this.addEventListener("keypress", (event) => {
      if (event.keyCode != KeyEvent.DOM_VK_ESCAPE) {
        return;
      }

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
      <wizard-buttons class="wizard-buttons" anonid="Buttons" inherits="pagestep,firstpage,lastpage"></wizard-buttons>
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

    this._wizardHeader.appendChild(
      MozXULElement.parseXULToFragment(/Mac/.test(navigator.platform) ?
        `<stack class="wizard-header-stack" flex="1">
              <vbox class="wizard-header-box-1">
                <vbox class="wizard-header-box-text">
                  <label class="wizard-header-label"/>
                </vbox>
              </vbox>
              <hbox class="wizard-header-box-icon">
                <spacer flex="1"/>
                <image class="wizard-header-icon"/>
              </hbox>
            </stack>` :
        `<hbox class="wizard-header-box-1" flex="1">
              <vbox class="wizard-header-box-text" flex="1">
                <label class="wizard-header-label"/>
                <label class="wizard-header-description"/>
              </vbox>
              <image class="wizard-header-icon"/>
            </hbox>`
      )
    );

    this._wizardButtons = document.getAnonymousElementByAttribute(this, "anonid", "Buttons");
    customElements.upgrade(this._wizardButtons);

    this._deck = document.getAnonymousElementByAttribute(this, "anonid", "Deck");

    this._initPages();

    window.addEventListener("close", (event) => {
      if (document.documentElement.cancel()) {
        event.preventDefault();
      }
    });

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
    this.getButton('next').disabled = !val;
    return this._canAdvance = val;
  }

  get canAdvance() {
    return this._canAdvance;
  }

  set canRewind(val) {
    this.getButton('back').disabled = !val;
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
        this.getButton("back").setAttribute("hidden", "true");
      }
    } else {
      this.canRewind = true;
      this.setAttribute("firstpage", "false");
      if (/Linux/.test(navigator.platform)) {
        this.getButton("back").setAttribute("hidden", "false");
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
    return this._wizardButtons.getButton(aDlgType);
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
    this._wizardHeader.
    querySelector(".wizard-header-label").textContent = label;
    let headerDescEl =
      this._wizardHeader.querySelector(".wizard-header-description");
    if (headerDescEl) {
      headerDescEl.textContent =
        this.currentPage.getAttribute("description");
    }
  }

  _hitEnter(evt) {
    if (!evt.defaultPrevented)
      this.advance();
  }

  _fireEvent(aTarget, aType) {
    var event = document.createEvent("Events");
    event.initEvent(aType, true, true);

    // handle dom event handlers
    return aTarget.dispatchEvent(event);
  }
}

customElements.define("wizard", MozWizard);

}
