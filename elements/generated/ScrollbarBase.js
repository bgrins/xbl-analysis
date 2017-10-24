class FirefoxScrollbarBase extends BaseElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addEventListener("contextmenu", event => {
      event.stopPropagation();
    });

    this.addEventListener("click", event => {
      event.stopPropagation();
    });

    this.addEventListener("dblclick", event => {
      event.stopPropagation();
    });

    this.addEventListener("command", event => {
      event.stopPropagation();
    });
  }
  disconnectedCallback() {}
}
customElements.define("firefox-scrollbar-base", FirefoxScrollbarBase);
