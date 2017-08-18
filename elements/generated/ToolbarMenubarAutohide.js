class FirefoxToolbarMenubarAutohide extends FirefoxToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-toolbar-menubar-autohide"
    );
    this.prepend(comment);

    try {
      undefined;
    } catch (e) {}
  }
  disconnectedCallback() {}
  _setInactive() {
    this.setAttribute("inactive", "true");
  }
  _setInactiveAsync() {
    this._inactiveTimeout = setTimeout(
      function(self) {
        if (self.getAttribute("autohide") == "true") {
          self._inactiveTimeout = null;
          self._setInactive();
        }
      },
      0,
      this
    );
  }
  _setActive() {
    if (this._inactiveTimeout) {
      clearTimeout(this._inactiveTimeout);
      this._inactiveTimeout = null;
    }
    this.removeAttribute("inactive");
  }
}
customElements.define(
  "firefox-toolbar-menubar-autohide",
  FirefoxToolbarMenubarAutohide
);
