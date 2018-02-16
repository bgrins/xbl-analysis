class FirefoxFindbarTextbox extends FirefoxTextbox {
  connectedCallback() {
    super.connectedCallback()

    this._findbar = null;

    this.setupHandlers();
  }

  get findbar() {
    return this._findbar ?
      this._findbar : this._findbar = document.getBindingParent(this);
  }
  _handleEnter(aEvent) {
    if (this.findbar._findMode == this.findbar.FIND_NORMAL) {
      let findString = this.findbar._findField;
      if (!findString.value)
        return;
      if (aEvent.getModifierState("Accel")) {
        this.findbar.getElement("highlight").click();
        return;
      }

      this.findbar.onFindAgainCommand(aEvent.shiftKey);
    } else {
      this.findbar._finishFAYT(aEvent);
    }
  }
  _handleTab(aEvent) {
    let shouldHandle = !aEvent.altKey && !aEvent.ctrlKey &&
      !aEvent.metaKey;
    if (shouldHandle &&
      this.findbar._findMode != this.findbar.FIND_NORMAL) {

      this.findbar._finishFAYT(aEvent);
    }
  }

  setupHandlers() {

    this.addEventListener("input", (event) => {
      // We should do nothing during composition.  E.g., composing string
      // before converting may matches a forward word of expected word.
      // After that, even if user converts the composition string to the
      // expected word, it may find second or later searching word in the
      // document.
      if (this.findbar._isIMEComposing) {
        return;
      }

      if (this._hadValue && !this.value) {
        this._willfullyDeleted = true;
        this._hadValue = false;
      } else if (this.value.trim()) {
        this._hadValue = true;
        this._willfullyDeleted = false;
      }
      this.findbar._find(this.value);
    });

    this.addEventListener("keypress", (event) => {
      let shouldHandle = !event.altKey && !event.ctrlKey &&
        !event.metaKey && !event.shiftKey;

      switch (event.keyCode) {
        case KeyEvent.DOM_VK_RETURN:
          this._handleEnter(event);
          break;
        case KeyEvent.DOM_VK_TAB:
          this._handleTab(event);
          break;
        case KeyEvent.DOM_VK_PAGE_UP:
        case KeyEvent.DOM_VK_PAGE_DOWN:
          if (shouldHandle) {
            this.findbar.browser.finder.keyPress(event);
            event.preventDefault();
          }
          break;
        case KeyEvent.DOM_VK_UP:
        case KeyEvent.DOM_VK_DOWN:
          this.findbar.browser.finder.keyPress(event);
          event.preventDefault();
          break;
      }
    });

    this.addEventListener("blur", (event) => {
      let findbar = this.findbar;
      // Note: This code used to remove the selection
      // if it matched an editable.
      findbar.browser.finder.enableSelection();
    });

    this.addEventListener("focus", (event) => {
      if (/Mac/.test(navigator.platform)) {
        let findbar = this.findbar;
        findbar._onFindFieldFocus();
      }
    });

    this.addEventListener("compositionstart", (event) => {
      // Don't close the find toolbar while IME is composing.
      let findbar = this.findbar;
      findbar._isIMEComposing = true;
      if (findbar._quickFindTimeout) {
        clearTimeout(findbar._quickFindTimeout);
        findbar._quickFindTimeout = null;
      }
    });

    this.addEventListener("compositionend", (event) => {
      let findbar = this.findbar;
      findbar._isIMEComposing = false;
      if (findbar._findMode != findbar.FIND_NORMAL)
        findbar._setFindCloseTimeout();
    });

    this.addEventListener("dragover", (event) => {
      if (event.dataTransfer.types.includes("text/plain"))
        event.preventDefault();
    });

    this.addEventListener("drop", (event) => {
      let value = event.dataTransfer.getData("text/plain");
      this.value = value;
      this.findbar._find(value);
      event.stopPropagation();
      event.preventDefault();
    });

  }
}