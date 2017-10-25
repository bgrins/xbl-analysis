class FirefoxTabbrowserCloseTabButton extends FirefoxToolbarbuttonImage {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();

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
        // for the one-close-button case
        event.stopPropagation();
      },
      true
    );

    this.addEventListener("dragstart", event => {
      event.stopPropagation();
    });
  }
}
customElements.define(
  "firefox-tabbrowser-close-tab-button",
  FirefoxTabbrowserCloseTabButton
);
