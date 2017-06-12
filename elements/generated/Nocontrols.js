class XblNocontrols extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox flex="1" class="statusOverlay" hidden="true">
<box flex="1">
<box class="clickToPlay" flex="1">
</box>
</box>
</vbox>`;
    let comment = document.createComment("Creating xbl-nocontrols");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-nocontrols", XblNocontrols);
