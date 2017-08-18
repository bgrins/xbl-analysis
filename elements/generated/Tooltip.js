class FirefoxTooltip extends FirefoxPopupBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
<firefox-text-label class="tooltip-label" inherits="text=label" flex="1">
</firefox-text-label>
</children>`;
    let comment = document.createComment("Creating firefox-tooltip");
    this.prepend(comment);

    Object.defineProperty(this, "_mouseOutCount", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._mouseOutCount;
        return (this._mouseOutCount = 0);
      }
    });
    Object.defineProperty(this, "_isMouseOver", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._isMouseOver;
        return (this._isMouseOver = false);
      }
    });
  }
  disconnectedCallback() {}

  set label(val) {
    this.setAttribute("label", val);
    return val;
  }

  get label() {
    return this.getAttribute("label");
  }

  set page(val) {
    if (val) this.setAttribute("page", "true");
    else this.removeAttribute("page");
    return val;
  }

  get page() {
    return this.getAttribute("page") == "true";
  }

  get textProvider() {
    if (!this._textProvider) {
      this._textProvider = Components.classes[
        "@mozilla.org/embedcomp/default-tooltiptextprovider;1"
      ].getService(Components.interfaces.nsITooltipTextProvider);
    }
    return this._textProvider;
  }
  fillInPageTooltip(tipElement) {
    let tttp = this.textProvider;
    let textObj = {},
      dirObj = {};
    let shouldChangeText = tttp.getNodeText(tipElement, textObj, dirObj);
    if (shouldChangeText) {
      this.style.direction = dirObj.value;
      this.label = textObj.value;
    }
    return shouldChangeText;
  }
}
customElements.define("firefox-tooltip", FirefoxTooltip);
