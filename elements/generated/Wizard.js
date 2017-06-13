class XblWizard extends XblRootElement {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="wizard-header" anonid="Header">
</hbox>
<deck class="wizard-page-box" flex="1" anonid="Deck">
<children includes="wizardpage">
</children>
</deck>
<children>
</children>
<hbox class="wizard-buttons" anonid="Buttons" inherits="pagestep,firstpage,lastpage">
</hbox>`;
    let comment = document.createComment("Creating xbl-wizard");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set title(val) {
    return (document.title = val);
  }

  get title() {
    return document.title;
  }

  set canAdvance(val) {
    this._nextButton.disabled = !val;
    return (this._canAdvance = val);
  }

  get canAdvance() {
    return this._canAdvance;
  }

  set canRewind(val) {
    this._backButton.disabled = !val;
    return (this._canRewind = val);
  }

  get canRewind() {
    return this._canRewind;
  }

  get pageStep() {
    return this._pageStack.length;
  }

  get currentPage() {
    return this._currentPage;
  }

  get pageIndex() {
    return this._currentPage ? this._currentPage.pageIndex : -1;
  }

  get onFirstPage() {
    return this._pageStack.length == 1;
  }
  getButton(aDlgType) {
    var btns = this.getElementsByAttribute("dlgtype", aDlgType);
    return btns.item(0)
      ? btns[0]
      : document.getAnonymousElementByAttribute(
          this._wizardButtons,
          "dlgtype",
          aDlgType
        );
  }
  getPageById(aPageId) {
    var els = this.getElementsByAttribute("pageid", aPageId);
    return els.item(0);
  }
  extra1() {
    if (this.currentPage) this._fireEvent(this.currentPage, "extra1");
  }
  extra2() {
    if (this.currentPage) this._fireEvent(this.currentPage, "extra2");
  }
  rewind() {
    if (!this.canRewind) return;

    if (this.currentPage && !this._fireEvent(this.currentPage, "pagehide"))
      return;

    if (this.currentPage && !this._fireEvent(this.currentPage, "pagerewound"))
      return;

    if (!this._fireEvent(this, "wizardback")) return;

    this._pageStack.pop();
    this.currentPage = this._pageStack[this._pageStack.length - 1];
    this.setAttribute("pagestep", this._pageStack.length);
  }
  advance(aPageId) {
    if (!this.canAdvance) return;

    if (this.currentPage && !this._fireEvent(this.currentPage, "pagehide"))
      return;

    if (this.currentPage && !this._fireEvent(this.currentPage, "pageadvanced"))
      return;

    if (this.onLastPage && !aPageId) {
      if (this._fireEvent(this, "wizardfinish"))
        window.setTimeout(function() {
          window.close();
        }, 1);
    } else {
      if (!this._fireEvent(this, "wizardnext")) return;

      var page;
      if (aPageId) page = this.getPageById(aPageId);
      else {
        if (this.currentPage) {
          if (this._accessMethod == "random")
            page = this.getPageById(this.currentPage.next);
          else page = this.wizardPages[this.currentPage.pageIndex + 1];
        } else page = this.wizardPages[0];
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
    if (!this._fireEvent(this, "wizardcancel")) return true;

    window.close();
    window.setTimeout(function() {
      window.close();
    }, 1);
    return false;
  }
  _setInitialFocus(aEvent) {
    document.documentElement._hasLoaded = true;
    var focusInit = function() {
      // give focus to the first focusable element in the dialog
      if (!document.commandDispatcher.focusedElement)
        document.commandDispatcher.advanceFocusIntoSubtree(
          document.documentElement
        );

      try {
        var button = document.documentElement._wizardButtons.defaultButton;
        if (button) window.notifyDefaultButtonLoaded(button);
      } catch (e) {}
    };

    // Give focus after onload completes, see bug 103197.
    setTimeout(focusInit, 0);
  }
  _advanceFocusToPage(aPage) {
    if (!this._hasLoaded) return;

    document.commandDispatcher.advanceFocusIntoSubtree(aPage);

    // if advanceFocusIntoSubtree tries to focus one of our
    // dialog buttons, then remove it and put it on the root
    var focused = document.commandDispatcher.focusedElement;
    if (focused && focused.hasAttribute("dlgtype")) this.focus();
  }
  _initPages() {
    var meth = "sequential";
    var pages = this.wizardPages;
    for (var i = 0; i < pages.length; ++i) {
      var page = pages[i];
      page.pageIndex = i;
      if (page.next != "") meth = "random";
    }
    this._accessMethod = meth;
  }
  _initWizardButton(aName) {
    var btn = document.getAnonymousElementByAttribute(
      this._wizardButtons,
      "dlgtype",
      aName
    );
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
        label = this._bundle.formatStringFromName(
          "default-first-title",
          [this.title],
          1
        );
      }
    } else if (!label && this.onLastPage && this._bundle) {
      if (/Mac/.test(navigator.platform)) {
        label = this._bundle.GetStringFromName("default-last-title-mac");
      } else {
        label = this._bundle.formatStringFromName(
          "default-last-title",
          [this.title],
          1
        );
      }
    }
    this._wizardHeader.setAttribute("label", label);
    this._wizardHeader.setAttribute(
      "description",
      this.currentPage.getAttribute("description")
    );
  }
  _hitEnter(evt) {
    if (!evt.defaultPrevented) this.advance();
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
      if (returned == false) noCancel = false;
    }

    return noCancel;
  }
}
customElements.define("xbl-wizard", XblWizard);
