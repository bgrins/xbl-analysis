class FirefoxSettingFulltoggleBool extends FirefoxSettingBool {
  connectedCallback() {
    super.connectedCallback();

    this.addEventListener(
      "command",
      event => {
        event.stopPropagation();
      },
      true
    );

    this.addEventListener(
      "click",
      event => {
        event.stopPropagation();
        this.input.checked = !this.input.checked;
        this.inputChanged();
        this.fireEvent("oncommand");
      },
      true
    );
  }
}
customElements.define(
  "firefox-setting-fulltoggle-bool",
  FirefoxSettingFulltoggleBool
);
