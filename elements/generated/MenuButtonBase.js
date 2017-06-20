class XblMenuButtonBase extends XblButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    try {
      undefined;
    } catch (e) {}
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-menu-button-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get buttonover() {
    return this.getAttribute("buttonover");
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
customElements.define("xbl-menu-button-base", XblMenuButtonBase);
