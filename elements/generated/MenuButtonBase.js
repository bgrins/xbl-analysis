class FirefoxMenuButtonBase extends FirefoxButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating firefox-menu-button-base");
    this.prepend(comment);

    Object.defineProperty(this, "_pendingActive", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._pendingActive;
        return (this._pendingActive = false);
      },
      set(val) {
        delete this._pendingActive;
        return (this._pendingActive = val);
      }
    });

    undefined;

    this.addEventListener("keypress", event => {
      undefined;
    });

    this.addEventListener("keypress", event => {
      undefined;
    });
  }
  disconnectedCallback() {}

  set buttonover(val) {
    var v = val || val == "true";
    if (!v && this.buttondown) {
      this.buttondown = false;
      this._pendingActive = true;
    } else if (this._pendingActive) {
      this.buttondown = true;
      this._pendingActive = false;
    }

    if (v) this.setAttribute("buttonover", "true");
    else this.removeAttribute("buttonover");
    return val;
  }

  get buttonover() {
    return this.getAttribute("buttonover");
  }

  set buttondown(val) {
    if (val || val == "true") this.setAttribute("buttondown", "true");
    else this.removeAttribute("buttondown");
    return val;
  }

  get buttondown() {
    return this.getAttribute("buttondown") == "true";
  }
  init() {
    var btn = document.getAnonymousElementByAttribute(this, "anonid", "button");
    if (!btn)
      throw 'XBL binding for <button type="menu-button"/> binding must contain an element with anonid="button"';

    var menubuttonParent = this;
    btn.addEventListener(
      "mouseover",
      function() {
        if (!this.disabled) menubuttonParent.buttonover = true;
      },
      true
    );
    btn.addEventListener(
      "mouseout",
      function() {
        menubuttonParent.buttonover = false;
      },
      true
    );
    btn.addEventListener(
      "mousedown",
      function() {
        if (!this.disabled) {
          menubuttonParent.buttondown = true;
          document.addEventListener("mouseup", menubuttonParent, true);
        }
      },
      true
    );
  }
  handleEvent(aEvent) {
    this._pendingActive = false;
    this.buttondown = false;
    document.removeEventListener("mouseup", this, true);
  }
}
customElements.define("firefox-menu-button-base", FirefoxMenuButtonBase);
