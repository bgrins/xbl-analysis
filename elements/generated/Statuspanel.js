class FirefoxStatuspanel extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:hbox class="statuspanel-inner">
        <xul:label class="statuspanel-label" role="status" aria-live="off" inherits="value=label,crop,mirror" flex="1" crop="end"></xul:label>
      </xul:hbox>
    `;

    window.addEventListener("resize", this);

    this._setupEventListeners();
  }

  set label(val) {
    if (!this.label) {
      this.removeAttribute("mirror");
      this.removeAttribute("sizelimit");
    }

    if (this.getAttribute("type") == "status" &&
      this.getAttribute("previoustype") == "status") {
      // Before updating the label, set the panel's current width as its
      // min-width to let the panel grow but not shrink and prevent
      // unnecessary flicker while loading pages. We only care about the
      // panel's width once it has been painted, so we can do this
      // without flushing layout.
      this.style.minWidth =
        window.QueryInterface(Ci.nsIInterfaceRequestor)
        .getInterface(Ci.nsIDOMWindowUtils)
        .getBoundsWithoutFlushing(this).width + "px";
    } else {
      this.style.minWidth = "";
    }

    if (val) {
      this.setAttribute("label", val);
      this.removeAttribute("inactive");
      this._mouseTargetRect = null;
      MousePosTracker.addListener(this);
    } else {
      this.setAttribute("inactive", "true");
      MousePosTracker.removeListener(this);
    }

    return val;
  }

  get label() {
    return this.hasAttribute("inactive") ? "" : this.getAttribute("label");
  }
  getMouseTargetRect() {
    if (!this._mouseTargetRect) {
      this._calcMouseTargetRect();
    }
    return this._mouseTargetRect;
  }
  onMouseEnter() {
    this._mirror();
  }
  onMouseLeave() {
    this._mirror();
  }
  handleEvent(event) {
    if (!this.label)
      return;

    switch (event.type) {
      case "resize":
        this._mouseTargetRect = null;
        break;
    }
  }
  _calcMouseTargetRect() {
    let container = this.parentNode;
    let alignRight = (getComputedStyle(container).direction == "rtl");
    let panelRect = this.getBoundingClientRect();
    let containerRect = container.getBoundingClientRect();

    this._mouseTargetRect = {
      top: panelRect.top,
      bottom: panelRect.bottom,
      left: alignRight ? containerRect.right - panelRect.width : containerRect.left,
      right: alignRight ? containerRect.right : containerRect.left + panelRect.width
    };
  }
  _mirror() {
    if (this.hasAttribute("mirror"))
      this.removeAttribute("mirror");
    else
      this.setAttribute("mirror", "true");

    if (!this.hasAttribute("sizelimit")) {
      this.setAttribute("sizelimit", "true");
      this._mouseTargetRect = null;
    }
  }
  disconnectedCallback() {
    window.removeEventListener("resize", this);
    MousePosTracker.removeListener(this);
  }

  _setupEventListeners() {

  }
}