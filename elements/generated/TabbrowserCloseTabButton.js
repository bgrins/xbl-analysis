class FirefoxTabbrowserCloseTabButton extends FirefoxToolbarbuttonImage {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating firefox-tabbrowser-close-tab-button"
    );
    this.prepend(comment);

    this.addEventListener("click", event => {
      var bindingParent = document.getBindingParent(this);
      var tabContainer = bindingParent.parentNode;
      tabContainer.tabbrowser.removeTab(bindingParent, {
        animate: true,
        byMouse: event.mozInputSource == MouseEvent.MOZ_SOURCE_MOUSE
      });
      // This enables double-click protection for the tab container
      // (see tabbrowser-tabs 'click' handler).
      tabContainer._blockDblClick = true;
    });

    this.addEventListener(
      "dblclick",
      event => {
        undefined;
      },
      true
    );

    this.addEventListener("dragstart", event => {
      undefined;
    });
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-tabbrowser-close-tab-button",
  FirefoxTabbrowserCloseTabButton
);
