class XblToolbarMenubarAutohide extends XblToolbar {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment(
      "Creating xbl-toolbar-menubar-autohide"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "xbl-toolbar-menubar-autohide",
  XblToolbarMenubarAutohide
);
